import json
import uuid
import time
from pathlib import Path
from typing import Dict, Any, List
from config import DATA_DIR

PROJECTS_FILE = DATA_DIR / "projects.json"
USER_FILE = DATA_DIR / "user.json"

DEFAULT_USER = {
    "id": "creator_01",
    "name": "Faceless Creator",
    "email": "creator@cookie.ai",
    "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=cookie",
    "tier": "Creator Pro",
    "credits_total": 60,
    "credits_remaining": 54,
    "videos_created": 3,
    "total_watch_time_est": "4.2M views",
    "created_at": "2026-09-01"
}

INITIAL_SAMPLE_PROJECTS = [
    {
        "id": "proj_sample_01",
        "title": "AITA For Refusing Wedding Dress",
        "template_id": "reddit_aita",
        "script": "AITA for refusing to pay for my sister's wedding dress? My sister has always been the favorite child. Last week, she demanded three thousand dollars from my savings. When I politely said no, my parents called me selfish.",
        "voice_id": "en-US-ChristopherNeural",
        "video_id": "minecraft_parkour",
        "music_id": "lofi_chill",
        "music_volume": 0.18,
        "voice_volume": 1.0,
        "duration": 18.5,
        "status": "ready",
        "rendered_video_url": "/api/library/video/minecraft_parkour.mp4",
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
            "uppercase": True
        },
        "created_at": int(time.time()) - 86400 * 2
    },
    {
        "id": "proj_sample_02",
        "title": "3 Terrifying Ocean Mysteries",
        "template_id": "did_you_know_facts",
        "script": "Here are three unsettling ocean facts that will keep you awake tonight. Number one. Humans have explored less than five percent of our oceans. Number two. Deep ocean pressure can crush a submarine like a soda can.",
        "voice_id": "en-US-GuyNeural",
        "video_id": "subway_surfers",
        "music_id": "viral_phonk",
        "music_volume": 0.22,
        "voice_volume": 1.0,
        "duration": 16.0,
        "status": "ready",
        "rendered_video_url": "/api/library/video/subway_surfers.mp4",
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
            "uppercase": True
        },
        "created_at": int(time.time()) - 86400 * 1
    }
]

def load_user() -> Dict[str, Any]:
    if not USER_FILE.exists():
        save_user(DEFAULT_USER)
        return DEFAULT_USER
    try:
        with open(USER_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return DEFAULT_USER

def save_user(user_data: Dict[str, Any]):
    with open(USER_FILE, "w", encoding="utf-8") as f:
        json.dump(user_data, f, indent=2)

def deduct_credit(amount: int = 1) -> bool:
    user = load_user()
    if user["credits_remaining"] >= amount:
        user["credits_remaining"] -= amount
        user["videos_created"] += 1
        save_user(user)
        return True
    return False

def add_credits(amount: int = 25) -> Dict[str, Any]:
    user = load_user()
    user["credits_remaining"] += amount
    user["credits_total"] += amount
    save_user(user)
    return user

def load_projects() -> List[Dict[str, Any]]:
    if not PROJECTS_FILE.exists():
        save_projects(INITIAL_SAMPLE_PROJECTS)
        return INITIAL_SAMPLE_PROJECTS
    try:
        with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return INITIAL_SAMPLE_PROJECTS

def save_projects(projects: List[Dict[str, Any]]):
    with open(PROJECTS_FILE, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)

def create_or_update_project(project_data: Dict[str, Any]) -> Dict[str, Any]:
    projects = load_projects()
    proj_id = project_data.get("id")

    if not proj_id:
        proj_id = f"proj_{uuid.uuid4().hex[:10]}"
        project_data["id"] = proj_id
        project_data["created_at"] = int(time.time())
        projects.insert(0, project_data)
    else:
        # Update existing
        found = False
        for i, p in enumerate(projects):
            if p.get("id") == proj_id:
                projects[i] = {**p, **project_data, "updated_at": int(time.time())}
                found = True
                break
        if not found:
            project_data["created_at"] = int(time.time())
            projects.insert(0, project_data)

    save_projects(projects)
    return project_data

def delete_project(project_id: str) -> bool:
    projects = load_projects()
    new_list = [p for p in projects if p.get("id") != project_id]
    if len(new_list) != len(projects):
        save_projects(new_list)
        return True
    return False

def get_project_by_id(project_id: str) -> Dict[str, Any]:
    projects = load_projects()
    for p in projects:
        if p.get("id") == project_id:
            return p
    return None
