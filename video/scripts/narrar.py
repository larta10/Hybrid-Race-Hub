"""Narración de un Reel con una voz local (Kokoro o Piper, ver motores.py) y tiempos por palabra con faster-whisper.

    python video/scripts/narrar.py <reel_id> [<reel_id>…] [--forzar] [--voz=<archivo de voz.json>]

Lee instagram/reels/<id>.json ("narracion") e instagram/reels/voz.json, y escribe
instagram/reels/audio/<id>.mp3 y <id>.words.json. Si la huella (texto + voz + diccionario + versión del proceso)
coincide, no regenera nada. Todo es local y gratuito: no usa ningún servicio externo.

Cómo se sacan los tiempos de los subtítulos (alineación por frase):
  1. Cada frase (o trozo entre comas, en Piper) se sintetiza por separado: su inicio y su fin en el audio son exactos.
  2. faster-whisper "medium" transcribe SOLO esa frase con tiempos por palabra (con y sin el texto como pista) y
     se emparejan sus palabras con las del guion, que es lo que se muestra.
  3. Las palabras que Whisper no reconoce se reparten por sílabas dentro del hueco que dejan sus vecinas.
  4. Los tiempos se fuerzan a ser monótonos, sin solapes y dentro de los límites de la frase.
  5. Control: ninguna palabra dura menos de 0,06 s ni más de 1,2 s y el desfase medio frente a Whisper es menor de
     80 ms. Si una frase no pasa, se repite su alineación con otra estrategia y, si sigue sin pasar, se reparte
     por sílabas sobre la parte con voz de la frase (medida por energía).
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
import wave
from difflib import SequenceMatcher
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
ROOT = Path(__file__).resolve().parents[2]
REELS = ROOT / "instagram" / "reels"
AUDIO = REELS / "audio"
VOCES_DIR = Path(os.environ.get("PIPER_VOICES_DIR", ROOT / "video" / "cache" / "voces"))
WHISPER_DIR = Path(os.environ.get("WHISPER_MODELS_DIR", Path.home() / ".cache" / "hrh-whisper"))
FFMPEG = os.environ.get("FFMPEG_PATH") or str(ROOT / "video" / "node_modules" / "ffmpeg-static" / ("ffmpeg.exe" if os.name == "nt" else "ffmpeg"))
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main"

# Versión del proceso (síntesis por trozos, pausas, cadena de audio y alineación): forma parte de la huella
VERSION = "v3-frases-medium"
MODELO_ALINEACION = os.environ.get("WHISPER_ALINEACION", "medium")
# Claves de voz.json que no cambian el audio
CLAVES_META = ("licencia", "atribucion", "activa", "whisper")

# Pausa al cambiar de escena y duración mínima de cada bloque (s)
PAUSA_ESCENA = 0.25
DURACION_MINIMA = {"grafica": 3.5, "gancho": 1.6, "texto": 1.8, "conclusion": 2.2, "aplicacion": 3.5, "cierre": 1.5}
# Control de los tiempos por palabra
MIN_PALABRA = 0.06
MAX_PALABRA = 1.2
MAX_DESFASE = 0.08


def cargar(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


# ---------- Pronunciación ----------
def fonetica(texto: str, dic: dict[str, str]) -> str:
    """Sustituye términos en inglés por cómo deben sonar (los subtítulos usan siempre el original)."""
    out = texto
    for k in sorted(dic, key=len, reverse=True):
        out = re.sub(rf"(?<!\w){re.escape(k)}(?!\w)", dic[k], out, flags=re.IGNORECASE)
    return out


# ---------- Voz ----------
def asegurar_voz(modelo: str) -> Path:
    """Descarga el modelo de rhasspy/piper-voices si no está en caché. modelo = es_ES-carlfm-x_low"""
    lang, nombre, calidad = modelo.split("-")
    VOCES_DIR.mkdir(parents=True, exist_ok=True)
    onnx = VOCES_DIR / f"{modelo}.onnx"
    for suf in (".onnx", ".onnx.json"):
        dest = VOCES_DIR / f"{modelo}{suf}"
        if not dest.exists():
            import urllib.request

            url = f"{HF}/{lang.split('_')[0]}/{lang}/{nombre}/{calidad}/{modelo}{suf}"
            print(f"  descargando {url}")
            urllib.request.urlretrieve(url, dest)
    return onnx


def frases(texto: str) -> list[str]:
    return [f.strip() for f in re.split(r"(?<=[.!?…])\s+", texto.strip()) if f.strip()]


def silencio(sr: int, s: float, ancho=2, canales=1) -> bytes:
    return b"\x00" * int(sr * s) * ancho * canales


# ---------- Alineación ----------
def norm(w: str) -> str:
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^\w%]", "", w)


def silabas(w: str) -> int:
    """Sílabas aproximadas en castellano (grupos de vocales); las cifras cuentan como palabra larga."""
    n = norm(w)
    if re.search(r"\d", n):
        return 3
    return max(1, len(re.findall(r"[aeiouy]+", n)))


def repartir_por_silabas(palabras: list[str], desde: float, hasta: float) -> list[dict]:
    pesos = [silabas(w) for w in palabras]
    tot = sum(pesos) or 1
    out, t = [], desde
    for w, p in zip(palabras, pesos):
        d = (hasta - desde) * p / tot
        out.append({"desde": t, "hasta": t + d})
        t += d
    return out


def alinear(originales: list[str], transcritas: list[dict], t0: float, t1: float) -> list[dict]:
    """Asigna a cada palabra del texto original el tiempo de su pareja transcrita. Las que Whisper no reconoce
    se reparten por sílabas en el hueco entre sus vecinas, así el subtítulo siempre muestra el texto correcto."""
    a = [norm(w) for w in originales]
    b = [norm(x["w"]) for x in transcritas]
    res: list[dict | None] = [None] * len(originales)
    ok = [False] * len(originales)
    for tag, i1, i2, j1, j2 in SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                x = transcritas[j1 + k]
                res[i1 + k] = {"desde": x["desde"], "hasta": x["hasta"]}
                ok[i1 + k] = True
        elif tag == "replace" and j2 > j1:
            d, h = transcritas[j1]["desde"], transcritas[j2 - 1]["hasta"]
            for k, r in enumerate(repartir_por_silabas(originales[i1:i2], d, h)):
                res[i1 + k] = r
    # Huecos: por sílabas entre los vecinos conocidos
    i = 0
    while i < len(res):
        if res[i] is not None:
            i += 1
            continue
        j = i
        while j < len(res) and res[j] is None:
            j += 1
        ini = res[i - 1]["hasta"] if i > 0 else t0
        fin = res[j]["desde"] if j < len(res) else t1
        if fin - ini < MIN_PALABRA * (j - i):
            fin = ini + MIN_PALABRA * (j - i)
        for k, r in enumerate(repartir_por_silabas(originales[i:j], ini, fin)):
            res[i + k] = r
        i = j
    return [{"w": w, **r, "ok": o} for w, r, o in zip(originales, res, ok)]


def ajustar(pal: list[dict], t0: float, t1: float) -> list[dict]:
    """Tiempos monótonos, sin solapes, dentro de [t0, t1] y con duraciones entre MIN_PALABRA y MAX_PALABRA."""
    n = len(pal)
    if not n:
        return pal
    # Si no caben todas con la duración mínima, se reparten por sílabas en toda la frase
    if t1 - t0 < MIN_PALABRA * n:
        return [{**p, **r} for p, r in zip(pal, repartir_por_silabas([p["w"] for p in pal], t0, max(t1, t0 + MIN_PALABRA * n)))]
    out = [dict(p) for p in pal]
    for k, p in enumerate(out):
        lo = out[k - 1]["hasta"] if k else t0
        reserva = MIN_PALABRA * (n - k - 1)  # sitio para las que quedan
        p["desde"] = min(max(p["desde"], lo), t1 - reserva - MIN_PALABRA)
        p["hasta"] = min(max(p["hasta"], p["desde"] + MIN_PALABRA), t1 - reserva, p["desde"] + MAX_PALABRA)
    # La palabra que acaba la frase llega hasta el final de la voz (sin pasar de MAX_PALABRA)
    out[-1]["hasta"] = min(t1, out[-1]["desde"] + MAX_PALABRA)
    # Sin huecos raros dentro de la frase: si una palabra acaba mucho antes de que empiece la siguiente,
    # la siguiente sigue empezando cuando suena (el subtítulo cambia al empezar la palabra)
    return out


def control(pal: list[dict], trans: list[dict]) -> dict:
    """Comprobaciones de la frase: duraciones y desfase medio frente a los tiempos crudos de Whisper."""
    cortas = [p["w"] for p in pal if p["hasta"] - p["desde"] < MIN_PALABRA - 1e-3]
    largas = [p["w"] for p in pal if p["hasta"] - p["desde"] > MAX_PALABRA + 1e-3]
    a = [norm(p["w"]) for p in pal]
    b = [norm(x["w"]) for x in trans]
    des = []
    for tag, i1, i2, j1, _ in SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if tag == "equal":
            des += [abs(pal[i1 + k]["desde"] - trans[j1 + k]["desde"]) for k in range(i2 - i1)]
    media = sum(des) / len(des) if des else 0.0
    return {"cortas": cortas, "largas": largas, "desfase_ms": int(round(float(media) * 1000)), "emparejadas": len(des), "ok": bool(not cortas and not largas and float(media) < MAX_DESFASE)}


UNIDADES = ("cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete "
            "dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete "
            "veintiocho veintinueve").split()
DECENAS = {3: "treinta", 4: "cuarenta", 5: "cincuenta", 6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa"}
CENTENAS = {1: "ciento", 5: "quinientos", 7: "setecientos", 9: "novecientos"}


def en_letras(n: int) -> str:
    """Número (0-999 999) en letras, en castellano."""
    if n < 30:
        return UNIDADES[n]
    if n < 100:
        return DECENAS[n // 10] + ("" if n % 10 == 0 else " y " + UNIDADES[n % 10])
    if n < 1000:
        if n == 100:
            return "cien"
        c = CENTENAS.get(n // 100, UNIDADES[n // 100] + "cientos")
        return c + ("" if n % 100 == 0 else " " + en_letras(n % 100))
    m = "mil" if n // 1000 == 1 else en_letras(n // 1000) + " mil"
    return m + ("" if n % 1000 == 0 else " " + en_letras(n % 1000))


def expandir_cifras(trans: list[dict]) -> list[dict]:
    """Whisper escribe "86" o "73%": se pasan a palabras repartiendo el tiempo, para casarlas con el guion."""
    out = []
    for x in trans:
        m = re.fullmatch(r"([¿¡(]*)(\d{1,6})(%?)([.,;:!?)]*)", x["w"].replace(".", "") if re.fullmatch(r"\d{1,3}(\.\d{3})+[.,]?", x["w"]) else x["w"])
        if not m:
            out.append(x)
            continue
        ws = en_letras(int(m.group(2))).split() + (["por", "ciento"] if m.group(3) else [])
        paso = (x["hasta"] - x["desde"]) / len(ws)
        out += [{"w": w, "desde": x["desde"] + paso * k, "hasta": x["desde"] + paso * (k + 1)} for k, w in enumerate(ws)]
    return out


def coincidencia(originales: list[str], trans: list[dict]) -> float:
    a = [norm(w) for w in originales]
    b = [norm(x["w"]) for x in trans]
    iguales = sum(i2 - i1 for tag, i1, i2, _, _ in SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes() if tag == "equal")
    extra = max(0, len(b) - len(a))  # palabras inventadas (alucinaciones) restan
    return (iguales - extra) / max(1, len(a))


def transcribir_frase(modelo, audio, texto: str, t0: float, t1: float, pre: float = 0.5, beam: int = 5) -> tuple[list[dict], float]:
    """Transcribe una frase con y sin el texto como pista y se queda con la versión que mejor casa con el guion.
    Se antepone silencio (pre), que evita las alucinaciones de Whisper al empezar en seco."""
    import numpy as np

    audio = np.concatenate([np.zeros(int(16000 * pre), dtype=np.float32), audio, np.zeros(int(16000 * 0.2), dtype=np.float32)])
    orig = texto.split()
    mejor, mejor_c = [], -1.0
    for pista in (None, texto):
        res, _ = modelo.transcribe(audio, language="es", word_timestamps=True, beam_size=beam, vad_filter=False, initial_prompt=pista, condition_on_previous_text=False)
        trans = expandir_cifras([{"w": w.word.strip(), "desde": min(t1, max(t0, t0 + w.start - pre)), "hasta": min(t1, max(t0, t0 + w.end - pre))} for r in res for w in (r.words or [])])
        c = coincidencia(orig, trans)
        if c > mejor_c:
            mejor, mejor_c = trans, c
        if c >= 0.95:
            break
    return mejor, round(mejor_c, 3)


def tramo_con_voz(audio16, t0: float, umbral_db: float = -40) -> tuple[float, float]:
    """Inicio y fin de la parte con voz de una frase (energía en ventanas de 10 ms)."""
    import numpy as np

    n = 160
    e = [float(np.sqrt((audio16[i : i + n] ** 2).mean() + 1e-12)) for i in range(0, max(1, len(audio16) - n), n)]
    if not e:
        return t0, t0 + len(audio16) / 16000
    mx = max(e)
    voz = [k for k, v in enumerate(e) if v > mx * 10 ** (umbral_db / 20)]
    return t0 + voz[0] * 0.01, t0 + (voz[-1] + 1) * 0.01


def segmentos(reel: dict) -> list[dict]:
    n = reel["narracion"]
    segs = []
    for i, t in enumerate(n["escenas"]):
        e = reel["escenas"][i]
        segs.append({"tipo": "gancho" if i == 0 else ("grafica" if e.get("grafica") else "texto"), "i": i, "texto": t})
    segs.append({"tipo": "conclusion", "texto": n["conclusion"]})
    segs.append({"tipo": "aplicacion", "texto": n["aplicacion"]})
    segs.append({"tipo": "cierre", "texto": n["cierre"]})
    return segs


def huella(reel: dict, voz: dict, dic: dict) -> str:
    base = json.dumps([VERSION, MODELO_ALINEACION, reel["narracion"], reel.get("escenas") and [bool(e.get("grafica")) for e in reel["escenas"]], voz, dic], ensure_ascii=False, sort_keys=True)
    return hashlib.sha1(base.encode("utf-8")).hexdigest()[:16]


def voz_para_huella(cfg: dict) -> dict:
    """Todo lo de voz.json que cambia el audio (cualquier clave nueva cuenta, salvo las de CLAVES_META)."""
    return {k: v for k, v in cfg.items() if k not in CLAVES_META}


def audio_16k(path) -> "numpy.ndarray":
    """Audio mono a 16 kHz en float32 decodificado con nuestro ffmpeg (sin depender de PyAV)."""
    import numpy as np

    r = subprocess.run([FFMPEG, "-hide_banner", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode("utf-8", "ignore")[-500:])
    return np.frombuffer(r.stdout, dtype=np.float32).copy()


def ffmpeg(*args):
    r = subprocess.run([FFMPEG, "-hide_banner", "-y", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-800:])
    return r.stderr


def escribir_wav(path: Path, sr: int, pcm: bytes):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm)


def alinear_frase(modelo, wav: Path, texto: str, t0: float, t1: float) -> tuple[list[dict], dict]:
    """Tiempos de las palabras de una frase dentro de [t0, t1], con control y reintento."""
    a16 = audio_16k(wav)
    orig = texto.split()
    intentos = [{"pre": 0.5, "beam": 5}, {"pre": 0.3, "beam": 8}, {"pre": 1.0, "beam": 5}]
    mejor = None
    for k, it in enumerate(intentos):
        trans, c = transcribir_frase(modelo, a16, texto, t0, t1, **it)
        pal = ajustar(alinear(orig, trans, t0, t1), t0, t1)
        ctl = {**control(pal, trans), "coincidencia": c, "intento": k + 1}
        if mejor is None or (ctl["ok"], c) > (mejor[1]["ok"], mejor[1]["coincidencia"]):
            mejor = (pal, ctl, trans)
        if ctl["ok"]:
            break
    pal, ctl, trans = mejor
    if not ctl["ok"]:
        # Último recurso: por sílabas sobre la parte con voz de la frase
        v0, v1 = tramo_con_voz(a16, t0)
        pal = ajustar([{"w": w, **r, "ok": False} for w, r in zip(orig, repartir_por_silabas(orig, v0, v1))], t0, t1)
        ctl = {**control(pal, trans), "coincidencia": ctl["coincidencia"], "intento": "silabas"}
    ctl["transcripcion"] = " ".join(x["w"] for x in trans)
    return pal, ctl


def narrar(reel_id: str, forzar=False, voz_path: Path | None = None):
    reel_path = REELS / f"{reel_id}.json"
    reel = cargar(reel_path)
    if not reel.get("narracion"):
        print(f"{reel_id}: sin narración en el guion")
        return
    import motores

    voz_cfg = cargar(voz_path or REELS / "voz.json")
    dic = motores.diccionario(cargar(REELS / "pronunciacion.json"), voz_cfg)
    # Pronunciación propia del guion (solo cambia la huella de los reels que la usan)
    dic = {**dic, **reel.get("pronunciacion", {})}
    h = huella(reel, voz_para_huella(voz_cfg), dic)
    AUDIO.mkdir(parents=True, exist_ok=True)
    mp3 = AUDIO / f"{reel_id}.mp3"
    words_p = AUDIO / f"{reel_id}.words.json"
    if not forzar and mp3.exists() and words_p.exists() and cargar(words_p).get("hash") == h:
        print(f"{reel_id}: audio al día ({h})")
        return

    from faster_whisper import WhisperModel

    voz = motores.cargar_motor(voz_cfg)
    tmp = Path(tempfile.mkdtemp(prefix="narra-"))
    sr = None
    pcm = b""
    t = 0.0
    segs = segmentos(reel)
    lista_frases = []  # [{seg, texto, desde, hasta, wav}]
    for idx, s in enumerate(segs):
        s["desde"] = t
        partes = motores.trozos(s["texto"], voz_cfg)
        for k, (f, pausa) in enumerate(partes):
            sr_, data = motores.sintetizar_frase(voz, voz_cfg, fonetica(f.replace("*", ""), dic))
            sr = sr or sr_
            dur = len(data) / 2 / sr
            wav = tmp / f"f{len(lista_frases)}.wav"
            escribir_wav(wav, sr, data)
            lista_frases.append({"seg": idx, "texto": f, "desde": t, "hasta": t + dur, "wav": wav})
            pcm += data
            t += dur
            if k < len(partes) - 1:  # pausa según la puntuación; tras la última, la de cambio de escena
                pcm += silencio(sr, pausa)
                t += pausa
        voz_hasta = t
        minimo = DURACION_MINIMA[s["tipo"]] - PAUSA_ESCENA
        if s["tipo"] == "grafica" and reel["escenas"][s["i"]].get("fuente") is None:
            minimo = max(minimo, 3.5 - PAUSA_ESCENA)
        relleno = max(0.0, minimo - (voz_hasta - s["desde"]))
        s["voz_desde"], s["voz_hasta"] = s["desde"], voz_hasta
        pcm += silencio(sr, relleno + PAUSA_ESCENA)
        t += relleno + PAUSA_ESCENA
        s["hasta"] = t
    # Cierre: 1,5 s más después de la última palabra
    pcm += silencio(sr, 1.5 - PAUSA_ESCENA)
    total = t + 1.5 - PAUSA_ESCENA
    segs[-1]["hasta"] = total

    crudo = tmp / "crudo.wav"
    escribir_wav(crudo, sr, pcm)

    # Alineación frase a frase (los tiempos no cambian con el postproceso)
    modelo = WhisperModel(MODELO_ALINEACION, device="cpu", compute_type="int8", download_root=str(WHISPER_DIR))
    palabras = []
    controles = []
    for fi, f in enumerate(lista_frases):
        pal, ctl = alinear_frase(modelo, f["wav"], f["texto"], f["desde"], f["hasta"])
        controles.append({"frase": fi, **{k: v for k, v in ctl.items() if k != "transcripcion"}})
        if not ctl["ok"]:
            print(f"   AVISO frase {fi + 1} \"{f['texto']}\": {ctl}")
        for p in pal:
            palabras.append({"w": p["w"], "desde": p["desde"], "hasta": p["hasta"], "seg": f["seg"], "frase": fi})
        segs[f["seg"]].setdefault("transcripcion", []).append(ctl["transcripcion"])

    # Postproceso común (motores.CADENA_VOZ) y -14 LUFS / -1 dBTP
    motores.postproceso(FFMPEG, crudo, mp3)

    ok = sum(1 for c in controles if c["ok"])
    out = {
        "hash": h,
        "voz": motores.nombre_voz(voz_cfg),
        "duracion": round(total, 3),
        "segmentos": [{k: (round(v, 3) if isinstance(v, float) else (" ".join(v) if k == "transcripcion" else v)) for k, v in s.items() if k != "texto"} for s in segs],
        "frases": [{"seg": f["seg"], "desde": round(f["desde"], 3), "hasta": round(f["hasta"], 3), "texto": f["texto"]} for f in lista_frases],
        "control": {"frases_ok": ok, "frases": len(controles), "desfase_medio_ms": round(sum(c["desfase_ms"] for c in controles) / max(1, len(controles))), "detalle": controles},
        "palabras": [{**p, "desde": round(p["desde"], 3), "hasta": round(p["hasta"], 3)} for p in palabras],
    }
    words_p.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{reel_id}: {total:.1f} s de narración, {len(palabras)} palabras, {ok}/{len(controles)} frases con control OK (desfase medio {out['control']['desfase_medio_ms']} ms) → {mp3.name}")
    for s in segs:
        print(f"   [{s['tipo']}] {' | '.join(s.get('transcripcion', []))}")
    for f in tmp.iterdir():
        f.unlink()
    tmp.rmdir()


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    forzar = "--forzar" in sys.argv
    voz = next((Path(a.split("=", 1)[1]) for a in sys.argv if a.startswith("--voz=")), None)
    if not args:
        print(__doc__)
        sys.exit(1)
    for rid in args:
        narrar(rid, forzar=forzar, voz_path=voz)
