import os
import json
import requests
import urllib3
from config import OPENROUTER_API_KEY

urllib3.disable_warnings()

FALLBACK_SCRIPTS = {
    "reddit": {
        "title": "AITA for refusing to attend my sister's wedding?",
        "hook": "AITA for telling my sister I wouldn't pay for her wedding dress?",
        "script": "AITA for refusing to pay for my sister's wedding dress? My sister has always been the golden child of our family. Last week, she demanded three thousand dollars from my savings because she found her dream dress. When I politely refused, my parents blew up my phone saying I was ruining her special day. Now half my family is refusing to speak to me.",
        "hashtags": "#redditstories #storytime #aita #askreddit #facelesschannel",
        "recommended_voice": "en-US-ChristopherNeural",
        "recommended_bg": "minecraft_parkour",
        "recommended_music": "lofi_chill"
    },
    "facts": {
        "title": "3 Unsettling Facts About The Deep Ocean",
        "hook": "Whatever you do, never look into the Mariana Trench at night.",
        "script": "Here are three unsettling ocean facts that will keep you awake tonight. Number one. We have explored less than five percent of the world's oceans. Number two. At the ocean's deepest point, the water pressure is equal to fifty jumbo jets pressing down on your chest. Number three. Scientists constantly record acoustic booms from the ocean floor that match no known living creature.",
        "hashtags": "#scaryfacts #oceanfacts #mystery #didyouknow #viralshorts",
        "recommended_voice": "en-US-GuyNeural",
        "recommended_bg": "subway_surfers",
        "recommended_music": "viral_phonk"
    },
    "motivation": {
        "title": "The Stoic Rule That Changes Everything",
        "hook": "Marcus Aurelius wrote this two thousand years ago, and it still stings.",
        "script": "The master has failed more times than the beginner has even tried. You worry about what other people think of you, yet they spend most of their day worrying about themselves. Stop asking for permission to build your life. The door is already open, you just have to walk through it.",
        "hashtags": "#stoicism #mindset #motivation #discipline #successquotes",
        "recommended_voice": "en-GB-SoniaNeural",
        "recommended_bg": "nature_drone",
        "recommended_music": "cinematic_piano"
    },
    "mystery": {
        "title": "The Unexplained Mystery of Flight 513",
        "hook": "A plane took off in 1954 and landed in 1989 with all 92 passengers.",
        "script": "In 1954, Santiago Flight 513 took off from Germany headed for Brazil. It disappeared without a trace over the Atlantic Ocean. Thirty-five years later, in 1989, air traffic controllers in Brazil spotted an unauthorized aircraft approaching the runway. When authorities boarded the plane, what they discovered inside baffled modern science forever.",
        "hashtags": "#unsolvedmysteries #creepyfacts #urbanlegends #historymystery #shorts",
        "recommended_voice": "en-US-RogerNeural",
        "recommended_bg": "neon_night_drive",
        "recommended_music": "dark_horror"
    },
    "shower_thoughts": {
        "title": "Shower Thoughts That Will Break Your Brain",
        "hook": "Your future self is watching you right now through your memories.",
        "script": "Here is a thought that will keep your mind spinning. If you replace every part in a car over ten years, is it still the same car? Every time you shuffle a deck of cards, you hold an arrangement that has never existed in the entire history of the universe. And right now, your future self is remembering this exact moment.",
        "hashtags": "#showerthoughts #deepthoughts #mindblown #philosophy #curiosity",
        "recommended_voice": "en-US-EricNeural",
        "recommended_bg": "kinetic_sand",
        "recommended_music": "lofi_chill"
    }
}

def generate_script(
    topic: str,
    niche: str = "general",
    tone: str = "dramatic",
    target_duration: int = 30,
    hook_style: str = "curiosity"
) -> dict:
    """
    Generate an engaging short-form video script optimized for viral retention.
    Uses OpenRouter API when available with robust fallback templates.
    """
    # Estimate word count: ~2.5 words per second
    target_words = int(target_duration * 2.4)

    system_prompt = f"""You are the world's top viral short-form scriptwriter for faceless TikTok, YouTube Shorts, and Instagram Reels (like Crayo.ai and CapCut top creators).
Target video duration: {target_duration} seconds (~{target_words} spoken words).
Niche: {niche}. Tone: {tone}. Hook style: {hook_style}.

Key Writing Guidelines:
1. First sentence must be a powerful 3-second hook that forces the viewer to keep watching.
2. Fast pacing, spoken natural English, short punchy sentences.
3. No stage directions, no narrator brackets like [Narrator:], no sound cues, no emojis in the script text.
4. Keep the total word count strictly around {target_words} words.

Return ONLY a valid JSON object matching this schema:
{{
  "title": "Catchy 4-7 word title",
  "hook": "First hook sentence",
  "script": "Full spoken script text without any bracketed cues",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5",
  "recommended_voice": "en-US-ChristopherNeural or en-US-GuyNeural or en-US-JennyNeural or en-US-EricNeural or en-GB-SoniaNeural or en-US-RogerNeural",
  "recommended_bg": "minecraft_parkour or subway_surfers or kinetic_sand or neon_night_drive or nature_drone or gta_ramp",
  "recommended_music": "viral_phonk or lofi_chill or cinematic_piano or dark_horror or upbeat_hiphop"
}}"""

    user_prompt = f"Topic: {topic}"

    if OPENROUTER_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.8
            }
            resp = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                verify=False,
                timeout=12
            )
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                return parsed
        except Exception as e:
            print(f"OpenRouter script generation error: {e}")

    # Fallback to smart template matching
    topic_lower = topic.lower()
    if "reddit" in topic_lower or "aita" in topic_lower or "sister" in topic_lower or "wife" in topic_lower:
        matched = FALLBACK_SCRIPTS["reddit"].copy()
    elif "ocean" in topic_lower or "scary" in topic_lower or "mystery" in topic_lower or "creepy" in topic_lower:
        matched = FALLBACK_SCRIPTS["mystery"].copy()
    elif "motivat" in topic_lower or "quote" in topic_lower or "stoic" in topic_lower or "success" in topic_lower:
        matched = FALLBACK_SCRIPTS["motivation"].copy()
    elif "shower" in topic_lower or "brain" in topic_lower or "thought" in topic_lower:
        matched = FALLBACK_SCRIPTS["shower_thoughts"].copy()
    else:
        matched = FALLBACK_SCRIPTS["facts"].copy()

    matched["title"] = f"{topic[:40]} (Cookie AI)"
    return matched

def translate_script(text: str, target_lang: str) -> dict:
    """
    Translate script into target language and suggest a native voice.
    """
    lang_voices = {
        "es": {"name": "Spanish", "voice": "es-ES-AlvaroNeural"},
        "fr": {"name": "French", "voice": "fr-FR-HenriNeural"},
        "de": {"name": "German", "voice": "de-DE-KillianNeural"},
        "ja": {"name": "Japanese", "voice": "ja-JP-KeitaNeural"},
        "pt": {"name": "Portuguese", "voice": "pt-BR-AntonioNeural"},
        "hi": {"name": "Hindi", "voice": "hi-IN-MadhurNeural"}
    }

    target_info = lang_voices.get(target_lang, {"name": target_lang, "voice": "en-US-ChristopherNeural"})

    prompt = f"""Translate this viral short-form video script into natural, spoken {target_info['name']}.
Keep the emotional punch, rhythm, and viral hook intensity.
Do not add bracketed annotations, emojis, or stage directions.

Return ONLY a JSON object:
{{
  "translated_script": "The translated text in natural spoken language",
  "target_lang": "{target_lang}",
  "recommended_voice": "{target_info['voice']}"
}}

Original Script:
{text}"""

    if OPENROUTER_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.5
            }
            resp = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                verify=False,
                timeout=12
            )
            if resp.status_code == 200:
                return json.loads(resp.json()["choices"][0]["message"]["content"])
        except Exception as e:
            print(f"Translation error: {e}")

    # Fallback simulation
    return {
        "translated_script": f"[{target_info['name']} Translation]: {text}",
        "target_lang": target_lang,
        "recommended_voice": target_info["voice"]
    }
