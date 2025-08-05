# 🚀 Vercel Deployment Guide

## Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/alexai-star-trek-agile.git
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Python Flask app
   - Add environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `SUPABASE_URL`: Your Supabase URL (optional)
     - `SUPABASE_KEY`: Your Supabase key (optional)
   - Click "Deploy"

## Method 2: Vercel CLI (Alternative)

If the CLI works for you:
```bash
vercel --prod
```

## Environment Variables Required

- `OPENAI_API_KEY`: Required for AI agent functionality
- `SUPABASE_URL`: Optional, for database integration
- `SUPABASE_KEY`: Optional, for database integration

## Features Deployed

✅ Star Trek TNG-themed UI with LCARS design
✅ Multi-agent AI system (Picard, Troi, Spock, Data, Scott)
✅ Observation Lounge with Lottie animations
✅ Mission Log (Projects) with comprehensive workflow
✅ Real-time updates via Socket.IO
✅ Responsive design for all devices
✅ Comprehensive mock data system

## URLs After Deployment

- **Main Dashboard**: `https://your-project.vercel.app`
- **Observation Lounge**: `https://your-project.vercel.app/observation-lounge`
- **Mission Log**: `https://your-project.vercel.app/projects`
- **Individual Crew Pages**: `https://your-project.vercel.app/agent/[name]`

## Local Development

```bash
./start_local.sh
```

Access at: http://localhost:8000
