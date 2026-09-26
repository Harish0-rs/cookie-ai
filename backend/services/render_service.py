import os
import uuid
import asyncio
import subprocess
from pathlib import Path
from typing import Dict, Any, List
from config import FFMPEG_EXE, EXPORTS_DIR, STOCK_VIDEOS_DIR, STOCK_AUDIO_DIR, UPLOADS_DIR, DATA_DIR

JOBS: Dict[str, Dict[str, Any]] = {}

def hex_to_ass_color(hex_str: str) -> str:
    """Convert RGB hex (#RRGGBB) to ASS color format (&H00BBGGRR&)."""
    hex_clean = hex_str.lstrip("#")
    if len(hex_clean) == 3:
        hex_clean = "".join([c * 2 for c in hex_clean])
    if len(hex_clean) == 6:
        r, g, b = hex_clean[0:2], hex_clean[2:4], hex_clean[4:6]
        return f"&H00{b}{g}{r}&"
    return "&H00FFFFFF&"

def format_ass_time(seconds: float) -> str:
    """Format seconds into ASS timestamp H:MM:SS.cs"""
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    csecs = int(round((seconds - int(seconds)) * 100))
    if csecs >= 100:
        csecs = 99
    return f"{hrs}:{mins:02d}:{secs:02d}.{csecs:02d}"

def generate_ass_subtitle_content(
    words: List[Dict[str, Any]],
    caption_style: Dict[str, Any],
    width: int = 720,
    height: int = 1280
) -> str:
    """
    Generate an ASS subtitle script with word-by-word active highlight styling.
    """
    font_name = caption_style.get("font_family", "Arial")
    # Clean font name
    if "Montserrat" in font_name:
        font_name = "Arial Black"
    elif "Komika" in font_name or "Impact" in font_name:
        font_name = "Impact"
    else:
        font_name = "Arial"

    font_size = 54 if width == 720 else 80
    primary_color = hex_to_ass_color(caption_style.get("primary_color", "#FFFFFF"))
    highlight_color = hex_to_ass_color(caption_style.get("highlight_color", "#FFE500"))
    stroke_color = hex_to_ass_color(caption_style.get("stroke_color", "#000000"))
    stroke_width = caption_style.get("stroke_width", 4)
    words_per_line = caption_style.get("words_per_line", 3)
    uppercase = caption_style.get("uppercase", True)

    # Position
    pos_choice = caption_style.get("position", "center")
    if pos_choice == "top":
        alignment = 8 # Top center
        margin_v = int(height * 0.18)
    elif pos_choice == "bottom":
        alignment = 2 # Bottom center
        margin_v = int(height * 0.20)
    else: # center
        alignment = 5 # Middle center
        margin_v = int(height * 0.50)

    # Allow custom y_offset_pct
    if "y_offset_pct" in caption_style:
        pct = caption_style["y_offset_pct"] / 100.0
        margin_v = int(height * pct)
        alignment = 5

    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{font_name},{font_size},{primary_color},{highlight_color},{stroke_color},&H80000000,-1,0,0,0,100,100,0,0,1,{stroke_width},2,{alignment},30,30,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    # Group words into chunks of words_per_line
    for chunk_start_idx in range(0, len(words), words_per_line):
        chunk = words[chunk_start_idx:chunk_start_idx + words_per_line]
        if not chunk:
            continue

        # For each word inside this active chunk, render an event where that specific word is highlighted!
        for active_i, active_word_item in enumerate(chunk):
            w_start = format_ass_time(active_word_item["start"])
            w_end = format_ass_time(active_word_item["end"])

            # Build line text
            line_parts = []
            for j, w_item in enumerate(chunk):
                w_text = w_item["word"].upper() if uppercase else w_item["word"]
                if j == active_i:
                    # Active word in highlight color + scale pop
                    line_parts.append(f"{{\\c{highlight_color}\\fscx112\\fscy112}}{w_text}{{\\rDefault\\c{primary_color}}}")
                else:
                    line_parts.append(f"{{\\c{primary_color}}}{w_text}")

            full_line_text = " ".join(line_parts)
            events.append(f"Dialogue: 0,{w_start},{w_end},Default,,0,0,0,,{full_line_text}")

    return header + "\n".join(events) + "\n"

def resolve_video_path(video_id: str) -> Path:
    """Find video file from stock library or uploads."""
    stock_path = STOCK_VIDEOS_DIR / f"{video_id}.mp4"
    if stock_path.exists():
        return stock_path
    
    # Check if direct filename was passed
    if (STOCK_VIDEOS_DIR / video_id).exists():
        return STOCK_VIDEOS_DIR / video_id

    # Check uploads
    if video_id.startswith("upload_"):
        upload_name = video_id.replace("upload_", "")
        for f in UPLOADS_DIR.glob(f"{upload_name}*"):
            return f
    for f in UPLOADS_DIR.glob(f"{video_id}*"):
        return f

    # Fallback to subway_surfers or first available
    avail = list(STOCK_VIDEOS_DIR.glob("*.mp4"))
    return avail[0] if avail else (STOCK_VIDEOS_DIR / "subway_surfers.mp4")

def resolve_audio_path(audio_identifier: str) -> Path:
    """Find voiceover audio file."""
    # Might be filename like voice_123.mp3 or url like /api/audio/voice_123.mp3
    filename = Path(audio_identifier).name
    audio_dir = DATA_DIR / "audio"
    path = audio_dir / filename
    if path.exists():
        return path
    # Try directly in data
    for candidate in DATA_DIR.rglob(filename):
        return candidate
    raise FileNotFoundError(f"Voiceover audio file not found: {audio_identifier}")

def resolve_music_path(music_id: str) -> Path:
    """Find background music track."""
    path = STOCK_AUDIO_DIR / f"{music_id}.mp3"
    if path.exists():
        return path
    for f in STOCK_AUDIO_DIR.glob("*.mp3"):
        return f
    return None

def run_render_job(job_id: str, params: Dict[str, Any]):
    """Execute FFmpeg video compositing in worker thread."""
    try:
        JOBS[job_id]["status"] = "processing"
        JOBS[job_id]["progress"] = 15
        JOBS[job_id]["message"] = "Preparing assets and subtitles..."

        video_path = resolve_video_path(params.get("video_id", "subway_surfers"))
        voice_path = resolve_audio_path(params["audio_url"])
        music_id = params.get("music_id")
        music_path = resolve_music_path(music_id) if music_id else None

        music_vol = float(params.get("music_volume", 0.18))
        voice_vol = float(params.get("voice_volume", 1.0))
        caption_style = params.get("caption_style", {})
        resolution = params.get("resolution", "720p")

        width, height = (720, 1280) if resolution == "720p" else (1080, 1920)

        # 1. Generate ASS Subtitle file
        words = params.get("words", [])
        ass_path = EXPORTS_DIR / f"sub_{job_id}.ass"
        ass_content = generate_ass_subtitle_content(words, caption_style, width, height)
        with open(ass_path, "w", encoding="utf-8") as f:
            f.write(ass_content)

        JOBS[job_id]["progress"] = 30
        JOBS[job_id]["message"] = "Configuring 9:16 vertical compositing..."

        output_filename = f"cookie_video_{job_id}.mp4"
        output_path = EXPORTS_DIR / output_filename

        # Escape path for FFmpeg subtitles filter on Windows
        # Windows backslashes need escaping or forward slashes
        escaped_ass_path = str(ass_path).replace("\\", "/").replace(":", "\\:")

        # Build FFmpeg command
        # Input 0: Background video (stream loop)
        # Input 1: Voiceover audio
        cmd = [
            FFMPEG_EXE, "-y",
            "-stream_loop", "-1",
            "-i", str(video_path),
            "-i", str(voice_path)
        ]

        # Audio and Video filter complex
        filter_parts = []
        # Video scaling and subtitle burn
        # Scale to fill 9:16 and crop center
        filter_parts.append(
            f"[0:v]scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height},subtitles='{escaped_ass_path}'[v]"
        )

        if music_path and music_path.exists() and music_vol > 0.01:
            # Input 2: Background music
            cmd.extend([
                "-stream_loop", "-1",
                "-i", str(music_path)
            ])
            # Audio mix with volume ducking
            filter_parts.append(
                f"[1:a]volume={voice_vol}[voice];[2:a]volume={music_vol}[music];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[a]"
            )
            map_audio = "[a]"
        else:
            filter_parts.append(f"[1:a]volume={voice_vol}[a]")
            map_audio = "[a]"

        filter_complex = ";".join(filter_parts)

        cmd.extend([
            "-filter_complex", filter_complex,
            "-map", "[v]",
            "-map", map_audio,
            "-shortest",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "veryfast",
            "-crf", "22",
            "-c:a", "aac",
            "-b:a", "192k",
            str(output_path)
        ])

        JOBS[job_id]["progress"] = 50
        JOBS[job_id]["message"] = "Encoding video and burning captions..."

        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        _, stderr = process.communicate()

        if process.returncode != 0:
            print("FFmpeg error:", stderr[-600:])
            raise RuntimeError(f"FFmpeg failed with exit code {process.returncode}")

        # Cleanup temporary ass file
        if ass_path.exists():
            ass_path.unlink()

        file_size_mb = round(output_path.stat().st_size / (1024 * 1024), 2)
        JOBS[job_id]["status"] = "completed"
        JOBS[job_id]["progress"] = 100
        JOBS[job_id]["message"] = "Video rendered successfully!"
        JOBS[job_id]["output_url"] = f"/api/exports/{output_filename}"
        JOBS[job_id]["filename"] = output_filename
        JOBS[job_id]["file_size_mb"] = file_size_mb
        JOBS[job_id]["resolution"] = f"{width}x{height}"

    except Exception as e:
        print(f"Render job {job_id} failed: {e}")
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["progress"] = 0
        JOBS[job_id]["message"] = str(e)

def queue_render_job(params: Dict[str, Any]) -> str:
    """Queue a new video render job and return job_id."""
    job_id = uuid.uuid4().hex[:12]
    JOBS[job_id] = {
        "id": job_id,
        "status": "queued",
        "progress": 5,
        "message": "Queued in render pipeline...",
        "output_url": None,
        "params": params
    }
    # Run in background daemon thread
    import threading
    t = threading.Thread(target=run_render_job, args=(job_id, params), daemon=True)
    t.start()
    return job_id

def get_job_status(job_id: str) -> Dict[str, Any]:
    return JOBS.get(job_id, {"status": "not_found", "message": "Job does not exist"})
