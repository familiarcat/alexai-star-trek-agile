#!/bin/bash
echo "🚀 Starting AlexAI → CursorAI bootstrap..."

chmod +x install.sh
./install.sh

source .venv/bin/activate

echo "🧠 Scraping ~/Documents/workspace..."
python workspace_scraper.py

echo "⚙️ Running CursorAI setup..."
bash cursorai_setup.sh

echo "✅ Bootstrap complete! AlexAI is now operational inside CursorAI."
