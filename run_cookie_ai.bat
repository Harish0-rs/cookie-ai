@echo off
echo ========================================================
echo               COOKIE AI - Crayo.ai Clone
echo      Viral Faceless Short-Form Video Creation App
echo ========================================================
echo.
echo Starting backend server on http://localhost:8000 ...
start "" http://localhost:8000
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
