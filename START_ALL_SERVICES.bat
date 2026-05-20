@echo off
REM ============================================================================
REM Resume Matcher + Ollama - Start All Services (Batch File)
REM ============================================================================
REM This script starts all three services in separate windows
REM Run this file and all services will start automatically
REM ============================================================================

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║              🚀 Starting Resume Matcher + Ollama Services                  ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

echo ⏳ Starting services...
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Start Backend (FastAPI)
echo 1️⃣  Starting Backend (FastAPI on port 8000)...
start "Resume Matcher - Backend" cmd /k "cd /d "%SCRIPT_DIR%apps\backend" && python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0"

timeout /t 3 /nobreak

REM Start Frontend (Next.js)
echo 2️⃣  Starting Frontend (Next.js on port 3000)...
start "Resume Matcher - Frontend" cmd /k "cd /d "%SCRIPT_DIR%apps\frontend" && npm run dev"

timeout /t 3 /nobreak

REM Start Ollama
echo 3️⃣  Starting Ollama (Local LLM on port 11434)...
start "Resume Matcher - Ollama" cmd /k "ollama serve"

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║                    ✅ All Services Starting!                              ║
echo ║                                                                            ║
echo ║  Three new windows will open. Keep them all open!                         ║
echo ║                                                                            ║
echo ║  🤖 Ollama:   http://localhost:11434                                      ║
echo ║  🔧 Backend:  http://localhost:8000                                       ║
echo ║  🌐 Frontend: http://localhost:3000                                       ║
echo ║                                                                            ║
echo ║  ⏳ Wait 10-15 seconds for all services to fully start                     ║
echo ║                                                                            ║
echo ║  Then open: http://localhost:3000 in your browser                         ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

timeout /t 15 /nobreak

echo.
echo 🧪 Testing services...
echo.

REM Test Ollama
powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -UseBasicParsing; Write-Host '✅ Ollama is responding' } catch { Write-Host '⏳ Ollama still starting...' }"

REM Test Backend
powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/health' -UseBasicParsing; Write-Host '✅ Backend is responding' } catch { Write-Host '⏳ Backend still starting...' }"

REM Test Frontend
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 3; Write-Host '✅ Frontend is responding' } catch { Write-Host '⏳ Frontend still starting (this is normal)...' }"

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║                    🎉 Ready to Use!                                       ║
echo ║                                                                            ║
echo ║  Open your browser: http://localhost:3000                                 ║
echo ║                                                                            ║
echo ║  If Ollama shows as offline:                                              ║
echo ║  1. Refresh the page (Ctrl+R)                                             ║
echo ║  2. Wait a few more seconds                                               ║
echo ║  3. Try again                                                              ║
echo ║                                                                            ║
echo ║  All three windows must stay open!                                        ║
echo ║  Do NOT close them.                                                        ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

pause
