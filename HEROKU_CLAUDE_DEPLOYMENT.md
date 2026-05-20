# 🚀 Deploy Resume Matcher to Heroku with Claude API

Complete guide to deploy Resume Matcher to Heroku and use Claude API instead of Ollama.

---

## 📋 Prerequisites

1. **Heroku Account** - Sign up at https://www.heroku.com (free tier available)
2. **Claude API Key** - Get from https://console.anthropic.com/
3. **Git** - Already installed
4. **Heroku CLI** - Download from https://devcenter.heroku.com/articles/heroku-cli

---

## 🎯 Step 1: Get Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up or login
3. Click "API Keys" in left menu
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)
6. **Save it somewhere safe** - you'll need it

---

## 🎯 Step 2: Install Heroku CLI

### Windows:
```bash
# Download and run installer from:
# https://devcenter.heroku.com/articles/heroku-cli

# Or use winget:
winget install Heroku.CLI
```

### Mac:
```bash
brew tap heroku/brew && brew install heroku
```

### Linux:
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

**Verify:**
```bash
heroku --version
```

---

## 🎯 Step 3: Login to Heroku

```bash
heroku login
```

This opens a browser window. Click "Login" and you're authenticated!

---

## 🎯 Step 4: Create Heroku App

```bash
# Navigate to Resume Matcher directory
cd Resume-Matcher

# Create a new Heroku app
heroku create your-app-name

# Example:
heroku create resume-matcher-claude
```

**Note:** App name must be unique. If taken, try a different name.

---

## 🎯 Step 5: Configure Environment Variables

### Set Claude API Key:
```bash
heroku config:set LLM_PROVIDER=claude
heroku config:set LLM_MODEL=claude-3-5-sonnet-20241022
heroku config:set LLM_API_KEY=sk-ant-your-key-here
```

### Set Other Variables:
```bash
heroku config:set HOST=0.0.0.0
heroku config:set PORT=8000
heroku config:set FRONTEND_BASE_URL=https://your-app-name.herokuapp.com
```

### Verify Configuration:
```bash
heroku config
```

---

## 🎯 Step 6: Create Procfile

Create a file named `Procfile` in the project root:

```
web: cd apps/backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 🎯 Step 7: Create runtime.txt

Create a file named `runtime.txt` in the project root:

```
python-3.13.12
```

---

## 🎯 Step 8: Deploy to Heroku

```bash
# Add files to git
git add Procfile runtime.txt

# Commit
git commit -m "Add Heroku deployment files"

# Deploy
git push heroku main
```

**Wait for deployment to complete** (takes 2-5 minutes)

---

## 🎯 Step 9: View Logs

```bash
# Watch logs in real-time
heroku logs --tail

# View last 50 lines
heroku logs -n 50
```

---

## 🎯 Step 10: Access Your App

```bash
# Open app in browser
heroku open

# Or manually go to:
https://your-app-name.herokuapp.com
```

---

## ✅ Verify Deployment

### Check Backend Health:
```bash
curl https://your-app-name.herokuapp.com/api/v1/health
```

Should return:
```json
{"status":"ok","llm":{"healthy":true,"provider":"claude",...}}
```

### Check Frontend:
```
https://your-app-name.herokuapp.com
```

Should show Resume Matcher dashboard

---

## 🔧 Configure Claude in Settings

1. Open https://your-app-name.herokuapp.com
2. Click **Settings** (gear icon)
3. Select **LLM Provider** → **Claude**
4. **API Key:** Your Claude API key
5. **Model:** `claude-3-5-sonnet-20241022`
6. Click **Save**

---

## 📊 Available Claude Models

| Model | Speed | Quality | Cost | Recommended |
|-------|-------|---------|------|-------------|
| claude-3-5-haiku-20241022 | ⚡⚡⚡ | ⭐⭐ | $ | Budget |
| claude-3-5-sonnet-20241022 | ⚡⚡ | ⭐⭐⭐⭐ | $$ | ✅ Best |
| claude-3-opus-20250219 | ⚡ | ⭐⭐⭐⭐⭐ | $$$ | Premium |

---

## 🔄 Keep App Running Permanently

### Option 1: Heroku Paid Dyno (Recommended)

```bash
# Upgrade to paid dyno (keeps app always running)
heroku dyno:type standard-1x

# Cost: $7/month
```

### Option 2: Free Dyno (Limited)

Free dyno sleeps after 30 minutes of inactivity. To keep it awake:

```bash
# Install Heroku Scheduler
heroku addons:create scheduler:standard

# Then add a job to ping your app every 30 minutes
# (This keeps it from sleeping)
```

### Option 3: Use UptimeRobot (Free)

1. Go to https://uptimerobot.com
2. Sign up (free)
3. Add monitor for: `https://your-app-name.herokuapp.com`
4. Set interval to 5 minutes
5. This pings your app and keeps it awake

---

## 📈 Monitor Your App

### View Metrics:
```bash
heroku metrics
```

### View Dyno Status:
```bash
heroku ps
```

### View Config:
```bash
heroku config
```

---

## 🔄 Update Your App

### After Making Changes:

```bash
# Commit changes
git add .
git commit -m "Your changes"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## 🆘 Troubleshooting

### App Won't Start

```bash
# Check logs
heroku logs --tail

# Common issues:
# 1. Missing environment variables
heroku config

# 2. Python version mismatch
# Edit runtime.txt to match your Python version

# 3. Dependencies not installed
# Make sure requirements.txt is in apps/backend/
```

### Claude API Not Working

```bash
# Verify API key is set
heroku config | grep LLM_API_KEY

# If not set:
heroku config:set LLM_API_KEY=sk-ant-your-key-here

# Restart app
heroku restart
```

### App Sleeping (Free Dyno)

```bash
# Upgrade to paid dyno
heroku dyno:type standard-1x

# Or use UptimeRobot to keep it awake
```

---

## 💰 Costs

### Heroku:
- **Free Dyno:** $0/month (sleeps after 30 min)
- **Standard Dyno:** $7/month (always running)
- **Performance Dyno:** $25+/month (faster)

### Claude API:
- **Pay as you go** - only pay for what you use
- **Haiku:** ~$0.80 per 1M input tokens
- **Sonnet:** ~$3 per 1M input tokens
- **Opus:** ~$15 per 1M input tokens

**Typical Usage:** $5-20/month for moderate use

---

## 🎯 Complete Deployment Checklist

- [ ] Heroku account created
- [ ] Claude API key obtained
- [ ] Heroku CLI installed
- [ ] Logged in to Heroku (`heroku login`)
- [ ] App created (`heroku create your-app-name`)
- [ ] Environment variables set
- [ ] Procfile created
- [ ] runtime.txt created
- [ ] Files committed to git
- [ ] Deployed (`git push heroku main`)
- [ ] App is running (`heroku open`)
- [ ] Claude configured in Settings
- [ ] Dyno upgraded to paid (for permanent running)

---

## 🚀 Quick Deployment Script

```bash
#!/bin/bash

# Set your values
APP_NAME="resume-matcher-claude"
CLAUDE_API_KEY="sk-ant-your-key-here"

# Login
heroku login

# Create app
heroku create $APP_NAME

# Set environment variables
heroku config:set LLM_PROVIDER=claude
heroku config:set LLM_MODEL=claude-3-5-sonnet-20241022
heroku config:set LLM_API_KEY=$CLAUDE_API_KEY
heroku config:set HOST=0.0.0.0
heroku config:set PORT=8000

# Create Procfile
echo "web: cd apps/backend && python -m uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Create runtime.txt
echo "python-3.13.12" > runtime.txt

# Commit and deploy
git add Procfile runtime.txt
git commit -m "Add Heroku deployment files"
git push heroku main

# Open app
heroku open

echo "✅ Deployment complete!"
echo "App URL: https://$APP_NAME.herokuapp.com"
```

---

## 📞 Useful Commands

| Command | Purpose |
|---------|---------|
| `heroku create app-name` | Create new app |
| `heroku config:set KEY=VALUE` | Set environment variable |
| `heroku config` | View all variables |
| `heroku logs --tail` | Watch logs |
| `heroku restart` | Restart app |
| `heroku open` | Open app in browser |
| `git push heroku main` | Deploy |
| `heroku ps` | View dyno status |
| `heroku dyno:type standard-1x` | Upgrade dyno |

---

## 🎉 You're Done!

Your Resume Matcher is now:
- ✅ Deployed to Heroku
- ✅ Using Claude API
- ✅ Running permanently (if upgraded to paid dyno)
- ✅ Accessible from anywhere

**Access your app:** https://your-app-name.herokuapp.com

---

## 📚 Next Steps

1. **Upgrade to paid dyno** for permanent running
2. **Configure Claude** in Settings
3. **Upload your resume**
4. **Start tailoring resumes**
5. **Share the link** with others

---

**Happy resume building!** 🚀

