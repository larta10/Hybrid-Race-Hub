"""Compara voces candidatas para la narración y las puntúa sin intervención humana.

    python video/scripts/probar_voces.py [--salida=instagram-preview/voces]

Para cada voz genera la misma muestra (~20 s: gancho y primeras escenas de r103) y una frase con los
términos en inglés, y mide:
  a) inteligibilidad: tasa de error de palabras (WER) de faster-whisper sin pistas frente al texto;
  b) acento: "distinción" castellana entre /s/ y /θ/ con pares mínimos (sien-cien, sumo-zumo…), comparando
     la energía aguda del inicio de cada palabra (la /θ/ es mucho más débil que la /s/; con seseo, igual);
  c) naturalidad: velocidad, variación de entonación, silencios raros dentro de las frases, clics y saturación;
  d) pronunciación de HYROX, SkiErg, wall balls y Roxzone (Whisper con solo ese vocabulario como pista).
Escribe resultados.json y resultados.md en la carpeta de salida.
"""
from __future__ import annotations

import json
import os
import re
import sys
import wave
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import narrar  # noqa: E402
import motores  # noqa: E402

ROOT = narrar.ROOT
SALIDA = Path(next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--salida=")), ROOT / "instagram-preview" / "voces"))

CANDIDATAS = [
    {"id": "kokoro-ef_dora", "motor": "kokoro", "voz": "ef_dora", "velocidad": 0.9},
    {"id": "kokoro-em_alex", "motor": "kokoro", "voz": "em_alex", "velocidad": 0.9},
    {"id": "piper-carlfm", "motor": "piper", "modelo": "es_ES-carlfm-x_low", "length_scale": 1.06, "noise_scale": 0.62, "noise_w": 0.85},
]
TERMINOS = "En el HYROX, el SkiErg, los wall balls y la Roxzone deciden tu tiempo final."
ACENTO = "Sien, cien. Sumo, zumo. Sierra, cierra. Seta, zeta."  # muestra para escuchar la distinción
PATRONES = {
    # Se acepta lo que suena al término en inglés aunque Whisper lo escriba de otra forma (highrox, rock zone…)
    "HYROX": r"h[iíy]gh? ?ro(x|cks?)|h?[aá]i?rox|j[aá]i?ro(x|k?s)|hyrox",
    "SkiErg": r"ski ?[ae]rg|skierg|skier\b|esquí ?erg",
    "wall balls": r"wall ?b[ao]w?ls?|wol ?bols?|wall ?walls|world ?balls",
    "Roxzone": r"ro(x|cks?) ?(z|s|t)(o|ho)ne?|ro(x|ck) ?son|roxzone",
}


def texto_muestra() -> str:
    r = narrar.cargar(narrar.REELS / "r103-tu-primer-hyrox.json")
    return " ".join(r["narracion"]["escenas"][:5])


UNID = "cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete veintiocho veintinueve".split()
DECENAS = {3: "treinta", 4: "cuarenta", 5: "cincuenta", 6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa"}


def en_letras(n: int) -> str:
    if n < 30:
        return UNID[n]
    if n < 100:
        return DECENAS[n // 10] + ("" if n % 10 == 0 else " y " + UNID[n % 10])
    if n == 100:
        return "cien"
    cent = {1: "ciento", 5: "quinientos", 7: "setecientos", 9: "novecientos"}.get(n // 100, UNID[n // 100] + "cientos")
    return cent + ("" if n % 100 == 0 else " " + en_letras(n % 100))


def cifras_a_letras(t: str) -> str:
    return re.sub(r"\d+", lambda m: en_letras(int(m.group())) if int(m.group()) < 1000 else m.group(), t)


def canonico(t: str) -> str:
    """Cifras en letras, 'uno'→'un' y los términos en inglés reconocidos (High Rocks, Wall Bowls…) a su forma escrita."""
    t = cifras_a_letras(t)
    for k, pat in PATRONES.items():
        t = re.sub(pat, k, t, flags=re.I)
    return re.sub(r"\buno\b", "un", t, flags=re.I)


def wer(ref: str, hyp: str) -> float:
    a = [narrar.norm(w) for w in canonico(ref).split() if narrar.norm(w)]
    b = [narrar.norm(w) for w in canonico(hyp).split() if narrar.norm(w)]
    d = np.zeros((len(a) + 1, len(b) + 1), dtype=int)
    d[:, 0] = range(len(a) + 1)
    d[0, :] = range(len(b) + 1)
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (a[i - 1] != b[j - 1]))
    return d[len(a), len(b)] / max(1, len(a))


def leer(path: Path):
    with wave.open(str(path), "rb") as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    return sr, x


def f0_semitonos(x: np.ndarray, sr: int) -> float:
    """Desviación típica del tono (semitonos) con autocorrelación por tramos de 40 ms."""
    n = int(0.04 * sr)
    f0 = []
    for i in range(0, len(x) - n, n // 2):
        t = x[i : i + n] - x[i : i + n].mean()
        if np.sqrt((t**2).mean()) < 0.02:
            continue
        ac = np.correlate(t, t, "full")[n - 1 :]
        lo, hi = int(sr / 400), int(sr / 70)
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.4 * ac[0]:
            f0.append(sr / k)
    if len(f0) < 10:
        return 0.0
    st = 12 * np.log2(np.array(f0) / np.median(f0))
    st = st[np.abs(st) < 12]
    return float(st.std())


def naturalidad(x: np.ndarray, sr: int, palabras: list, n_frases: int) -> dict:
    dur_voz = palabras[-1]["hasta"] - palabras[0]["desde"] if palabras else len(x) / sr
    # Silencios raros: huecos entre palabras > 450 ms que no coinciden con un final de frase
    huecos = []
    for a, b in zip(palabras, palabras[1:]):
        g = b["desde"] - a["hasta"]
        if g > 0.45 and not re.search(r"[.!?…,]$", a["w"]):
            huecos.append(round(g, 2))
    # Clics: saltos entre muestras muy por encima de lo normal en la señal
    dx = np.abs(np.diff(x))
    umbral = max(0.25, 12 * np.percentile(dx, 99))
    clics = int((dx > umbral).sum())
    saturacion = float((np.abs(x) > 0.995).mean() * 100)
    return {
        "palabras_por_segundo": round(len(palabras) / max(0.1, dur_voz), 2),
        "variacion_tono_st": round(f0_semitonos(x, sr), 2),
        "silencios_raros": huecos,
        "clics": clics,
        "saturacion_pct": round(saturacion, 3),
    }


PARES = [("sien", "cien"), ("sumo", "zumo"), ("sierra", "cierra"), ("siervo", "ciervo"), ("sena", "cena"), ("sima", "cima"), ("seta", "zeta"), ("sebo", "cebo")]


def _fricativa_db(pcm: bytes, sr: int) -> float:
    """Energía por encima de 3 kHz en los primeros 120 ms de una palabra suelta, respecto a su pico (dB)."""
    x = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
    fl = int(0.01 * sr)
    fr = [np.sqrt((x[i : i + fl] ** 2).mean() + 1e-12) for i in range(0, len(x) - fl, fl)]
    mx = max(fr)
    on = next(i for i, v in enumerate(fr) if v > mx * 10 ** (-40 / 20))
    a = x[on * fl : on * fl + int(0.12 * sr)]
    e = np.abs(np.fft.rfft(a * np.hanning(len(a)))) ** 2
    f = np.fft.rfftfreq(len(a), 1 / sr)
    return float(10 * np.log10(e[f > 3000].sum() / (mx**2 * len(a)) + 1e-12))


def distincion(motor, cfg: dict) -> dict:
    """Pares mínimos /s/-/θ/ (sien-cien, sumo-zumo…) dichos sueltos: si la voz hace la distinción castellana, la
    palabra con /s/ empieza con mucha más energía aguda que la de /θ/. Con seseo (acento latinoamericano o
    andaluz) las dos suenan igual y la diferencia es ~0 dB. Mediana de la diferencia (dB)."""
    d = []
    for var in ({}, {"velocidad": 1.0, "length_scale": 1.0}):  # dos velocidades: 16 pares, medida más estable
        c = {**cfg, **{k: v for k, v in var.items() if k in cfg}}
        for ps, pt in PARES:
            sr, a = motores.sintetizar_frase(motor, c, ps)
            _, b = motores.sintetizar_frase(motor, c, pt)
            d.append(_fricativa_db(a, sr) - _fricativa_db(b, sr))
    return {"distincion_db": round(float(np.median(d)), 1), "pares": [round(v, 1) for v in d]}


def puntuar(r: dict) -> dict:
    """Puntuación 0-10 por criterio y total ponderado (inteligibilidad 30 %, acento 25 %, naturalidad 30 %, términos 15 %)."""
    a = max(0.0, 10 - 60 * r["wer"])  # 0 % → 10; 5 % → 7; ≥ 17 % → 0
    d = r["acento"].get("distincion_db")
    b = float(np.clip(4 + 1.5 * d, 0, 10))  # 0 dB (seseo) → 4; 3,3 dB (davefx, castellano) → 9; ≥ 4 dB → 10
    n = r["naturalidad"]
    c = float(np.clip(2 + 2 * n["variacion_tono_st"], 0, 9))  # entonación: 3,5 st → 9; 2 st → 6 (monótona)
    c += 1.0 if r["frecuencia_muestreo"] >= 22050 else -1.0  # banda completa frente a 16 kHz (sonido apagado)
    c -= 1.5 * len(n["silencios_raros"]) + 0.5 * min(4, n["clics"]) + (2 if n["saturacion_pct"] > 0.05 else 0)
    if not 2.0 <= n["palabras_por_segundo"] <= 3.0:
        c -= 1
    c = float(np.clip(c, 0, 10))
    t = 10 * (sum(r["terminos"].values()) + sum(r["terminos_con_pista"].values())) / (2 * len(PATRONES))
    total = 0.30 * a + 0.25 * b + 0.30 * c + 0.15 * t
    return {"inteligibilidad": round(a, 1), "acento": round(b, 1), "naturalidad": round(c, 1), "terminos": round(t, 1), "total": round(total, 2)}


REFERENCIAS = [  # Solo para calibrar la medida de acento (castellano seguro); NO son candidatas (licencia dudosa)
    {"id": "ref-davefx", "motor": "piper", "modelo": "es_ES-davefx-medium", "length_scale": 1.0, "noise_scale": 0.6, "noise_w": 0.8},
    {"id": "ref-sharvard", "motor": "piper", "modelo": "es_ES-sharvard-medium", "length_scale": 1.0, "noise_scale": 0.6, "noise_w": 0.8},
]


def main():
    from faster_whisper import WhisperModel

    SALIDA.mkdir(parents=True, exist_ok=True)
    dic = narrar.cargar(narrar.REELS / "pronunciacion.json")
    whisper = WhisperModel("small", device="cpu", compute_type="int8", download_root=str(narrar.WHISPER_DIR))
    texto = texto_muestra()
    resultados = []
    for c in CANDIDATAS:
        motor = motores.cargar_motor(c)
        dic_m = motores.diccionario(dic, c)
        for nombre, txt in (("muestra", texto), ("terminos", TERMINOS), ("acento", ACENTO)):
            wav = SALIDA / f"{c['id']}-{nombre}.wav"
            motores.sintetizar_texto(motor, c, [narrar.fonetica(f, dic_m) for f in narrar.frases(txt)], 0.22, wav)
        sr, x = leer(SALIDA / f"{c['id']}-muestra.wav")
        a16 = narrar.audio_16k(SALIDA / f"{c['id']}-muestra.wav")
        segs, _ = whisper.transcribe(a16, language="es", word_timestamps=True, beam_size=5, vad_filter=False)
        segs = list(segs)
        hyp = " ".join(s.text.strip() for s in segs)
        pal = [{"w": w.word.strip(), "desde": w.start, "hasta": w.end} for s in segs for w in (s.words or [])]
        t16 = narrar.audio_16k(SALIDA / f"{c['id']}-terminos.wav")
        # Sin pistas: ¿lo reconoce alguien que no sabe qué palabra viene?
        st, _ = whisper.transcribe(t16, language="es", beam_size=5, vad_filter=False)
        hyp_t = " ".join(s.text.strip() for s in st)
        ok = {k: bool(re.search(p, hyp_t, re.I)) for k, p in PATRONES.items()}
        # Con el vocabulario como pista (como en la alineación de subtítulos)
        st2, _ = whisper.transcribe(t16, language="es", beam_size=5, vad_filter=False, initial_prompt="HYROX, SkiErg, wall balls, Roxzone.")
        hyp_t2 = " ".join(s.text.strip() for s in st2)
        ok2 = {k: bool(re.search(p, hyp_t2, re.I)) for k, p in PATRONES.items()}
        r = {
            **{k: v for k, v in c.items()},
            "duracion_s": round(len(x) / sr, 1),
            "frecuencia_muestreo": sr,
            "wer": round(wer(texto, hyp), 3),
            "transcripcion": hyp,
            "acento": distincion(motor, c),
            "naturalidad": naturalidad(x, sr, pal, len(narrar.frases(texto))),
            "terminos_transcripcion": hyp_t,
            "terminos": ok,
            "terminos_con_pista_transcripcion": hyp_t2,
            "terminos_con_pista": ok2,
        }
        r["puntuacion"] = puntuar(r)
        resultados.append(r)
        print(json.dumps(r, ensure_ascii=False))
    refs = []
    for c in REFERENCIAS:
        try:
            m = motores.cargar_motor(c)
        except Exception as e:  # noqa: BLE001
            print(f"referencia {c['id']} no disponible: {e}")
            continue
        refs.append({"id": c["id"], "acento": distincion(m, c)})
        print(json.dumps(refs[-1], ensure_ascii=False))
    resultados.sort(key=lambda r: -r["puntuacion"]["total"])
    filas = ["| Voz | WER | Distinción θ/s | Tono (st) | Pal./s | Términos sin pista | Intelig. | Acento | Natural. | Términos | **Total** |", "|---|---|---|---|---|---|---|---|---|---|---|"]
    for r in resultados:
        p, n = r["puntuacion"], r["naturalidad"]
        filas.append(f"| {r['id']} | {r['wer']*100:.1f} % | {r['acento'].get('distincion_db')} dB | {n['variacion_tono_st']} | {n['palabras_por_segundo']} | {sum(r['terminos'].values())}/4 | {p['inteligibilidad']} | {p['acento']} | {p['naturalidad']} | {p['terminos']} | **{p['total']}** |")
    for r in refs:
        filas.append(f"| {r['id']} (referencia castellana, no candidata) | — | {r['acento'].get('distincion_db')} dB | — | — | — | — | — | — | — | — |")
    (SALIDA / "resultados.md").write_text(chr(10).join(filas) + chr(10), encoding="utf-8")
    print(chr(10).join(filas))
    (SALIDA / "resultados.json").write_text(json.dumps(resultados, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
