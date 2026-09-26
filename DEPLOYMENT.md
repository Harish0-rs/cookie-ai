# 🌐 COOKIE AI — Deployment Guide

This guide explains how to deploy **COOKIE AI** to production cloud platforms.

---

## ⚡ Option 1: Deploy to Railway (Recommended — Best for FFmpeg & AI)

Railway provides native Docker and GPU/CPU rendering support with zero complex setup.

1. Push your local git repository to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cookie-ai.git
   git branch -M main
   git push -u origin main
   ```
2. Go to **[Railway.app](https://railway.app)** and click **"New Project"**.
3. Select **"Deploy from GitHub repo"** and select your `cookie-ai` repository.
4. In the Railway dashboard:
   - Go to **Variables** and add:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key (`sk-or-v1-...`)
   - Go to **Settings** → **Networking** → Click **"Generate Domain"**.
5. Railway will automatically build the `Dockerfile`, install FFmpeg, compile the React assets, and launch the site with an instant public `https://...up.railway.app` URL!

---

## 🚀 Option 2: Deploy to Render.com

Render automatically recognizes the included `render.yaml` blueprint.

1. Push your repository to GitHub.
2. Go to **[Render.com](https://render.com)**.
3. Click **"New +"** → **"Blueprint"**.
4. Connect your `cookie-ai` GitHub repository.
5. Render will detect `render.yaml` and create a Web Service using Docker:
   - Add your `OPENROUTER_API_KEY` under Environment Variables.
6. Click **"Apply"**. Render will deploy your app with a free `https://cookie-ai.onrender.com` domain!

---

## 🐳 Option 3: Docker on Any VPS (DigitalOcean, AWS EC2, GCP, Hetzner)

If deploying to your own Linux virtual server:

1. Clone or copy the `cookie-ai` folder to your server:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cookie-ai.git
   cd cookie-ai
   ```
2. Start the container with Docker Compose:
   ```bash
   docker compose up -d --build
   ```
3. Your app is now running on port `8000` with volume persistence for all generated video exports and project data!
4. (Optional) Set up Nginx or Caddy with Let's Encrypt SSL for your custom domain:
   ```caddy
   yourdomain.com {
       reverse_proxy localhost:8000
   }
   ```

---

## 📱 Option 4: Instant Mobile Phone Access (Same WiFi)

To test COOKIE AI on your phone right now without cloud hosting:
1. Find your computer's local IP address on Windows:
   ```powershell
   ipconfig
   # Look for IPv4 Address (e.g. 192.168.1.50)
   ```
2. Ensure the backend is running (`run_cookie_ai.bat`).
3. Open **`http://192.168.1.50:8000`** in your mobile browser (Safari/Chrome on iOS or Android).
4. You can now generate scripts, preview 9:16 videos, and test exports directly from your smartphone!
