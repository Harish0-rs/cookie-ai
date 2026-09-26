import os
from pathlib import Path
import imageio_ffmpeg

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
EXPORTS_DIR = DATA_DIR / "exports"
UPLOADS_DIR = DATA_DIR / "uploads"
STOCK_VIDEOS_DIR = DATA_DIR / "stock_videos"
STOCK_AUDIO_DIR = DATA_DIR / "stock_audio"

for directory in [DATA_DIR, EXPORTS_DIR, UPLOADS_DIR, STOCK_VIDEOS_DIR, STOCK_AUDIO_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

try:
    FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FFMPEG_EXE = "ffmpeg"
