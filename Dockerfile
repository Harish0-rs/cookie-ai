# Production Dockerfile for COOKIE AI (FastAPI + FFmpeg + React Frontend)
FROM python:3.12-slim

# Install system FFmpeg and required media libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend source code and assets
COPY backend/ /app/backend/

# Copy pre-built React production bundle
COPY client/dist/ /app/client/dist/

# Create data directories
RUN mkdir -p /app/backend/data/exports \
    /app/backend/data/audio \
    /app/backend/data/uploads \
    /app/backend/data/stock_videos \
    /app/backend/data/stock_audio

WORKDIR /app/backend

# Pre-generate stock assets if not already bundled
RUN python create_stock_assets.py || true

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
