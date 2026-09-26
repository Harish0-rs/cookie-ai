import requests
import time
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

BASE_URL = "http://127.0.0.1:8000"

def test_all():
    print("=== Testing COOKIE AI Endpoints ===")

    # 1. Health check
    r = requests.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("✓ Health check OK:", r.json())

    # 2. User profile
    r = requests.get(f"{BASE_URL}/api/user")
    assert r.status_code == 200, f"User failed: {r.text}"
    user = r.json()
    print(f"✓ User profile OK: {user['name']} ({user['credits_remaining']} credits)")

    # 3. Library endpoints
    r = requests.get(f"{BASE_URL}/api/voices")
    assert r.status_code == 200 and len(r.json()) > 0
    print(f"✓ Voices OK: {len(r.json())} voices found")

    r = requests.get(f"{BASE_URL}/api/library/videos")
    assert r.status_code == 200 and len(r.json()) > 0
    print(f"✓ Videos OK: {len(r.json())} background videos found")

    r = requests.get(f"{BASE_URL}/api/library/music")
    assert r.status_code == 200 and len(r.json()) > 0
    print(f"✓ Music OK: {len(r.json())} background tracks found")

    r = requests.get(f"{BASE_URL}/api/library/templates")
    assert r.status_code == 200 and len(r.json()) > 0
    print(f"✓ Templates OK: {len(r.json())} viral templates found")

    # 4. Script Generation
    print("\n--- Testing Script Generator ---")
    payload = {
        "topic": "3 Mind-Blowing Facts About Space",
        "niche": "science",
        "tone": "mysterious",
        "target_duration": 15,
        "hook_style": "curiosity"
    }
    r = requests.post(f"{BASE_URL}/api/generate-script", json=payload)
    assert r.status_code == 200, f"Script gen failed: {r.text}"
    script_data = r.json()
    print("✓ Generated Script Title:", script_data.get("title"))
    print("✓ Generated Script Hook:", script_data.get("hook"))
    print("✓ Script Length:", len(script_data.get("script", "").split()), "words")

    # 5. Translation
    print("\n--- Testing Translation ---")
    r = requests.post(f"{BASE_URL}/api/translate-script", json={"text": script_data["script"][:80], "target_lang": "es"})
    assert r.status_code == 200, f"Translation failed: {r.text}"
    print("✓ Spanish translation:", r.json().get("translated_script")[:60] + "...")

    # 6. AI Voiceover & Timestamps
    print("\n--- Testing AI Voiceover & Timestamps ---")
    voice_payload = {
        "text": "Whatever you do, never look into the deep ocean at night.",
        "voice_id": "en-US-ChristopherNeural",
        "speed": 1.1,
        "pitch": 0
    }
    r = requests.post(f"{BASE_URL}/api/generate-voice", json=voice_payload)
    assert r.status_code == 200, f"Voice gen failed: {r.text}"
    voice_data = r.json()
    print(f"✓ Voice synthesized: duration={voice_data['duration']}s, words={len(voice_data['words'])}")
    print(f"✓ Sample word timestamp: {voice_data['words'][0]}")

    # 7. Video Rendering Pipeline (FFmpeg queue)
    print("\n--- Testing Server FFmpeg Render Pipeline ---")
    render_payload = {
        "video_id": "subway_surfers",
        "audio_url": voice_data["audio_url"],
        "music_id": "viral_phonk",
        "music_volume": 0.18,
        "voice_volume": 1.0,
        "words": voice_data["words"],
        "caption_style": {
            "font_family": "Montserrat Black",
            "primary_color": "#FFFFFF",
            "highlight_color": "#FFE500",
            "stroke_color": "#000000",
            "stroke_width": 4,
            "words_per_line": 3,
            "uppercase": True,
            "y_offset_pct": 55
        },
        "resolution": "720p"
    }
    r = requests.post(f"{BASE_URL}/api/render", json=render_payload)
    assert r.status_code == 200, f"Render trigger failed: {r.text}"
    job_id = r.json()["job_id"]
    print(f"✓ Render job queued: {job_id}")

    # Poll render status
    for _ in range(20):
        time.sleep(1.5)
        r = requests.get(f"{BASE_URL}/api/render/{job_id}")
        assert r.status_code == 200
        status_info = r.json()
        print(f"  Status: {status_info.get('status')} ({status_info.get('progress')}%) - {status_info.get('message')}")
        if status_info.get("status") == "completed":
            print(f"✓ Render SUCCESS! Output: {status_info['output_url']}, Size: {status_info.get('file_size_mb')} MB")
            break
        elif status_info.get("status") == "failed":
            raise RuntimeError(f"Render job failed: {status_info.get('message')}")

    # 8. Test Frontend Static Serving
    print("\n--- Testing Frontend Serving ---")
    r = requests.get(f"{BASE_URL}/")
    assert r.status_code == 200
    assert "COOKIE AI" in r.text
    print("✓ Frontend root HTML loaded successfully with title COOKIE AI!")

    print("\n==========================================")
    print("🎉 ALL TESTS PASSED! COOKIE AI IS FULLY OPERATIONAL!")
    print("==========================================")

if __name__ == "__main__":
    test_all()
