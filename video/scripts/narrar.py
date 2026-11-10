"""Narración de un Reel con una voz local (Kokoro o Piper, ver motores.py) y tiempos por palabra con faster-whisper.

    python video/scripts/narrar.py <reel_id> [<reel_id>…] [--forzar] [--voz=<archivo de voz.json>]

Lee instagram/reels/<id>.json ("narracion") e instagram/reels/voz.json, y escribe
instagram/reels/audio/<id>.mp3 y <id>.words.json. Si el hash (texto + voz) coincide, no
regenera nada. Todo es local y gratuito: no usa ningún servicio externo.
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
WHISPER_DIR = Path(os.environ.get("WHISPER_MODELS_DIR", ROOT / "video" / "cache" / "whisper"))
FFMPEG = os.environ.get("FFMPEG_PATH") or str(ROOT / "video" / "node_modules" / "ffmpeg-static" / ("ffmpeg.exe" if os.name == "nt" else "ffmpeg"))
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main"

# Parámetros de la voz que cambian el audio (forman parte del hash)
CLAVES_VOZ = ("motor", "voz", "velocidad", "modelo", "length_scale", "noise_scale", "noise_w", "pausa_frases")

# Pausas entre bloques (s): tras cada escena y antes del cierre
PAUSA_ESCENA = 0.25
DURACION_MINIMA = {"grafica": 3.5, "gancho": 1.6, "texto": 1.8, "conclusion": 2.2, "aplicacion": 3.5, "cierre": 1.5}


def cargar(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


# ---------- Pronunciación ----------
def fonetica(texto: str, dic: dict[str, str]) -> str:
    """Sustituye términos en inglés por cómo deben sonar (solo para Piper; los subtítulos usan el original)."""
    out = texto
    for k in sorted(dic, key=len, reverse=True):
        out = re.sub(rf"(?<!\w){re.escape(k)}(?!\w)", dic[k], out, flags=re.IGNORECASE)
    return out


# ---------- Voz ----------
def asegurar_voz(modelo: str) -> Path:
    """Descarga el modelo de rhasspy/piper-voices si no está en caché. modelo = es_ES-davefx-medium"""
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


def alinear(originales: list[str], transcritas: list[dict], t0: float, t1: float) -> list[dict]:
    """Asigna a cada palabra del texto original el tiempo de su pareja transcrita. Las que Whisper
    no reconoce se reparten entre sus vecinas, así el subtítulo siempre muestra el texto correcto."""
    a = [norm(w) for w in originales]
    b = [norm(x["w"]) for x in transcritas]
    res: list[dict | None] = [None] * len(originales)
    for tag, i1, i2, j1, j2 in SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                x = transcritas[j1 + k]
                res[i1 + k] = {"desde": x["desde"], "hasta": x["hasta"]}
        elif tag == "replace" and j2 > j1:
            d, h = transcritas[j1]["desde"], transcritas[j2 - 1]["hasta"]
            n = i2 - i1
            for k in range(n):
                res[i1 + k] = {"desde": d + (h - d) * k / n, "hasta": d + (h - d) * (k + 1) / n}
    # Huecos: interpolar entre vecinos conocidos
    for i in range(len(res)):
        if res[i] is None:
            prev = next((res[j]["hasta"] for j in range(i - 1, -1, -1) if res[j]), t0)
            nxt_i = next((j for j in range(i + 1, len(res)) if res[j]), None)
            nxt = res[nxt_i]["desde"] if nxt_i is not None else t1
            hueco = [j for j in range(i, nxt_i if nxt_i is not None else len(res)) if res[j] is None]
            paso = max(0.05, (nxt - prev) / max(1, len(hueco)))
            for k, j in enumerate(hueco):
                res[j] = {"desde": prev + paso * k, "hasta": prev + paso * (k + 1)}
    return [{"w": w, **r} for w, r in zip(originales, res)]


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


def transcribir_segmento(modelo, audio, texto: str, t0: float) -> tuple[list[dict], float]:
    """Transcribe un segmento con y sin el texto como pista y se queda con la versión que mejor casa con el guion.
    Se antepone medio segundo de silencio, que evita las alucinaciones de Whisper al empezar en seco."""
    import numpy as np

    pre = 0.5
    audio = np.concatenate([np.zeros(int(16000 * pre), dtype=np.float32), audio])
    orig = texto.split()
    mejor, mejor_c = [], -1.0
    for pista in (None, texto):
        res, _ = modelo.transcribe(audio, language="es", word_timestamps=True, beam_size=5, vad_filter=False, initial_prompt=pista, condition_on_previous_text=False)
        trans = expandir_cifras([{"w": w.word.strip(), "desde": max(t0, t0 + w.start - pre), "hasta": max(t0, t0 + w.end - pre)} for r in res for w in (r.words or [])])
        c = coincidencia(orig, trans)
        if c > mejor_c:
            mejor, mejor_c = trans, c
        if c >= 0.95:
            break
    return mejor, round(mejor_c, 3)


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
    base = json.dumps([reel["narracion"], reel.get("escenas") and [bool(e.get("grafica")) for e in reel["escenas"]], voz, dic], ensure_ascii=False, sort_keys=True)
    return hashlib.sha1(base.encode("utf-8")).hexdigest()[:16]


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
    h = huella(reel, {k: voz_cfg[k] for k in CLAVES_VOZ if k in voz_cfg}, dic)
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
    for s in segs:
        trozos = []
        for f in frases(s["texto"]):
            sr_, data = motores.sintetizar_frase(voz, voz_cfg, fonetica(f, dic))
            sr = sr or sr_
            trozos.append(data)
        # Pausa natural entre frases (150-300 ms)
        cuerpo = silencio(sr, voz_cfg["pausa_frases"]).join(trozos)
        dur = len(cuerpo) / 2 / sr
        minimo = DURACION_MINIMA[s["tipo"]] - PAUSA_ESCENA
        if s["tipo"] == "grafica" and reel["escenas"][s["i"]].get("fuente") is None:
            minimo = max(minimo, 3.5 - PAUSA_ESCENA)
        relleno = max(0.0, minimo - dur)
        s["voz_desde"] = t
        s["voz_hasta"] = t + dur
        pcm += cuerpo + silencio(sr, relleno + PAUSA_ESCENA)
        s["desde"] = t
        t += dur + relleno + PAUSA_ESCENA
        s["hasta"] = t
    # Cierre: 1,5 s más después de la última palabra
    pcm += silencio(sr, 1.5 - PAUSA_ESCENA)
    total = t + 1.5 - PAUSA_ESCENA
    segs[-1]["hasta"] = total

    crudo = tmp / "crudo.wav"
    with wave.open(str(crudo), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm)

    # Alineación por segmento sobre el audio crudo (los tiempos no cambian con el postproceso)
    modelo = WhisperModel(voz_cfg.get("whisper", "small"), device="cpu", compute_type="int8", download_root=str(WHISPER_DIR))
    palabras = []
    transcrito_total = []
    for idx, s in enumerate(segs):
        seg_wav = tmp / f"seg{idx}.wav"
        ffmpeg("-ss", f"{s['voz_desde']:.3f}", "-t", f"{s['voz_hasta'] - s['voz_desde'] + 0.05:.3f}", "-i", str(crudo), str(seg_wav))
        trans, s["coincidencia"] = transcribir_segmento(modelo, audio_16k(seg_wav), s["texto"], s["voz_desde"])
        transcrito_total.append(" ".join(x["w"] for x in trans))
        orig = s["texto"].split()
        for p in alinear(orig, trans, s["voz_desde"], s["voz_hasta"]):
            palabras.append({**p, "seg": idx})
        if s["coincidencia"] < 0.7:
            print(f"   AVISO [{s['tipo']}]: Whisper solo casa el {s['coincidencia']:.0%} de las palabras; tiempos repartidos")
        s["transcripcion"] = transcrito_total[-1]

    # Postproceso: corte < 80 Hz, presencia 2-4 kHz, compresión ligera, casi sin reverberación, -14 LUFS.
    # loudnorm sola se queda ~1 LU corta con tantas pausas: se mide el resultado y se corrige con una ganancia fija
    # (con un limitador a -1,5 dBFS para los picos sueltos)
    base = "highpass=f=80,equalizer=f=3000:width_type=o:width=1.2:g=2.5,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,aecho=0.8:0.3:22:0.06,loudnorm=I=-14:TP=-1.5:LRA=11"
    pre = tmp / "post.wav"
    ffmpeg("-i", str(crudo), "-af", base, "-ar", "44100", "-ac", "1", str(pre))
    log = ffmpeg("-i", str(pre), "-af", "loudnorm=I=-14:TP=-1.5:print_format=json", "-f", "null", "-")
    med = json.loads(log[log.rindex("{") : log.rindex("}") + 1])
    gan = max(-6.0, min(6.0, -14.0 - float(med["input_i"])))
    fin = f"volume={gan:.2f}dB,alimiter=limit=0.84:attack=2:release=50:level=false"
    ffmpeg("-i", str(pre), "-af", fin, "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k", str(mp3))

    out = {
        "hash": h,
        "voz": motores.nombre_voz(voz_cfg),
        "duracion": round(total, 3),
        "segmentos": [{k: (round(v, 3) if isinstance(v, float) else v) for k, v in s.items() if k != "texto"} for s in segs],
        "palabras": [{**p, "desde": round(p["desde"], 3), "hasta": round(p["hasta"], 3)} for p in palabras],
    }
    words_p.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{reel_id}: {total:.1f} s de narración, {len(palabras)} palabras → {mp3.name}")
    for s in segs:
        print(f"   [{s['tipo']}] {s['transcripcion']}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    forzar = "--forzar" in sys.argv
    voz = next((Path(a.split("=", 1)[1]) for a in sys.argv if a.startswith("--voz=")), None)
    if not args:
        print(__doc__)
        sys.exit(1)
    for rid in args:
        narrar(rid, forzar=forzar, voz_path=voz)
