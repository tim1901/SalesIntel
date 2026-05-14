# B2B Sales Intelligence Agent

AI-powered research and email generation tool that researches companies, finds executives, and generates personalized cold emails.

## Features

- 🔍 **6 Parallel Research Agents**: Company intel, job postings, industry trends, social signals, executive research, contact extraction
- 👥 **Executive Finder**: Extracts emails and LinkedIn profiles of key decision-makers
- 📊 **Smart Synthesis**: Analyzes research to identify pain points, opportunities, and timing signals
- ✉️ **AI Email Generation**: Creates personalized cold emails based on research findings
- 🎯 **Executive Ranking**: Ranks prospects by relevance and outreach readiness
- 🌙 **Beautiful Dark UI**: Modern glassmorphic design with smooth animations

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons
- **Backend**: Netlify Functions (Node.js)
- **AI**: Anthropic Claude API
- **Deployment**: Netlify

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Anthropic API Key (from https://console.anthropic.com/api_keys)

### Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your API key
echo "ANTHROPIC_API_KEY=sk-ant-v7_your_key_here" > .env.local

# Run development server
npm run dev

# Visit http://localhost:3000
```

### Deploy to Netlify

1. Push this repository to GitHub
2. Connect repo to Netlify
3. Add `ANTHROPIC_API_KEY` environment variable in Netlify dashboard
4. Deploy!

Netlify auto-detects Next.js and configures the build automatically.

## How It Works

1. **Enter Company Name** → 6 research agents gather intelligence in parallel
2. **Review Executives** → Find and rank decision-makers with verified contact info
3. **Select Target** → Choose the best person to pitch
4. **Describe Service** → Tell us what you offer
5. **Generate Email** → AI creates personalized cold email
6. **Copy or Send** → Ready to reach out!

## Project Structure

```
bd-agent/
├── src/
│   ├── pages/
│   │   └── index.jsx              # Home page
│   ├── components/
│   │   └── SalesIntelligenceUI.jsx # Main UI component
│   └── styles/
│       └── globals.css            # Tailwind styles
├── netlify/
│   └── functions/
│       ├── research.js            # Research orchestration
│       ├── synthesis.js           # Intelligence synthesis
│       └── generateEmail.js       # Email generation
├── package.json
├── netlify.toml
└── tailwind.config.js
```

## Cost

- Research & synthesis: ~$0.50-1.00 per company
- Email generation: ~$0.05-0.10 per email
- **Total: ~$0.60-1.20 per company researched**

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-v7_your_actual_key
```

This is added to `.env.local` for local development and as an environment variable in the Netlify dashboard for production.

## API Endpoints

All endpoints are Netlify Functions accessible via `/api/`:

- `POST /api/research` - Run research agents
- `POST /api/synthesis` - Synthesize findings
- `POST /api/generateEmail` - Generate personalized email

## Customization

### Change Branding

Edit `src/components/SalesIntelligenceUI.jsx`:
- Update the "SalesIntel" title
- Change gradient colors
- Modify description text

### Adjust Research Focus

Edit `netlify/functions/research.js`:
- Modify research prompts
- Change executive roles to search for
- Add/remove search criteria

### Personalize Email Generation

Edit `netlify/functions/generateEmail.js`:
- Add custom personalization rules
- Change email tone and length
- Modify call-to-action

## Troubleshooting

**Build fails with "pages directory not found"**
- Ensure `src/pages/index.jsx` exists
- Check all files are committed to GitHub
- Verify folder structure is correct

**API key errors**
- Check `.env.local` has your key (local dev)
- Check Netlify dashboard has API key set (production)
- Verify key is valid from console.anthropic.com

**No executives found**
- Try a different company name
- Check research results for any errors
- Verify API has sufficient credits

## Next Steps

After deployment works:
- Customize branding and colors
- Adjust research prompts for your use case
- Add Airtable integration for data logging
- Build email follow-up sequences
- Implement A/B testing for email variants
- Add CRM integration (HubSpot, Pipedrive)

## License

MIT

## Support

For issues or questions, check:
1. Netlify build logs
2. Browser console errors
3. API key validity
4. Network connectivity

---

Built with Claude AI and Netlify 🚀
