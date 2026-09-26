# 🍪 COOKIE AI — Viral Faceless Video Generator (Crayo.ai Clone)

**COOKIE AI** is a full-stack, AI-powered short-form video creation web application targeted at creators producing faceless TikTok, Instagram Reels, and YouTube Shorts content.

---

## 🚀 Quick Start

### 1. Launch the Web App
Double-click `run_cookie_ai.bat` or run:

```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser!

### 2. Frontend Development Server (Optional)
If modifying the React client with Vite hot module replacement:
```bash
cd client
npm.cmd run dev
```
Open **[http://localhost:5173](http://localhost:5173)** (automatically proxies `/api` to the backend on port 8000).

---

## 🎬 Core Features & User Flow

### 1. Auth & Creator Dashboard
- Creator Pro tier tracking with credits tracker (e.g. 50 generation credits, 1 credit per AI generation/render).
- Analytics overview: Estimated Reach (4.2M views), Videos Created, Hours Saved (28.5 hrs).
- Projects Gallery with video thumbnails, duration badges, "Edit in Studio", "Play Preview", and "Delete" actions.
- Instant Credit Refill modal (+25 Credits or +100 Credits).

### 2. Script Generator
- **AI Generator**: Prompt input (topic + niche + tone + hook style + duration).
- Powered by OpenRouter LLM (`OPENROUTER_API_KEY` in environment) with curated high-retention fallback templates.
- **Editable Output**: Live word counter, estimated speech duration, and instant viral prompt ideas (Reddit AITA, Ocean Mysteries, Stoic Wisdom, Shower Thoughts).

### 3. AI Voiceover Library & Word-Level Timestamps
- Selectable neural voice library powered by `edge-tts`:
  - 🇺🇸 US: Christopher (Deep Storyteller / Reddit viral), Guy (Hype / Energetic), Jenny (Narrative), Eric (Casual / Gaming), Roger (Movie Trailer)
  - 🇬🇧 UK: Sonia (Classy Documentary), Ryan (Dark Mystery)
  - 🇦🇺 AU: Natasha (Bright & Upbeat), William (Resonant)
  - 🇪🇸 🇫🇷 🇩🇪 🇯🇵 🇧🇷 🇮🇳 International voices for translation
- Voice speed slider (0.75x to 1.5x) and pitch adjustment (-15Hz to +15Hz).
- Interactive audio sample playback.
- Millisecond word timestamps (`[{ word: "Whatever", start: 0.1, end: 0.68 }, ...]`) for word-by-word active caption animation.

### 4. Background Video Library
- Filterable gallery of vertical 9:16 background clips:
  - 🎮 Minecraft Parkour
  - 🛹 Subway Surfers High Speed
  - 🧼 Satisfying Kinetic Sand Slicing
  - 🚗 GTA V Mega Ramp Stunts
  - 🏎️ Neon Cyberpunk Night Highway
  - 🌿 Cinematic Nature Drone 4K
- **Custom Upload**: Drag and drop any MP4/WebM video.

### 5. Auto Captions & Subtitles Engine
- Real-time word-by-word active highlight synchronization.
- **Viral Presets**:
  - **Hormozi / MrBeast**: Montserrat Black, uppercase, bright yellow active word pop, thick black stroke outline.
  - **Crayo Viral**: Komika Axis, neon cyan & yellow bounce, drop shadow.
  - **Clean Minimalist**: Poppins Bold, clean white with rounded pill aesthetic.
  - **Cyber Neon Glow**: Bebas Neue, neon pink/violet highlight.
- Custom controls: Words per line (1, 2, 3, or 4 words), highlight colors, vertical position slider, uppercase toggle.

### 6. Music & SFX Library with Smart Ducking
- Royalty-free background tracks: Brazilian Phonk, Lofi Chill, Cinematic Piano, Dark Horror, Upbeat Hip-Hop.
- Dual-track volume mixer (voiceover volume vs background music volume).
- Audio ducking (automatically lowers background music when voiceover is speaking).

### 7. 1-Click Viral Templates
- **Reddit Storytime (AITA)**: Minecraft Parkour + Christopher voice + Hormozi yellow captions + Lofi music.
- **Did You Know? Facts**: Subway Surfers + Guy hype voice + Crayo cyan bounce captions + Phonk music.
- **Stoic Wisdom & Discipline**: Nature Drone + Sonia classy voice + Minimalist captions + Piano music.
- **Unsolved Dark Mystery**: Cyberpunk drive + Roger trailer voice + Neon red captions + Horror music.
- **Shower Thoughts**: Kinetic Sand + Eric voice + Modern pill captions + Lofi music.

### 8. Studio Editor & Multi-Track Timeline
- **9:16 Mobile Canvas Studio**: Interactive iPhone 16 mockup preview rendering synchronized video loop, voiceover, music, and animated captions in real time.
- **Interactive Multi-Track Timeline**:
  - Visuals track
  - Voiceover track with audio waveform
  - Background music track
  - Word-level captions track: Click any word to jump the playhead to that exact millisecond!
- Keyboard shortcut: <kbd>Space</kbd> to Play / Pause.

### 9. Multi-Language Translation
- 1-Click script translation into Spanish, French, German, Japanese, Portuguese, Hindi, etc.
- Automatically selects the native neural voice in that target language.
- Re-synthesizes voiceover and realigns word timestamps with one click.

### 10. Dual Render & Export Pipeline
- **HQ Server Render (FFmpeg Queue)**:
  - Vertical 9:16 video compositing at 720p or 1080p.
  - Burns styled ASS/SRT karaoke subtitles directly into the video stream.
  - Mixes and ducks audio tracks.
  - Background queue with live progress bar.
- **Instant Client Export (0-Sec Queue)**:
  - Directly records the 9:16 Canvas and mixed Web Audio via browser `MediaRecorder`.
- **Social Media Safe Zone Simulator**:
  - Toggle TikTok, Instagram Reels, and YouTube Shorts UI overlays to verify captions remain visible and unblocked.
  - 1-Click copy of viral hashtags and video caption for instant posting.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas MediaRecorder API, Canvas Confetti.
- **Backend**: Python 3.12, FastAPI, Uvicorn, Requests, AsyncIO.
- **Text-to-Speech & Timestamps**: `edge-tts` (Microsoft Edge Neural Voice Engine).
- **LLM Script & Translation**: OpenRouter API (`openai/gpt-4o-mini`).
- **Video Compositing**: Standalone FFmpeg v7.1 (`imageio-ffmpeg`).
