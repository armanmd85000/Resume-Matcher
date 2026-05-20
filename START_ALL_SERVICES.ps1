# ============================================================================
# Resume Matcher + Ollama - Start All Services
# ============================================================================
# This script starts all three services (Ollama, Backend, Frontend)
# Run this once and all services will stay running
# ============================================================================

Write-Host @"
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║              🚀 Starting Resume Matcher + Ollama Services                  ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"@

Write-Host "`n⏳ Starting services...`n"

# Start Backend (FastAPI)
Write-Host "1️⃣  Starting Backend (FastAPI on port 8000)..."
Start-Process -FilePath "powershell.exe" -ArgumentList @"
  cd "$PSScriptRoot\apps\backend"
  python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
"@ -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend (Next.js)
Write-Host "2️⃣  Starting Frontend (Next.js on port 3000)..."
Start-Process -FilePath "powershell.exe" -ArgumentList @"
  cd "$PSScriptRoot\apps\frontend"
  npm run dev
"@ -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Ollama
Write-Host "3️⃣  Starting Ollama (Local LLM on port 11434)..."
Start-Process -FilePath "powershell.exe" -ArgumentList @"
  ollama serve
"@ -WindowStyle Normal

Write-Host @"

╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    ✅ All Services Starting!                              ║
║                                                                            ║
║  Three new PowerShell windows will open. Keep them all open!              ║
║                                                                            ║
║  🤖 Ollama:   http://localhost:11434                                      ║
║  🔧 Backend:  http://localhost:8000                                       ║
║  🌐 Frontend: http://localhost:3000                                       ║
║                                                                            ║
║  ⏳ Wait 10-15 seconds for all services to fully start                     ║
║                                                                            ║
║  Then open: http://localhost:3000 in your browser                         ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"@

Write-Host "`n⏳ Waiting for services to start..."
Start-Sleep -Seconds 10

Write-Host "`n🧪 Testing services...`n"

# Test Ollama
try {
    $ollama = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -UseBasicParsing
    Write-Host "✅ Ollama is responding"
} catch {
    Write-Host "⏳ Ollama still starting..."
}

# Test Backend
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/health" -UseBasicParsing
    Write-Host "✅ Backend is responding"
} catch {
    Write-Host "⏳ Backend still starting..."
}

# Test Frontend
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Frontend is responding"
} catch {
    Write-Host "⏳ Frontend still starting (this is normal)..."
}

Write-Host @"

╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                    🎉 Ready to Use!                                       ║
║                                                                            ║
║  Open your browser: http://localhost:3000                                 ║
║                                                                            ║
║  If Ollama shows as offline:                                              ║
║  1. Refresh the page (Ctrl+R)                                             ║
║  2. Wait a few more seconds                                               ║
║  3. Try again                                                              ║
║                                                                            ║
║  All three PowerShell windows must stay open!                             ║
║  Do NOT close them.                                                        ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
"@

Write-Host "`nPress any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
