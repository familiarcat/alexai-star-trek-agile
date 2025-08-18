#!/bin/bash
echo "⚙️ Setting up CursorAI environment..."
mkdir -p ~/.cursorai
cp workspace_embeddings.json ~/.cursorai/
cp alexai_cursor_bootstrapper.json ~/.cursorai/config.json
echo "✅ CursorAI initialized with AlexAI memory and agents."
