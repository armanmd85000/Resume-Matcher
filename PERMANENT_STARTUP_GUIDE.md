# 🚀 Permanent Startup Guide - Resume Matcher + Ollama

## Quick Start (Easiest Way)

### Option 1: Run the Batch File (Windows)

1. **Double-click:** `START_ALL_SERVICES.bat`
2. **Three windows will open** - keep them all open
3. **Wait 10-15 seconds** for services to start
4. **Open browser:** http://localhost:3000
5. **Done!** All services running

### Option 2: Run the PowerShell Script

1. **Right-click:** `START_ALL_SERVICES.ps1`
2. **Select:** "Run with PowerShell"
3. **Three windows will open** - keep them all open
4. **Wait 10-15 seconds** for services to start
5. **Open browser:** http://localhost:3000
6. **Done!** All services running

---

## Manual Startup (If Scripts Don't Work)

### Terminal 1: Start Ollama
```bash
ollama serve
```
**Keep this terminal open!**

### Terminal 2: Start Backend
```bash
cd apps/backend
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```
**Keep this terminal open!**

### Terminal 3: Start Frontend
```bash
cd apps/frontend
npm run dev
```
**Keep this terminal open!**

### Terminal 4: Open Browser
```
http://localhost:3000
```

---

## What Each Service Does

### 🤖 Ollama (Port 11434)
- Local AI model
- Processes resume text
- Generates tailored content
- **Must be running for AI features**

### 🔧 Backend (Port 8000)
- FastAPI server
- Handles file uploads
- Processes resumes
- Communicates with Ollama
- **Must be running for app to work**

### 🌐 Frontend (Port 3000)
- Next.js web interface
- User dashboard
- Resume editor
- Settings page
- **Must be running to access the app**

---

## Troubleshooting

### Issue: "Ollama is offline" in Frontend

**Solution:**
1. Verify Ollama is running: `curl http://127.0.0.1:11434/api/tags`
2. Refresh browser (Ctrl+R)
3. Wait 5 more seconds
4. Try again

### Issue: PDF Upload Fails

**Solution:**
1. Check all three services are running
2. Restart backend
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh (Ctrl+Shift+R)

### Issue: "Cannot connect to backend"

**Solution:**
1. Verify backend is running on port 8000
2. Check backend terminal for errors
3. Restart backend

### Issue: Frontend shows blank page

**Solution:**
1. Wait 10-15 seconds for frontend to fully start
2. Refresh browser (Ctrl+R)
3. Check browser console (F12) for errors

---

## Keeping Services Running

### Important: All Three Windows Must Stay Open

```
❌ DO NOT close any of the three terminal windows
❌ DO NOT minimize them (they might stop)
✅ DO keep them visible or in taskbar
✅ DO minimize them if needed (they keep running)
```

### To Stop All Services

1. Close all three terminal windows
2. Or press Ctrl+C in each window

### To Restart Services

1. Close all three windows
2. Run `START_ALL_SERVICES.bat` again
3. Or start them manually in three terminals

---

## Permanent Setup (Windows Startup)

### Create a Shortcut to Auto-Start Services

1. **Right-click desktop** → New → Shortcut
2. **Location:** `C:\Windows\System32\cmd.exe /c START_ALL_SERVICES.bat`
3. **Name:** "Resume Matcher"
4. **Click Finish**

Now you can double-click the shortcut to start all services!

### Add to Windows Startup (Auto-Start on Boot)

1. **Press:** Win+R
2. **Type:** `shell:startup`
3. **Copy** `START_ALL_SERVICES.bat` to this folder
4. **Now services start automatically when you boot!**

---

## Quick Reference

| Task | Command |
|------|---------|
| Start all services | Double-click `START_ALL_SERVICES.bat` |
| Start Ollama | `ollama serve` |
| Start Backend | `cd apps/backend && python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0` |
| Start Frontend | `cd apps/frontend && npm run dev` |
| Open app | http://localhost:3000 |
| Check Ollama | `curl http://127.0.0.1:11434/api/tags` |
| Check Backend | `curl http://127.0.0.1:8000/api/v1/health` |

---

## Service URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:8000 | 8000 |
| Backend Docs | http://localhost:8000/docs | 8000 |
| Ollama | http://localhost:11434 | 11434 |

---

## Success Indicators

✅ Three terminal windows open
✅ Ollama terminal shows: `Listening on 127.0.0.1:11434`
✅ Backend terminal shows: `Uvicorn running on http://0.0.0.0:8000`
✅ Frontend terminal shows: `Next.js running on http://localhost:3000`
✅ Browser shows Resume Matcher dashboard
✅ Ollama shows as "ONLINE" in settings
✅ Can upload PDF without errors

---

## If Something Goes Wrong

### Complete Reset

1. **Close all three windows**
2. **Kill any remaining processes:**
   ```bash
   taskkill /F /IM ollama.exe
   taskkill /F /IM python.exe
   taskkill /F /IM node.exe
   ```
3. **Wait 5 seconds**
4. **Run `START_ALL_SERVICES.bat` again**

---

## Tips

1. **Keep all three windows open** - services need to stay running
2. **Minimize windows if needed** - they keep running in background
3. **Use the batch file** - easiest way to start everything
4. **Refresh browser if Ollama shows offline** - it usually connects after refresh
5. **Wait 10-15 seconds** - services need time to fully start

---

## You're All Set!

Now you can:
- ✅ Start all services with one click
- ✅ Keep them running permanently
- ✅ Use Resume Matcher anytime
- ✅ Tailor resumes with Ollama AI
- ✅ Export as PDF

**Happy resume building!** 🚀

