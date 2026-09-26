import ssl
import os
import uuid
import re
import asyncio
from pathlib import Path
import edge_tts
from config import DATA_DIR

# SSL context fix for Windows Python environment
try:
    ssl._create_default_https_context = ssl._create_unverified_context
    ssl.create_default_context = lambda *args, **kwargs: ssl._create_unverified_context()
except Exception:
    pass

AUDIO_DIR = DATA_DIR / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

VOICE_LIBRARY = [
    {
        "id": "en-US-ChristopherNeural",
        "name": "Christopher",
        "gender": "Male",
        "accent": "US",
        "style": "Deep Storyteller (Reddit Viral)",
        "tone": "Deep, Authoritative, Engaging",
        "tags": ["Reddit", "Viral", "Storytelling", "Popular"],
        "sample": "I found a hidden room behind the bookcase in my new apartment...",
        "language": "en"
    },
    {
        "id": "en-US-GuyNeural",
        "name": "Guy",
        "gender": "Male",
        "accent": "US",
        "style": "Energetic / Podcast Hype",
        "tone": "Fast, Confident, Dynamic",
        "tags": ["Listicle", "Hype", "Did You Know", "Popular"],
        "sample": "Here are three psychological tricks that will change how you talk to anyone...",
        "language": "en"
    },
    {
        "id": "en-US-JennyNeural",
        "name": "Jenny",
        "gender": "Female",
        "accent": "US",
        "style": "Expressive Narrator",
        "tone": "Natural, Clear, Engaging",
        "tags": ["Storytelling", "Lifestyle", "Drama"],
        "sample": "You won't believe what happened when we opened this vintage lockbox...",
        "language": "en"
    },
    {
        "id": "en-US-EricNeural",
        "name": "Eric",
        "gender": "Male",
        "accent": "US",
        "style": "Youthful & Chill",
        "tone": "Casual, Relatable, Gaming",
        "tags": ["Gaming", "Shower Thoughts", "Casual"],
        "sample": "Have you ever realized that your future self is currently watching you through memories?",
        "language": "en"
    },
    {
        "id": "en-US-RogerNeural",
        "name": "Roger",
        "gender": "Male",
        "accent": "US",
        "style": "Cinematic Movie Trailer",
        "tone": "Dark, Gritty, Suspenseful",
        "tags": ["Horror", "Mystery", "Cinematic"],
        "sample": "Deep in the Pacific Ocean, sonar recorded a sound that science cannot explain...",
        "language": "en"
    },
    {
        "id": "en-GB-SoniaNeural",
        "name": "Sonia",
        "gender": "Female",
        "accent": "UK",
        "style": "Classy Documentary",
        "tone": "Elegant, Sophisticated, Calm",
        "tags": ["Motivational", "History", "Nature", "Luxury"],
        "sample": "The master has failed more times than the beginner has even tried...",
        "language": "en"
    },
    {
        "id": "en-GB-RyanNeural",
        "name": "Ryan",
        "gender": "Male",
        "accent": "UK",
        "style": "Dark Mystery Narrator",
        "tone": "Eerie, Intricate, British",
        "tags": ["True Crime", "Mystery", "Historical"],
        "sample": "In 1912, a mysterious distress beacon echoed across the moors of Yorkshire...",
        "language": "en"
    },
    {
        "id": "en-AU-NatashaNeural",
        "name": "Natasha",
        "gender": "Female",
        "accent": "AU",
        "style": "Bright & Upbeat",
        "tone": "Friendly, Crisp, Modern",
        "tags": ["Lifehacks", "Trivia", "Travel"],
        "sample": "Australia is wider than the Moon, and here is why that actually matters...",
        "language": "en"
    },
    {
        "id": "en-AU-WilliamNeural",
        "name": "William",
        "gender": "Male",
        "accent": "AU",
        "style": "Resonant Adventurer",
        "tone": "Rich, Warm, Outdoors",
        "tags": ["Wildlife", "Adventure", "Documentary"],
        "sample": "Out in the rugged Outback lies a place untouched by modern civilization...",
        "language": "en"
    },
    # International voices for translation support
    {
        "id": "es-ES-AlvaroNeural",
        "name": "Álvaro (Spanish)",
        "gender": "Male",
        "accent": "ES",
        "style": "Spanish Viral Narrator",
        "tone": "Vibrant, Fast, Engaging",
        "tags": ["Spanish", "Viral", "Storytelling"],
        "sample": "Tres secretos que los expertos nunca te van a contar sobre la mente humana...",
        "language": "es"
    },
    {
        "id": "es-MX-DaliaNeural",
        "name": "Dalia (Spanish MX)",
        "gender": "Female",
        "accent": "MX",
        "style": "Mexican Expressive",
        "tone": "Warm, Narrative, Lively",
        "tags": ["Spanish", "Storytelling"],
        "sample": "Esta es la historia de cómo una sola decisión cambió todo mi destino...",
        "language": "es"
    },
    {
        "id": "fr-FR-HenriNeural",
        "name": "Henri (French)",
        "gender": "Male",
        "accent": "FR",
        "style": "French Classic Narrator",
        "tone": "Smooth, Articulate, Deep",
        "tags": ["French", "Dramatic"],
        "sample": "Voici trois mystères non résolus qui fascinent les scientifiques depuis un siècle...",
        "language": "fr"
    },
    {
        "id": "de-DE-KillianNeural",
        "name": "Killian (German)",
        "gender": "Male",
        "accent": "DE",
        "style": "German Authoritative",
        "tone": "Crisp, Dynamic, Clear",
        "tags": ["German", "Educational"],
        "sample": "Hier sind drei unglaubliche Fakten, die fast niemand über das Gehirn weiß...",
        "language": "de"
    },
    {
        "id": "ja-JP-KeitaNeural",
        "name": "Keita (Japanese)",
        "gender": "Male",
        "accent": "JP",
        "style": "Japanese Anime/Story",
        "tone": "Dramatic, Engaging",
        "tags": ["Japanese", "Storytelling"],
        "sample": "誰も知らない驚くべき3つの心理学の秘密をご紹介します...",
        "language": "ja"
    },
    {
        "id": "pt-BR-AntonioNeural",
        "name": "Antônio (Portuguese)",
        "gender": "Male",
        "accent": "BR",
        "style": "Brazilian Energetic",
        "tone": "Dynamic, Warm",
        "tags": ["Portuguese", "Viral"],
        "sample": "Você não vai acreditar no que encontramos dentro dessa caixa misteriosa...",
        "language": "pt"
    },
    {
        "id": "hi-IN-MadhurNeural",
        "name": "Madhur (Hindi)",
        "gender": "Male",
        "accent": "IN",
        "style": "Hindi Storyteller",
        "tone": "Expressive, Deep, Clear",
        "tags": ["Hindi", "Storytelling"],
        "sample": "क्या आप जानते हैं कि दुनिया का सबसे बड़ा रहस्य आज भी अनसुलझा है...",
        "language": "hi"
    }
]

def format_rate(rate_multiplier: float) -> str:
    """Convert float speed (e.g. 1.15) to edge-tts rate string (+15%)."""
    diff = int((rate_multiplier - 1.0) * 100)
    if diff >= 0:
        return f"+{diff}%"
    return f"{diff}%"

def format_pitch(pitch_pct: int) -> str:
    """Convert integer pitch (-20 to 20) to edge-tts pitch string (+0Hz or +10Hz)."""
    if pitch_pct >= 0:
        return f"+{pitch_pct}Hz"
    return f"{pitch_pct}Hz"

async def synthesize_speech(
    text: str,
    voice_id: str = "en-US-ChristopherNeural",
    speed: float = 1.0,
    pitch: int = 0
) -> dict:
    """
    Synthesize speech using edge-tts.
    Returns audio filepath, duration, and synchronized word & phrase timestamps.
    """
    cleaned_text = text.strip()
    if not cleaned_text:
        raise ValueError("Text cannot be empty")

    rate_str = format_rate(speed)
    pitch_str = format_pitch(pitch)

    communicate = edge_tts.Communicate(
        text=cleaned_text,
        voice=voice_id,
        rate=rate_str,
        pitch=pitch_str
    )

    audio_bytes = bytearray()
    sentence_events = []

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes.extend(chunk["data"])
        elif chunk["type"] == "SentenceBoundary":
            # offset and duration in 100ns units (ticks)
            start_sec = chunk["offset"] / 10_000_000.0
            duration_sec = chunk["duration"] / 10_000_000.0
            end_sec = start_sec + duration_sec
            sentence_events.append({
                "text": chunk["text"],
                "start": round(start_sec, 3),
                "end": round(end_sec, 3),
                "duration": round(duration_sec, 3)
            })

    # Save audio file
    filename = f"voice_{uuid.uuid4().hex[:10]}.mp3"
    filepath = AUDIO_DIR / filename
    with open(filepath, "wb") as f:
        f.write(audio_bytes)

    # Estimate or determine total audio duration
    if sentence_events:
        total_duration = sentence_events[-1]["end"]
    else:
        # Fallback based on text length (~150 words per min)
        words_count = len(cleaned_text.split())
        total_duration = max(2.0, round((words_count / 2.5) / speed, 2))

    # Generate synchronized word-level timestamps by interpolating sentences
    word_timestamps = []
    
    if sentence_events:
        for sent in sentence_events:
            sent_text = sent["text"].strip()
            # Split sentence into words
            raw_words = re.findall(r"\S+", sent_text)
            if not raw_words:
                continue

            # Weight duration of each word by length + punctuation bonus
            weights = []
            for w in raw_words:
                w_len = len(w)
                if w.endswith((".", "!", "?")):
                    w_len += 2
                elif w.endswith((",", ";", ":")):
                    w_len += 1
                weights.append(max(1, w_len))

            total_weight = sum(weights)
            sent_dur = sent["duration"]
            current_time = sent["start"]

            for i, w in enumerate(raw_words):
                w_dur = (weights[i] / total_weight) * sent_dur
                w_start = round(current_time, 3)
                w_end = round(current_time + w_dur, 3)
                word_timestamps.append({
                    "word": w,
                    "start": w_start,
                    "end": w_end
                })
                current_time += w_dur
    else:
        # Fallback if no sentence boundary events received
        raw_words = re.findall(r"\S+", cleaned_text)
        time_per_word = total_duration / max(1, len(raw_words))
        cur = 0.0
        for w in raw_words:
            w_start = round(cur, 3)
            w_end = round(cur + time_per_word, 3)
            word_timestamps.append({
                "word": w,
                "start": w_start,
                "end": w_end
            })
            cur += time_per_word

    # Create chunked caption phrases (default 2-4 words per caption segment for vertical retention)
    caption_segments = []
    chunk_size = 3
    for i in range(0, len(word_timestamps), chunk_size):
        chunk = word_timestamps[i:i + chunk_size]
        if not chunk:
            continue
        c_start = chunk[0]["start"]
        c_end = chunk[-1]["end"]
        c_text = " ".join([item["word"] for item in chunk])
        caption_segments.append({
            "id": i // chunk_size,
            "text": c_text,
            "start": c_start,
            "end": c_end,
            "words": chunk
        })

    return {
        "filename": filename,
        "audio_url": f"/api/audio/{filename}",
        "duration": round(total_duration, 2),
        "words": word_timestamps,
        "caption_segments": caption_segments,
        "voice_id": voice_id,
        "speed": speed,
        "pitch": pitch
    }
