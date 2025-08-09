#!/bin/zsh
# Continuous Bilateral Learning Monitor

while true; do
    # Watch for new .md files
    find . -name "*.md" -newer alexai-knowledge-base/BILATERAL_LEARNING_LOG.md -not -path "./node_modules/*" | while read -r file; do
        echo "New markdown file detected: $file"
        ./scripts/knowledge/bilateral-learning-system.sh process "$file" "markdown"
    done
    
    # Watch for new .sh files
    find . -name "*.sh" -newer alexai-knowledge-base/BILATERAL_LEARNING_LOG.md -not -path "./node_modules/*" | while read -r file; do
        echo "New shell script detected: $file"
        ./scripts/knowledge/bilateral-learning-system.sh process "$file" "shell"
    done
    
    # Wait before next check
    sleep 30
done
