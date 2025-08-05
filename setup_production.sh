#!/bin/bash

echo "🚀 Setting up AlexAI Star Trek Agile Project Manager for Production"
echo "=================================================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your actual values:"
    echo "   - OPENAI_API_KEY"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_KEY"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. 🗄️  Set up Supabase:"
echo "   - Go to https://supabase.com"
echo "   - Create new project: alexai-star-trek-agile"
echo "   - Copy Project URL and anon key"
echo "   - Run the SQL from VERCEL_SUPABASE_DEPLOYMENT.md"
echo ""
echo "2. 🌐 Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import repository: familiarcat/alexai-star-trek-agile"
echo "   - Add environment variables"
echo "   - Deploy!"
echo ""
echo "3. 🔧 Local Development:"
echo "   - Edit .env with your Supabase credentials"
echo "   - Run: ./start_local.sh"
echo "   - Access at: http://localhost:8000"
echo ""
echo "📖 See VERCEL_SUPABASE_DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎉 Your Star Trek TNG Agile Project Manager is ready for production! 🖖" 