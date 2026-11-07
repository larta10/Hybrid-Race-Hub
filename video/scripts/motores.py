"""Motores de voz locales para la narración (sin servicios externos, sin cuentas ni claves).

- kokoro: Kokoro-82M (pesos Apache-2.0) en ONNX con kokoro-onnx (MIT). Ficheros del modelo desde las
  releases públicas de GitHub de kokoro-onnx; se guardan en HRH_MODELS_DIR (D:\\hrh-video\\models en local).
- piper: Piper (piper-tts) con voces de rhasspy/piper-voices.

Interfaz común: cargar_motor(cfg) y sintetizar_frase(motor, cfg, texto) -> (sr, pcm int16 mono en bytes).
"""
from __future__ import annotations

import os
import urllib.request
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
_LOCAL = Path("D:/hrh-video/models")
MODELS_DIR = Path(os.environ.get("HRH_MODELS_DIR") or (_LOCAL if _LOCAL.exists() else Path.home() / ".cache" / "hrh-modelos"))
KOKORO_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0"
KOKORO_FICHEROS = {
    "kokoro-v1.0.onnx": "7d5df8ecf7d4b1878015a32686053fd0eebe2bc377234608764cc0ef3636a6c5",
    "voices-v1.0.bin": "bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d",
}


def _sha256(p: Path) -> str:
    import hashlib

    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def asegurar_kokoro() -> Path:
    d = MODELS_DIR / "kokoro"
    d.mkdir(parents=True, exist_ok=True)
    for nombre, sha in KOKORO_FICHEROS.items():
        p = d / nombre
        if not p.exists():
            print(f"  descargando {KOKORO_URL}/{nombre}")
            tmp = p.with_suffix(".part")
            urllib.request.urlretrieve(f"{KOKORO_URL}/{nombre}", tmp)
            if _sha256(tmp) != sha:
                tmp.unlink()
                raise RuntimeError(f"{nombre}: la suma SHA-256 no coincide")
            tmp.rename(p)
    return d


def cargar_motor(cfg: dict):
    motor = cfg.get("motor", "piper")
    if motor == "kokoro":
        from kokoro_onnx import Kokoro

        d = asegurar_kokoro()
        return Kokoro(str(d / "kokoro-v1.0.onnx"), str(d / "voices-v1.0.bin"))
    if motor == "piper":
        import narrar
        from piper import PiperVoice

        return PiperVoice.load(str(narrar.asegurar_voz(cfg["modelo"])))
    raise ValueError(f"motor desconocido: {motor}")


def nombre_voz(cfg: dict) -> str:
    return f"kokoro-{cfg['voz']}" if cfg.get("motor") == "kokoro" else cfg["modelo"]


def diccionario(base: dict, cfg: dict) -> dict:
    """Diccionario fonético común + ajustes propios del motor (pronunciacion.<motor>.json, si existe)."""
    p = ROOT / "instagram" / "reels" / f"pronunciacion.{cfg.get('motor', 'piper')}.json"
    extra = {}
    if p.exists():
        import json

        extra = json.loads(p.read_text(encoding="utf-8"))
    return {**base, **extra}


def sintetizar_frase(motor, cfg: dict, texto: str) -> tuple[int, bytes]:
    if cfg.get("motor") == "kokoro":
        x, sr = motor.create(texto, voice=cfg["voz"], speed=cfg.get("velocidad", 1.0), lang="es")
        x = np.asarray(x, dtype=np.float32)
        # Quita el silencio inicial y final que añade el modelo (deja 30 ms)
        nz = np.flatnonzero(np.abs(x) > 0.01)
        if len(nz):
            m = int(0.03 * sr)
            x = x[max(0, nz[0] - m) : nz[-1] + m]
        pico = float(np.abs(x).max() or 1)
        x = x / pico * 0.9
        return sr, (np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()
    from piper import SynthesisConfig
    import io

    sc = SynthesisConfig(length_scale=cfg["length_scale"], noise_scale=cfg["noise_scale"], noise_w_scale=cfg["noise_w"], normalize_audio=True)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        motor.synthesize_wav(texto, w, syn_config=sc)
    buf.seek(0)
    with wave.open(buf, "rb") as w:
        return w.getframerate(), w.readframes(w.getnframes())


def sintetizar_texto(motor, cfg: dict, frases: list[str], pausa: float, wav_path: Path):
    sr, trozos = None, []
    for f in frases:
        sr, pcm = sintetizar_frase(motor, cfg, f)
        trozos.append(pcm)
    with wave.open(str(wav_path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((b"\x00" * int(sr * pausa) * 2).join(trozos))
