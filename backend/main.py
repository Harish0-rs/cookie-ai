import shutil
from pathlib import Path
from fastapi import FastAPI, HTTPException, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from config import DATA_DIR, EXPORTS_DIR, UPLOADS_DIR, STOCK_VIDEOS_DIR, STOCK_AUDIO_DIR
from services.tts_service import synthesize_speech, VOICE_LIBRARY
from services.llm_service import generate_script, translate_script
from services.library_service import get_all_videos, get_all_music, get_all_templates
from services.render_service import queue_render_job, get_job_status
from services.project_service import (
    load_user, add_credits, deduct_credit,
    load_projects, create_or_update_project, delete_project, get_project_by_id
)

app = FastAPI(title="COOKIE AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AUDIO_DIR = DATA_DIR / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# Mount static asset directories
app.mount("/api/audio", StaticFiles(directory=str(AUDIO_DIR)), name="audio")
app.mount("/api/library/video", StaticFiles(directory=str(STOCK_VIDEOS_DIR)), name="stock_video")
app.mount("/api/library/music", StaticFiles(directory=str(STOCK_AUDIO_DIR)), name="stock_music")
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
app.mount("/api/exports", StaticFiles(directory=str(EXPORTS_DIR)), name="exports")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "COOKIE AI", "version": "1.0.0"}

# ================= USER & CREDITS =================
@app.get("/api/user")
def get_user_profile():
    return load_user()

@app.post("/api/user/add-credits")
def refill_credits(payload: dict = Body(default={})):
    amount = payload.get("amount", 25)
    return add_credits(amount)

# ================= PROJECTS =================
@app.get("/api/projects")
def list_projects():
    return load_projects()

@app.get("/api/projects/{project_id}")
def get_project(project_id: str):
    p = get_project_by_id(project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p

@app.post("/api/projects")
def save_project(payload: dict = Body(...)):
    return create_or_update_project(payload)

@app.delete("/api/projects/{project_id}")
def remove_project(project_id: str):
    success = delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True}

# ================= SCRIPT & LLM =================
@app.post("/api/generate-script")
def api_generate_script(payload: dict = Body(...)):
    topic = payload.get("topic", "3 Shocking Facts")
    niche = payload.get("niche", "general")
    tone = payload.get("tone", "dramatic")
    duration = int(payload.get("target_duration", 30))
    hook_style = payload.get("hook_style", "curiosity")
    
    result = generate_script(topic, niche, tone, duration, hook_style)
    deduct_credit(1)
    return result

@app.post("/api/translate-script")
def api_translate_script(payload: dict = Body(...)):
    text = payload.get("text", "")
    target_lang = payload.get("target_lang", "es")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    return translate_script(text, target_lang)

# ================= AI VOICEOVER =================
@app.get("/api/voices")
def get_voices():
    return VOICE_LIBRARY

@app.post("/api/generate-voice")
async def api_generate_voice(payload: dict = Body(...)):
    text = payload.get("text", "")
    voice_id = payload.get("voice_id", "en-US-ChristopherNeural")
    speed = float(payload.get("speed", 1.0))
    pitch = int(payload.get("pitch", 0))

    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        result = await synthesize_speech(text, voice_id, speed, pitch)
        deduct_credit(1)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ================= MEDIA LIBRARIES =================
@app.get("/api/library/videos")
def get_video_library():
    return get_all_videos()

@app.get("/api/library/music")
def get_music_library():
    return get_all_music()

@app.get("/api/library/templates")
def get_template_library():
    return get_all_templates()

@app.post("/api/library/upload-video")
async def upload_custom_video(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix.lower()
    if suffix not in [".mp4", ".webm", ".mov", ".mkv"]:
        raise HTTPException(status_code=400, detail="Invalid video format. Supported: .mp4, .webm, .mov")

    file_path = UPLOADS_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "id": f"upload_{file_path.stem}",
        "title": f"Upload: {file_path.name[:25]}",
        "category": "Uploads",
        "url": f"/api/uploads/{file_path.name}",
        "filename": file_path.name,
        "is_stock": False
    }

# ================= RENDER & EXPORT =================
@app.post("/api/render")
def trigger_render(payload: dict = Body(...)):
    if not payload.get("audio_url"):
        raise HTTPException(status_code=400, detail="Voiceover audio_url is required")
    job_id = queue_render_job(payload)
    deduct_credit(2)
    return {"job_id": job_id, "status": "queued"}

@app.get("/api/render/{job_id}")
def check_render_status(job_id: str):
    status = get_job_status(job_id)
    if status.get("status") == "not_found":
        raise HTTPException(status_code=404, detail="Job not found")
    return status

@app.get("/api/download/{filename}")
def download_rendered_file(filename: str):
    file_path = EXPORTS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Export file not found")
    return FileResponse(str(file_path), media_type="video/mp4", filename=filename)

CLIENT_DIST = Path(__file__).resolve().parent.parent / "client" / "dist"
if CLIENT_DIST.exists():
    app.mount("/", StaticFiles(directory=str(CLIENT_DIST), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
