# AlexAI CursorAI Transfer v7

This package bootstraps AlexAI's memory and agents into CursorAI.

## Installation

1. Upload and unzip this package in CursorAI or your dev environment.
2. Ensure `~/Documents/workspace` exists with project files.
3. Set up your `.env` file with secrets.
4. Run:
   ```bash
   chmod +x bootstrap.sh
   ./bootstrap.sh
   ```
5. CursorAI will initialize with AlexAI's full history and agents.

## Features

- Workspace scraper with OpenAI embeddings
- Multi-agent setup (Picard, Troi, Spock, Data, Scott)
- Automated bootstrap and CI/CD GitHub Actions
- Secrets and environment variable support
