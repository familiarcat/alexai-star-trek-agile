#!/bin/bash

echo "🚀 Preparing AlexAI Star Trek Agile Project Manager for Vercel Deployment"
echo "=================================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Star Trek-themed Agile Project Manager"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# Database
*.db
*.sqlite
*.sqlite3

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Temporary files
*.tmp
*.temp
EOF
fi

# Ensure vercel.json is properly configured
echo "⚙️  Configuring vercel.json..."
cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app.py"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai_api_key",
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_KEY": "@supabase_key",
    "VERCEL_TOKEN": "@vercel_token"
  },
  "functions": {
    "app.py": {
      "runtime": "python3.11"
    }
  }
}
EOF

# Create a simple deployment guide
echo "📋 Creating deployment guide..."
cat > DEPLOYMENT_GUIDE.md << EOF
# 🚀 Vercel Deployment Guide

## Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   \`\`\`bash
   git remote add origin https://github.com/YOUR_USERNAME/alexai-star-trek-agile.git
   git push -u origin main
   \`\`\`

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Python Flask app
   - Add environment variables:
     - \`OPENAI_API_KEY\`: Your OpenAI API key
     - \`SUPABASE_URL\`: Your Supabase URL (optional)
     - \`SUPABASE_KEY\`: Your Supabase key (optional)
   - Click "Deploy"

## Method 2: Vercel CLI (Alternative)

If the CLI works for you:
\`\`\`bash
vercel --prod
\`\`\`

## Environment Variables Required

- \`OPENAI_API_KEY\`: Required for AI agent functionality
- \`SUPABASE_URL\`: Optional, for database integration
- \`SUPABASE_KEY\`: Optional, for database integration

## Features Deployed

✅ Star Trek TNG-themed UI with LCARS design
✅ Multi-agent AI system (Picard, Troi, Spock, Data, Scott)
✅ Observation Lounge with Lottie animations
✅ Mission Log (Projects) with comprehensive workflow
✅ Real-time updates via Socket.IO
✅ Responsive design for all devices
✅ Comprehensive mock data system

## URLs After Deployment

- **Main Dashboard**: \`https://your-project.vercel.app\`
- **Observation Lounge**: \`https://your-project.vercel.app/observation-lounge\`
- **Mission Log**: \`https://your-project.vercel.app/projects\`
- **Individual Crew Pages**: \`https://your-project.vercel.app/agent/[name]\`

## Local Development

\`\`\`bash
./start_local.sh
\`\`\`

Access at: http://localhost:8000
EOF

echo "✅ Project prepared for deployment!"
echo ""
echo "🌐 Next Steps:"
echo "1. Push this project to GitHub"
echo "2. Go to vercel.com and import your repository"
echo "3. Add your environment variables"
echo "4. Deploy!"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🚀 Your Star Trek-themed Agile Project Manager is ready for deployment!" 