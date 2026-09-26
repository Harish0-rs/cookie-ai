from pathlib import Path
from config import STOCK_VIDEOS_DIR, STOCK_AUDIO_DIR, UPLOADS_DIR

VIDEO_LIBRARY = [
    {
        "id": "minecraft_parkour",
        "title": "Minecraft Parkour Sprint",
        "category": "Gaming",
        "thumbnail": "🎮",
        "color": "from-emerald-600 to-teal-900",
        "description": "High-retention classic Minecraft block-jumping gameplay.",
        "filename": "minecraft_parkour.mp4",
        "url": "/api/library/video/minecraft_parkour.mp4",
        "duration": 8,
        "is_stock": True
    },
    {
        "id": "subway_surfers",
        "title": "Subway Surfers High Speed",
        "category": "Gaming",
        "thumbnail": "🛹",
        "color": "from-amber-500 to-orange-800",
        "description": "Ultra fast-paced rail runner footage for maximum watch time.",
        "filename": "subway_surfers.mp4",
        "url": "/api/library/video/subway_surfers.mp4",
        "duration": 8,
        "is_stock": True
    },
    {
        "id": "kinetic_sand",
        "title": "Satisfying Kinetic Sand Slicing",
        "category": "Satisfying",
        "thumbnail": "🧼",
        "color": "from-purple-500 to-pink-800",
        "description": "Hypnotic slicing and crunching loops that keep viewers glued.",
        "filename": "kinetic_sand.mp4",
        "url": "/api/library/video/kinetic_sand.mp4",
        "duration": 8,
        "is_stock": True
    },
    {
        "id": "gta_ramp",
        "title": "GTA V Mega Ramp Car Stunts",
        "category": "Gaming",
        "thumbnail": "🚗",
        "color": "from-blue-600 to-indigo-900",
        "description": "Adrenaline-fueled vertical stunt ramp vehicle descent.",
        "filename": "gta_ramp.mp4",
        "url": "/api/library/video/gta_ramp.mp4",
        "duration": 8,
        "is_stock": True
    },
    {
        "id": "neon_night_drive",
        "title": "Neon Cyberpunk Night Highway",
        "category": "Aesthetic",
        "thumbnail": "🏎️",
        "color": "from-fuchsia-600 to-purple-950",
        "description": "Atmospheric 80s synthwave night drift with glowing grid.",
        "filename": "neon_night_drive.mp4",
        "url": "/api/library/video/neon_night_drive.mp4",
        "duration": 8,
        "is_stock": True
    },
    {
        "id": "nature_drone",
        "title": "Cinematic Golden Hour Drone",
        "category": "Cinematic",
        "thumbnail": "🌿",
        "color": "from-yellow-600 to-emerald-900",
        "description": "Breathtaking 4K mountain ranges and golden mist.",
        "filename": "nature_drone.mp4",
        "url": "/api/library/video/nature_drone.mp4",
        "duration": 8,
        "is_stock": True
    }
]

MUSIC_LIBRARY = [
    {
        "id": "viral_phonk",
        "title": "Brazilian Drift Phonk",
        "genre": "Phonk",
        "mood": "High Energy / Aggressive",
        "bpm": 135,
        "filename": "viral_phonk.mp3",
        "url": "/api/library/music/viral_phonk.mp3",
        "duration": 20
    },
    {
        "id": "lofi_chill",
        "title": "Midnight Coffee Lofi",
        "genre": "Lofi",
        "mood": "Relaxed / Storytelling",
        "bpm": 80,
        "filename": "lofi_chill.mp3",
        "url": "/api/library/music/lofi_chill.mp3",
        "duration": 20
    },
    {
        "id": "cinematic_piano",
        "title": "Ascent to Greatness",
        "genre": "Cinematic",
        "mood": "Inspirational / Emotional",
        "bpm": 65,
        "filename": "cinematic_piano.mp3",
        "url": "/api/library/music/cinematic_piano.mp3",
        "duration": 20
    },
    {
        "id": "dark_horror",
        "title": "The Deep Abyss Drone",
        "genre": "Horror",
        "mood": "Suspense / Eerie",
        "bpm": 50,
        "filename": "dark_horror.mp3",
        "url": "/api/library/music/dark_horror.mp3",
        "duration": 20
    },
    {
        "id": "upbeat_hiphop",
        "title": "Golden Era Boom Bap",
        "genre": "Hip-Hop",
        "mood": "Punchy / Upbeat",
        "bpm": 95,
        "filename": "upbeat_hiphop.mp3",
        "url": "/api/library/music/upbeat_hiphop.mp3",
        "duration": 20
    }
]

VIRAL_TEMPLATES = [
    {
        "id": "reddit_aita",
        "name": "Reddit Storytime (AITA)",
        "badge": "🔥 Most Viral",
        "description": "Dramatic family drama confession over classic Minecraft parkour.",
        "topic": "AITA for refusing to pay for my sister's wedding dress after she insulted my fiance?",
        "script": "AITA for refusing to pay for my sister's wedding dress? My sister has always been the favorite child. Last week, she demanded three thousand dollars from my savings. When I politely said no, my parents called me selfish. Now half the family is boycotting my own house.",
        "voice_id": "en-US-ChristopherNeural",
        "video_id": "minecraft_parkour",
        "music_id": "lofi_chill",
        "music_volume": 0.18,
        "caption_style": {
            "preset": "hormozi",
            "font_family": "Montserrat Black",
            "primary_color": "#FFFFFF",
            "highlight_color": "#FFE500",
            "stroke_color": "#000000",
            "stroke_width": 4,
            "position": "center",
            "y_offset_pct": 55,
            "words_per_line": 3,
            "uppercase": True,
            "animation": "pop"
        }
    },
    {
        "id": "did_you_know_facts",
        "name": "Did You Know? (Listicle)",
        "badge": "⚡ High Retention",
        "description": "Rapid-fire shocking curiosity facts over Subway Surfers high speed.",
        "topic": "3 Terrifying Ocean Mysteries Science Cannot Explain",
        "script": "Here are three unsettling ocean facts that will keep you awake tonight. Number one. Humans have explored less than five percent of our oceans. Number two. Deep ocean pressure can crush a submarine like a soda can in milliseconds. Number three. Strange deep acoustic signals are recorded every month with no known origin.",
        "voice_id": "en-US-GuyNeural",
        "video_id": "subway_surfers",
        "music_id": "viral_phonk",
        "music_volume": 0.22,
        "caption_style": {
            "preset": "crayo_viral",
            "font_family": "Komika Axis",
            "primary_color": "#FFFFFF",
            "highlight_color": "#00FFCC",
            "stroke_color": "#000000",
            "stroke_width": 4,
            "position": "center",
            "y_offset_pct": 52,
            "words_per_line": 2,
            "uppercase": True,
            "animation": "bounce"
        }
    },
    {
        "id": "stoic_motivation",
        "name": "Stoic Wisdom & Discipline",
        "badge": "👑 High RPM",
        "description": "Profound philosophical quotes over cinematic golden hour mountain drone.",
        "topic": "Marcus Aurelius on overcoming self-doubt and building discipline",
        "script": "The master has failed more times than the beginner has even tried. You spend your days seeking approval from people you wouldn't even ask for advice. Stop waiting for the perfect day to start. The door has been unlocked the entire time.",
        "voice_id": "en-GB-SoniaNeural",
        "video_id": "nature_drone",
        "music_id": "cinematic_piano",
        "music_volume": 0.16,
        "caption_style": {
            "preset": "minimalist",
            "font_family": "Poppins Bold",
            "primary_color": "#FFFFFF",
            "highlight_color": "#F3F4F6",
            "stroke_color": "#000000",
            "stroke_width": 2,
            "position": "center",
            "y_offset_pct": 60,
            "words_per_line": 4,
            "uppercase": False,
            "animation": "fade"
        }
    },
    {
        "id": "unsolved_mystery",
        "name": "Unsolved Dark Mystery",
        "badge": "👁️ Binge Watch",
        "description": "Eerie true events and conspiracy theories over cyberpunk night drift.",
        "topic": "The real story behind the lost cosmonaut transmission of 1961",
        "script": "In 1961, two Italian radio operators picked up a desperate distress call from space. The female voice was gasping for oxygen, reporting that flames were engulfing her capsule. Officially, this mission never existed. But the tape recording still exists today.",
        "voice_id": "en-US-RogerNeural",
        "video_id": "neon_night_drive",
        "music_id": "dark_horror",
        "music_volume": 0.20,
        "caption_style": {
            "preset": "neon_glow",
            "font_family": "Bebas Neue",
            "primary_color": "#FFFFFF",
            "highlight_color": "#FF0055",
            "stroke_color": "#1A0022",
            "stroke_width": 5,
            "position": "center",
            "y_offset_pct": 54,
            "words_per_line": 3,
            "uppercase": True,
            "animation": "pulse"
        }
    },
    {
        "id": "shower_thoughts",
        "name": "Mind-Bending Shower Thoughts",
        "badge": "🧠 Infinite Loop",
        "description": "Hypnotic kinetic sand slicing paired with mind-expanding paradoxes.",
        "topic": "Shower thoughts that make you question your existence",
        "script": "If you clean a vacuum cleaner, you are literally making a vacuum cleaner dirtier. Every time you shuffle a deck of cards, you create an order that has never existed in the universe. And your future self is watching you right now through memory.",
        "voice_id": "en-US-EricNeural",
        "video_id": "kinetic_sand",
        "music_id": "lofi_chill",
        "music_volume": 0.18,
        "caption_style": {
            "preset": "hormozi",
            "font_family": "Montserrat Black",
            "primary_color": "#FFFFFF",
            "highlight_color": "#00FF66",
            "stroke_color": "#000000",
            "stroke_width": 4,
            "position": "center",
            "y_offset_pct": 50,
            "words_per_line": 2,
            "uppercase": True,
            "animation": "pop"
        }
    }
]

def get_all_videos():
    # Also discover any user uploads
    videos = list(VIDEO_LIBRARY)
    if UPLOADS_DIR.exists():
        for upload in UPLOADS_DIR.glob("*.*"):
            if upload.suffix.lower() in [".mp4", ".webm", ".mov"]:
                videos.append({
                    "id": f"upload_{upload.stem}",
                    "title": f"Custom: {upload.name[:20]}",
                    "category": "Uploads",
                    "thumbnail": "📁",
                    "color": "from-zinc-700 to-zinc-900",
                    "description": "User uploaded video asset.",
                    "filename": upload.name,
                    "url": f"/api/uploads/{upload.name}",
                    "duration": 15,
                    "is_stock": False
                })
    return videos

def get_all_music():
    return MUSIC_LIBRARY

def get_all_templates():
    return VIRAL_TEMPLATES
