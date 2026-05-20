# 🐳 Docker Setup Guide - Resume Matcher

Run Resume Matcher easily with Docker and Docker Compose.

---

## 📋 Prerequisites

### Install Docker Desktop

**Windows:**
1. Download from: https://www.docker.com/products/docker-desktop
2. Run installer
3. Restart computer
4. Verify: `docker --version`

**Mac:**
```bash
brew install docker
# Or download Docker Desktop from https://www.docker.com/products/docker-desktop
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

---

## 🚀 Quick Start with Docker

### Step 1: Clone Repository

```bash
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher
```

### Step 2: Create .env File

Create `.env` in project root:

```
# Using Claude API
LLM_PROVIDER=claude
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_API_KEY=sk-your-claude-key-here

# Or using OpenAI
# LLM_PROVIDER=openai
# LLM_MODEL=gpt-4o-mini
# LLM_API_KEY=sk-your-openai-key-here

# Or using Ollama (local)
# LLM_PROVIDER=ollama
# OLLAMA_BASE_URL=http://ollama:11434
# LLM_MODEL=gemma
```

### Step 3: Start with Docker Compose

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Step 4: Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 📊 What Docker Compose Does

The `docker-compose.yml` file starts:

1. **Frontend Container** (Next.js)
   - Port: 3000
   - Serves the web UI

2. **Backend Container** (FastAPI)
   - Port: 8000
   - Handles resume processing
   - Connects to LLM API

3. **Ollama Container** (Optional)
   - Port: 11434
   - Local AI model
   - Only if using Ollama

---

## 🔧 Common Docker Commands

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop Services
```bash
docker compose down
```

### Restart Services
```bash
docker compose restart
```

### Rebuild After Code Changes
```bash
docker compose build && docker compose up -d
```

### Update to Latest
```bash
docker compose pull && docker compose up -d
```

### Remove Everything (Clean Slate)
```bash
docker compose down -v
```

### Check Running Containers
```bash
docker ps
```

### View Container Details
```bash
docker inspect resume-matcher-backend
```

---

## 💾 Data Persistence

Resume data is stored in Docker volumes.

### Backup Data
```bash
docker cp resume-matcher-backend:/app/backend/data ./backup
```

### Restore Data
```bash
docker cp ./backup resume-matcher-backend:/app/backend/data
```

### View Volume Info
```bash
docker volume ls
docker volume inspect resume-matcher_resume-data
```

---

## 🔐 Environment Variables

### Claude API
```
LLM_PROVIDER=claude
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_API_KEY=sk-ant-your-key-here
```

### OpenAI API
```
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o-mini
LLM_API_KEY=sk-your-key-here
```

### Ollama (Local)
```
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://ollama:11434
LLM_MODEL=gemma
```

### Anthropic Claude
```
LLM_PROVIDER=anthropic
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_API_KEY=sk-ant-your-key-here
```

---

## 🐳 Docker Compose File

The `docker-compose.yml` looks like:

```yaml
version: '3.8'

services:
  frontend:
    image: node:22-alpine
    working_dir: /app/frontend
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    command: npm run dev
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

  backend:
    image: python:3.13-slim
    working_dir: /app/backend
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    env_file:
      - .env
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama

volumes:
  ollama-data:
  resume-data:
```

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
docker compose -f docker-compose.yml -p myapp up -d
```

### Container Won't Start

```bash
# Check logs
docker compose logs backend

# Rebuild
docker compose build --no-cache
docker compose up -d
```

### Can't Connect to Backend

```bash
# Check if backend is running
docker ps

# Check backend logs
docker compose logs backend

# Restart backend
docker compose restart backend
```

### Out of Disk Space

```bash
# Clean up unused images
docker image prune -a

# Clean up unused volumes
docker volume prune

# Clean up everything
docker system prune -a
```

---

## 📈 Performance Tips

1. **Use .dockerignore** - Exclude unnecessary files
2. **Multi-stage builds** - Reduce image size
3. **Volume mounts** - For development (faster than copying)
4. **Resource limits** - Set memory/CPU limits

---

## 🔄 Development Workflow

### With Docker

```bash
# Start services
docker compose up -d

# Make code changes (auto-reload with --reload flag)

# View logs
docker compose logs -f

# Stop when done
docker compose down
```

### Without Docker (Local)

```bash
# Terminal 1: Backend
cd apps/backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd apps/frontend
npm run dev

# Terminal 3: Ollama (if using)
ollama serve
```

---

## 🚀 Deploy Docker to Production

### Option 1: Docker Hub

```bash
# Build image
docker build -t your-username/resume-matcher .

# Push to Docker Hub
docker push your-username/resume-matcher

# Run on server
docker run -p 3000:3000 -p 8000:8000 your-username/resume-matcher
```

### Option 2: Heroku with Docker

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set LLM_PROVIDER=claude
heroku config:set LLM_API_KEY=sk-your-key

# Deploy
git push heroku main
```

### Option 3: AWS, GCP, Azure

Use their container services to deploy Docker images.

---

## 📊 Docker Compose vs Local

| Aspect | Docker | Local |
|--------|--------|-------|
| Setup | Easy | Manual |
| Isolation | Yes | No |
| Performance | Slightly slower | Faster |
| Consistency | Guaranteed | Depends on OS |
| Deployment | Easy | Complex |
| Development | Good | Better |

---

## 🎯 Best Practices

1. **Use .env files** - Don't hardcode secrets
2. **Use volumes** - For persistent data
3. **Use networks** - For service communication
4. **Use health checks** - Monitor container health
5. **Use resource limits** - Prevent runaway containers
6. **Use logging** - Monitor container logs
7. **Use restart policies** - Auto-restart on failure

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `docker compose up -d` | Start all services |
| `docker compose down` | Stop all services |
| `docker compose logs -f` | View logs |
| `docker compose build` | Build images |
| `docker compose restart` | Restart services |
| `docker ps` | List running containers |
| `docker exec -it <container> bash` | Enter container |
| `docker volume ls` | List volumes |
| `docker network ls` | List networks |

---

## 🎉 You're Ready!

Resume Matcher is now ready to run with Docker!

```bash
# One command to start everything
docker compose up -d

# Open in browser
http://localhost:3000
```

**Happy resume building!** 🚀

