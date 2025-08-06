#!/bin/bash

echo "🚀 Deploying AlexAI Star Trek Agile Project Manager to Railway"
echo "=================================================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Create railway.toml configuration
echo "⚙️  Creating Railway configuration..."
cat > railway.toml << EOF
[build]
builder = "nixpacks"

[deploy]
startCommand = "python app.py"
healthcheckPath = "/"
healthcheckTimeout = 300
restartPolicyType = "on_failure"

[[services]]
name = "alexai-star-trek-agile"
EOF

# Create Procfile for Railway
echo "📝 Creating Procfile..."
cat > Procfile << EOF
web: python app.py
EOF

# Update requirements.txt to ensure all dependencies are included
echo "📦 Updating requirements.txt..."
cat > requirements.txt << EOF
flask==2.3.3
flask-socketio==5.3.6
python-socketio==5.8.0
python-engineio==4.7.1
eventlet==0.33.3
gunicorn==21.2.0
openai==1.3.5
requests==2.31.0
python-dotenv==1.0.0
EOF

echo "✅ Railway deployment configuration created!"
echo ""
echo "🌐 Next Steps:"
echo "1. Install Railway CLI: npm install -g @railway/cli"
echo "2. Login to Railway: railway login"
echo "3. Deploy: railway up"
echo ""
echo "📖 Alternative: Use Railway Dashboard"
echo "1. Go to https://railway.app"
echo "2. Connect your GitHub repository"
echo "3. Railway will auto-detect Python Flask"
echo "4. Add environment variables:"
echo "   - OPENAI_API_KEY: Your OpenAI API key"
echo ""
echo "🚀 Your Star Trek-themed Agile Project Manager is ready for Railway deployment!" 