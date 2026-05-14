# How to Upload to GitHub

Your complete B2B Sales Intelligence Agent is ready to upload to GitHub.

## Step 1: Download the bd-agent Folder

The complete folder structure is ready in `/mnt/user-data/outputs/bd-agent/`

It contains all 14 files you need:
```
bd-agent/
├── .env.local
├── .gitignore
├── README.md
├── package.json
├── netlify.toml
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── pages/
│   │   └── index.jsx
│   ├── components/
│   │   └── SalesIntelligenceUI.jsx
│   └── styles/
│       └── globals.css
└── netlify/
    └── functions/
        ├── research.js
        ├── synthesis.js
        └── generateEmail.js
```

## Step 2: Update Your API Key

Before uploading, edit `.env.local`:

Replace:
```
ANTHROPIC_API_KEY=sk-ant-v7_your_api_key_here
```

With your actual key from:
https://console.anthropic.com/api_keys

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `SalesIntel`
3. Description: `B2B Sales Intelligence Agent - AI-powered research and email generation`
4. Choose: Public (so Netlify can see it)
5. **Don't add** README, .gitignore, or license (already included)
6. Click **Create repository**

## Step 4: Initialize Git Locally

On your computer, open terminal/command prompt:

```bash
# Navigate to the bd-agent folder
cd /path/to/bd-agent

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: B2B Sales Intelligence Agent"

# Add remote (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/SalesIntel.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 5: Verify on GitHub

Go to https://github.com/YOUR_USERNAME/SalesIntel

You should see:
- ✅ All folders and files listed
- ✅ README.md displayed
- ✅ `.env.local` is included (don't worry, `.gitignore` prevents it from being tracked)
- ✅ Green "main" branch label

## Step 6: Deploy to Netlify

### Option A: Manual Deploy

1. Go to https://app.netlify.com/drop
2. Drag and drop the `bd-agent` folder
3. Wait for deployment (2-3 minutes)

### Option B: Connect GitHub (Recommended)

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **"GitHub"** and authorize
4. Find and select `SalesIntel` repository
5. Click **Deploy site**
6. Netlify auto-detects Next.js and configures everything

### Step 7: Add API Key to Netlify

1. Your site is building (2-3 minutes)
2. Once deployed, go to **Site Settings**
3. **Build & Deploy** → **Environment**
4. Click **Edit variables**
5. Add new variable:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-v7_your_actual_key`
6. Click **Save**
7. Go to **Deploys**
8. Click **Trigger deploy** (redeploy with the API key)

### Step 8: Test Your Site

1. Wait 2-3 minutes for redeploy
2. Click the Netlify URL (shown in Deploys)
3. You should see:
   - ✅ Dark background with SalesIntel logo
   - ✅ "Company to research" input field
   - ✅ Research button
   - ✅ Three info cards

4. Test it:
   - Enter a company name (try "Google" or "Stripe")
   - Click "Research"
   - Wait 2-3 minutes
   - See executives appear
   - Click one to select
   - Enter your name and service
   - Generate email
   - Copy or send email

## That's It! 🎉

Your B2B Sales Intelligence Agent is now live on the internet!

### Key Points

- ✅ Your `.env.local` is in `.gitignore` (won't be pushed to GitHub)
- ✅ Netlify environment variable is used for production
- ✅ All code is clean and production-ready
- ✅ Beautiful dark UI included
- ✅ 6 research agents running in parallel
- ✅ Executive email extraction included
- ✅ AI-powered email generation included

### Git Commands Reference

```bash
# Check status
git status

# See all commits
git log

# Make changes and commit
git add .
git commit -m "Your message"
git push

# Pull latest changes
git pull
```

### Troubleshooting

**Git command not found**
- Install Git from https://git-scm.com

**Permission denied (publickey)**
- Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**Build fails on Netlify**
- Check build log in Netlify dashboard
- Verify all files are committed and pushed
- Check `.env.local` is NOT in your GitHub repo (but IS in netlify environment)

**Site shows 404**
- Check Netlify build log
- Verify ANTHROPIC_API_KEY is set in Netlify
- Clear Netlify cache and redeploy

**Research takes too long**
- This is normal! 6 agents run in parallel (2-3 minutes)
- Large companies have more data to process
- Each research call uses web search

---

**Your project is ready. Just follow these 8 steps and you're live!** 🚀
