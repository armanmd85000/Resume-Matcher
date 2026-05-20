# 🔧 Troubleshooting PDF Upload Issues

## Issue: "Failed to load resume (status 404)"

### Root Cause
The backend is not properly connected to Ollama or the database is having issues.

### Solution

#### Step 1: Verify All Services Are Running

```bash
# Check Ollama
curl http://127.0.0.1:11434/api/tags

# Check Backend
curl http://127.0.0.1:8000/api/v1/health

# Check Frontend
curl http://localhost:3000
```

#### Step 2: Restart All Services

**Stop all services:**
- Close all terminal windows running the services

**Start Ollama:**
```bash
ollama serve
```

**Start Backend (in new terminal):**
```bash
cd apps/backend
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

**Start Frontend (in new terminal):**
```bash
cd apps/frontend
npm run dev
```

#### Step 3: Verify Backend Configuration

Check `apps/backend/.env`:
```
LLM_PROVIDER=ollama
OLLAMA_URL=http://127.0.0.1:11434
LLM_MODEL=gemma3:4b
```

#### Step 4: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button → "Empty cache and hard refresh"
3. Or: Ctrl+Shift+Delete → Clear all

#### Step 5: Test API Directly

```bash
# Test health endpoint
curl http://127.0.0.1:8000/api/v1/health

# Should return:
# {"status":"ok","llm":{"healthy":true,"provider":"ollama",...}}
```

---

## Issue: Hydration Error in Console

### Root Cause
Next.js server-side rendering doesn't match client-side rendering.

### Solution

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R)
3. **Restart frontend:**
   ```bash
   # Stop: Ctrl+C
   # Start:
   cd apps/frontend
   npm run dev
   ```

---

## Issue: PDF Extraction Not Working

### Root Cause
Playwright (PDF parser) is not installed or Ollama is offline.

### Solution

#### Install Playwright:
```bash
cd apps/backend
playwright install --with-deps chromium
```

#### Verify Ollama is running:
```bash
ollama list
ollama serve
```

---

## Issue: "LLM is offline"

### Root Cause
Ollama is not running or not responding on port 11434.

### Solution

1. **Start Ollama:**
   ```bash
   ollama serve
   ```

2. **Verify it's running:**
   ```bash
   curl http://127.0.0.1:11434/api/tags
   ```

3. **Check if port 11434 is in use:**
   ```bash
   netstat -ano | findstr :11434
   ```

4. **If port is in use, kill the process:**
   ```bash
   taskkill /PID <PID> /F
   ```

---

## Complete Restart Procedure

If everything is broken, do a complete restart:

### 1. Stop All Services
- Close all terminal windows

### 2. Kill Any Remaining Processes
```bash
taskkill /F /IM ollama.exe
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

### 3. Start Fresh (in order)

**Terminal 1 - Ollama:**
```bash
ollama serve
```

**Terminal 2 - Backend:**
```bash
cd apps/backend
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

**Terminal 3 - Frontend:**
```bash
cd apps/frontend
npm run dev
```

### 4. Verify Everything
```bash
# In a 4th terminal
curl http://127.0.0.1:11434/api/tags
curl http://127.0.0.1:8000/api/v1/health
curl http://localhost:3000
```

### 5. Test Upload
1. Open http://localhost:3000
2. Upload a PDF resume
3. Should work now!

---

## Checklist

- [ ] Ollama is running (`ollama serve`)
- [ ] Backend is running (port 8000)
- [ ] Frontend is running (port 3000)
- [ ] Backend .env has `LLM_PROVIDER=ollama`
- [ ] Backend .env has `OLLAMA_URL=http://127.0.0.1:11434`
- [ ] Playwright is installed (`playwright install --with-deps chromium`)
- [ ] Browser cache is cleared
- [ ] All three services started in correct order

---

## Quick Diagnostics

### Check Ollama
```bash
curl http://127.0.0.1:11434/api/tags
```
Should return JSON with models list.

### Check Backend Health
```bash
curl http://127.0.0.1:8000/api/v1/health
```
Should return `{"status":"ok",...}` with `"healthy":true`.

### Check Backend Logs
Look at the backend terminal for error messages.

### Check Frontend Logs
Open browser DevTools (F12) → Console tab for errors.

---

## If Still Not Working

1. **Restart computer** (sometimes helps with port binding)
2. **Check firewall** (make sure ports 3000, 8000, 11434 are not blocked)
3. **Check antivirus** (sometimes blocks local connections)
4. **Reinstall dependencies:**
   ```bash
   cd apps/backend
   pip install -r requirements.txt
   playwright install --with-deps chromium
   
   cd ../frontend
   npm install
   ```

---

## Success Indicators

✅ Ollama terminal shows: `Listening on 127.0.0.1:11434`
✅ Backend terminal shows: `Uvicorn running on http://0.0.0.0:8000`
✅ Frontend terminal shows: `Next.js running on http://localhost:3000`
✅ Browser shows Resume Matcher dashboard
✅ Can upload PDF without errors
✅ Resume content appears after upload

---

**If you follow these steps, everything should work!** 🚀

