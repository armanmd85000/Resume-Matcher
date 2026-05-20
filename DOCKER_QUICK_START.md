# 🐳 Docker Quick Start - Resume Matcher

Get Resume Matcher running with Docker in 5 minutes!

---

## ⚡ 5-Minute Setup

### Step 1: Install Docker Desktop
- Download: https://www.docker.com/products/docker-desktop
- Install and restart computer
- Verify: `docker --version`

### Step 2: Clone Repository
```bash
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher
```

### Step 3: Create .env File
```bash
# Create .env in project root
echo "LLM_PROVIDER=claude" > .env
echo "LLM_MODEL=claude-3-5-sonnet-20241022" >> .env
echo "LLM_API_KEY=sk-your-claude-key-here" >> .env
```

### Step 4: Start Docker
```bash
docker compose up -d
```

### Step 5: Open App
```
http://localhost:3000
```

---

## ✅ Verify Everything Works

```bash
# Check containers running
docker ps

# View logs
docker compose logs -f

# Test backend
curl http://localhost:8000/api/v1/health

# Test frontend
curl http://localhost:3000
```

---

## 🎯 Common Tasks

### View Logs
```bash
docker compose logs -f
```

### Stop Services
```bash
docker compose down
```

### Restart Services
```bash
docker compose restart
```

### Rebuild After Changes
```bash
docker compose build && docker compose up -d
```

### Clean Everything
```bash
docker compose down -v
```

---

## 🌐 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 🔑 API Keys

### Claude
```
LLM_PROVIDER=claude
LLM_API_KEY=sk-ant-your-key-here
```

### OpenAI
```
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-key-here
```

### Ollama (Local)
```
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://ollama:11434
```

---

## 🆘 Troubleshooting

### Port in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Container Won't Start
```bash
# Check logs
docker compose logs backend

# Rebuild
docker compose build --no-cache
docker compose up -d
```

### Can't Connect
```bash
# Verify containers running
docker ps

# Check network
docker network ls
```

---

## 📊 What's Running

- **Frontend:** Next.js on port 3000
- **Backend:** FastAPI on port 8000
- **Ollama:** Local AI on port 11434 (optional)

---

## 🎉 Done!

Resume Matcher is now running with Docker!

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f
```

**Open:** http://localhost:3000

---

**For detailed guide:** See DOCKER_SETUP_GUIDE.md

