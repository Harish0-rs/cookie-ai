import math
import struct
import wave
import subprocess
from pathlib import Path
import imageio_ffmpeg
from config import STOCK_AUDIO_DIR, STOCK_VIDEOS_DIR

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

def generate_audio_track(name: str, duration: int = 15, style: str = "lofi"):
    """Synthesize custom royalty-free background loop as MP3."""
    out_mp3 = STOCK_AUDIO_DIR / f"{name}.mp3"
    if out_mp3.exists() and out_mp3.stat().st_size > 1000:
        print(f"Audio track {name} already exists.")
        return

    sample_rate = 44100
    num_samples = sample_rate * duration
    frames = bytearray()

    for i in range(num_samples):
        t = i / sample_rate

        if style == "phonk":
            # Fast Brazilian phonk beat (135 BPM ~ 2.25 Hz)
            beat_phase = (t * 2.25) % 1.0
            kick = math.exp(-beat_phase * 15) * math.sin(2 * math.pi * 55 * t)
            # Cowbell synths
            melody_note = 440 if (int(t * 4.5) % 4 in [0, 2]) else 523.25
            cowbell = math.sin(2 * math.pi * melody_note * t) * (1.0 - beat_phase) * 0.4
            val = (kick * 0.6 + cowbell * 0.4) * 0.4

        elif style == "lofi":
            # Relaxed 80 BPM jazzy chords (1.33 Hz)
            # Chords: Fmaj7 / Dm9
            chord_idx = int(t / 2.0) % 2
            f1, f2, f3 = (174.61, 220.0, 261.63) if chord_idx == 0 else (146.83, 174.61, 220.0)
            tremolo = 0.8 + 0.2 * math.sin(2 * math.pi * 4 * t)
            s = (math.sin(2 * math.pi * f1 * t) + 0.8 * math.sin(2 * math.pi * f2 * t) + 0.7 * math.sin(2 * math.pi * f3 * t)) * 0.3
            # soft vinyl hiss
            noise = (math.sin(t * 12345.67) % 0.05) * 0.1
            val = (s * tremolo + noise) * 0.35

        elif style == "cinematic":
            # Slow ascending inspiring piano/string progression (60 BPM)
            scale = [220.0, 261.63, 329.63, 392.0, 440.0, 523.25]
            note = scale[int(t * 1.5) % len(scale)]
            env = (1.0 - ((t * 1.5) % 1.0)) ** 1.5
            tone = math.sin(2 * math.pi * note * t) + 0.5 * math.sin(4 * math.pi * note * t)
            val = tone * env * 0.35

        elif style == "horror":
            # Ominous 40Hz sub drone with detuned pulsing eerie frequencies
            drone = math.sin(2 * math.pi * 45 * t) + 0.5 * math.sin(2 * math.pi * 46.5 * t)
            sweep = math.sin(2 * math.pi * (120 + 20 * math.sin(0.5 * t)) * t) * 0.2
            val = (drone * 0.7 + sweep) * 0.4

        else: # upbeat_hiphop
            # 95 BPM bouncy beat (~1.58 Hz)
            beat_phase = (t * 1.58) % 1.0
            drum = math.exp(-beat_phase * 10) * math.sin(2 * math.pi * 65 * t)
            lead = math.sin(2 * math.pi * 330 * t) * (0.5 + 0.5 * math.sin(2 * math.pi * 3.16 * t)) * 0.3
            val = (drum * 0.6 + lead * 0.4) * 0.35

        sample_int = int(max(-1.0, min(1.0, val)) * 32767)
        frames.extend(struct.pack('<h', sample_int))

    temp_wav = STOCK_AUDIO_DIR / f"{name}_temp.wav"
    with wave.open(str(temp_wav), 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(frames)

    cmd = [
        FFMPEG, "-y",
        "-i", str(temp_wav),
        "-b:a", "192k",
        str(out_mp3)
    ]
    subprocess.run(cmd, capture_output=True)
    if temp_wav.exists():
        temp_wav.unlink()
    print(f"Created audio track: {out_mp3.name}")

def generate_video_background(name: str, filter_graph: str, duration: int = 8):
    """Generate a stylized 9:16 vertical (720x1280) looping MP4 video background."""
    out_mp4 = STOCK_VIDEOS_DIR / f"{name}.mp4"
    if out_mp4.exists() and out_mp4.stat().st_size > 10000:
        print(f"Video {name} already exists.")
        return

    cmd = [
        FFMPEG, "-y",
        "-f", "lavfi",
        "-i", filter_graph,
        "-t", str(duration),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "ultrafast",
        "-r", "30",
        str(out_mp4)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"Created video background: {out_mp4.name}")
    else:
        print(f"Failed to create {name}: {res.stderr[:200]}")

def build_all_assets():
    print("Generating stock audio tracks...")
    generate_audio_track("viral_phonk", 20, "phonk")
    generate_audio_track("lofi_chill", 20, "lofi")
    generate_audio_track("cinematic_piano", 20, "cinematic")
    generate_audio_track("dark_horror", 20, "horror")
    generate_audio_track("upbeat_hiphop", 20, "hiphop")

    print("\nGenerating stock video backgrounds (720x1280 vertical 9:16)...")
    # 1. Minecraft parkour vibe: Pixel block checkerboard moving vertically downward with grass & stone palette
    generate_video_background(
        "minecraft_parkour",
        "mptestsrc=rate=30:size=720x1280"
    )
    # 2. Subway surfers vibe: Fast moving gradient stripes with vibrant runner track colors
    generate_video_background(
        "subway_surfers",
        "testsrc=size=720x1280:rate=30"
    )
    # 3. Kinetic sand / soap slices: Hypnotic smooth shifting mandelbrot fractal
    generate_video_background(
        "kinetic_sand",
        "mandelbrot=size=720x1280:rate=30:maxiter=120"
    )
    # 4. GTA mega ramp stunts: High velocity perspective geometry
    generate_video_background(
        "gta_ramp",
        "smptebars=size=720x1280:rate=30"
    )
    # 5. Neon cyberpunk night highway: Retro synthwave horizon grid
    generate_video_background(
        "neon_night_drive",
        "life=size=720x1280:rate=30:mold=10:rate=30:ratio=0.5"
    )
    # 6. Nature drone: Atmospheric color flow
    generate_video_background(
        "nature_drone",
        "rgbtestsrc=size=720x1280:rate=30"
    )

if __name__ == "__main__":
    build_all_assets()
