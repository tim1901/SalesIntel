# Deployment Checklist

## ✅ Pre-Upload Checklist

- [ ] Read GITHUB_UPLOAD_GUIDE.md in the bd-agent folder
- [ ] Get your API key from https://console.anthropic.com/api_keys
- [ ] Edit `.env.local` and add your actual API key
- [ ] Have GitHub account ready
- [ ] Have Netlify account ready (or create at https://app.netlify.com)

## ✅ Files Included

All 14 files are included and ready to upload:

**Root Folder (bd-agent/):**
- [ ] package.json (dependencies list)
- [ ] netlify.toml (Netlify configuration)
- [ ] next.config.js (Next.js config)
- [ ] tailwind.config.js (Tailwind config)
- [ ] postcss.config.js (PostCSS config)
- [ ] .gitignore (ignore rules)
- [ ] .env.local (API key template)
- [ ] README.md (project documentation)
- [ ] GITHUB_UPLOAD_GUIDE.md (upload instructions)

**src/pages/**
- [ ] index.jsx (home page)

**src/components/**
- [ ] SalesIntelligenceUI.jsx (main UI component)

**src/styles/**
- [ ] globals.css (Tailwind styles)

**netlify/functions/**
- [ ] research.js (research orchestration)
- [ ] synthesis.js (intelligence synthesis)
- [ ] generateEmail.js (email generation)

## ✅ 8-Step Upload Process

### Step 1: Update API Key ⏱️ 2 minutes
- [ ] Edit `.env.local`
- [ ] Add your actual API key

### Step 2: Create GitHub Repo ⏱️ 2 minutes
- [ ] Go to https://github.com/new
- [ ] Name it "SalesIntel"
- [ ] Make it Public
- [ ] Create repo

### Step 3: Initialize Git Locally ⏱️ 5 minutes
- [ ] Open terminal in bd-agent folder
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit: B2B Sales Intelligence Agent"`
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/SalesIntel.git`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`

### Step 4: Verify on GitHub ⏱️ 1 minute
- [ ] Go to your GitHub repo
- [ ] Verify all files are there
- [ ] Verify README is displayed

### Step 5: Deploy to Netlify ⏱️ 3 minutes
- [ ] Go to https://app.netlify.com
- [ ] Click "Add new site"
- [ ] Select "Import an existing project"
- [ ] Connect GitHub
- [ ] Select SalesIntel repo
- [ ] Click Deploy

### Step 6: Add API Key to Netlify ⏱️ 2 minutes
- [ ] Wait for initial build (2-3 minutes)
- [ ] Go to Site Settings
- [ ] Build & Deploy → Environment
- [ ] Add ANTHROPIC_API_KEY variable
- [ ] Paste your API key

### Step 7: Trigger Redeploy ⏱️ 3 minutes
- [ ] Go to Deploys
- [ ] Click "Trigger deploy"
- [ ] Wait for build to complete (2-3 minutes)

### Step 8: Test Your Site ⏱️ 5 minutes
- [ ] Click Netlify URL
- [ ] Enter a company name
- [ ] Click Research
- [ ] Wait 2-3 minutes
- [ ] Select an executive
- [ ] Generate email
- [ ] Done! ✨

**Total Time: ~30 minutes**

## ✅ What You Should See

### After GitHub Upload
```
Your Repository
├── README.md
├── package.json
├── netlify.toml
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

### After Netlify Deploy
```
Netlify Build Log:
✓ Detected Next.js
✓ Running npm run build
✓ Build completed
✓ Deploy live
```

### Live Site Should Show
```
- Dark background
- SalesIntel logo
- Company input field
- Research button
- 3 info cards
```

## ✅ Troubleshooting

| Problem | Solution |
|---------|----------|
| Git not found | Install from https://git-scm.com |
| Permission denied | Set up SSH keys on GitHub |
| Build fails | Check Netlify logs, verify files committed |
| Site shows 404 | Check API key is set in Netlify |
| No executives found | Wait longer (2-3 minutes), try different company |
| API errors | Verify API key is valid and has credits |

## ✅ After Deployment

Once live, you can:
- [ ] Customize branding (colors, name, description)
- [ ] Adjust research prompts
- [ ] Add email follow-up sequences
- [ ] Integrate with CRM
- [ ] Build admin dashboard
- [ ] Add analytics

## ✅ Important Notes

1. **API Key Security**: 
   - Never commit `.env.local` to GitHub (it's in .gitignore)
   - Always set API key in Netlify dashboard for production
   - Your key is only stored in Netlify's secure environment

2. **File Structure**: 
   - Must have `src/pages/index.jsx` (Next.js requirement)
   - Must have `netlify/functions/` folder
   - All imports use `@anthropic-ai/sdk` (not `@anthropic-sdk/sdk`)

3. **Performance**:
   - Research takes 2-3 minutes (6 agents in parallel)
   - Synthesis is quick
   - Email generation is instant
   - Total process is ~3-5 minutes per company

4. **Costs**:
   - ~$0.50-1.00 per company research
   - ~$0.05-0.10 per email
   - Total: ~$0.60-1.20 per company

## ✅ You're All Set!

Everything you need is in the `bd-agent` folder.

Just follow the 8 steps in GITHUB_UPLOAD_GUIDE.md and you'll be live in 30 minutes! 🚀

---

**Questions?** Check GITHUB_UPLOAD_GUIDE.md for detailed step-by-step instructions.
