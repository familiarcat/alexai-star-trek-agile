import os
import json
import openai
from pathlib import Path

def should_skip(path):
    skip_patterns = ['.git', 'node_modules', '.venv', '__pycache__', '.next', 'dist', 'build']
    return any(p in path for p in skip_patterns)

def scan_workspace(workspace_dir):
    file_data = {}
    for root, dirs, files in os.walk(workspace_dir):
        if should_skip(root):
            continue
        for file in files:
            path = os.path.join(root, file)
            if should_skip(path) or os.path.getsize(path) > 200000:
                continue
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    file_data[path] = f.read()
            except:
                continue
    return file_data

def create_embeddings(data, output_file='workspace_embeddings.json'):
    try:
        # Handle macOS-specific proxy issues
        import platform
        is_macos = platform.system() == 'Darwin'
        
        if is_macos:
            # On macOS, try to avoid proxy issues by using minimal configuration
            try:
                # First try the standard approach
                client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            except TypeError as e:
                if 'proxies' in str(e):
                    print("⚠️ Detected macOS proxy issue, using fallback approach...")
                    # Create a minimal client without any proxy configuration
                    import httpx
                    http_client = httpx.Client(timeout=30.0)
                    client = openai.OpenAI(
                        api_key=os.getenv('OPENAI_API_KEY'),
                        http_client=http_client
                    )
                else:
                    raise e
        else:
            # On other platforms (like Vercel), use standard approach
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        embeddings = {}
        
        # Limit the number of files to process to avoid rate limits
        processed_count = 0
        max_files = 50  # Reduced limit for faster processing
        
        for path, content in data.items():
            if processed_count >= max_files:
                print(f"⚠️ Reached limit of {max_files} files, stopping processing")
                break
                
            try:
                # Use the new API format
                response = client.embeddings.create(
                    input=content[:2000], 
                    model='text-embedding-3-small'
                )
                embeddings[path] = response.data[0].embedding
                print(f"✅ Embedded: {path}")
                processed_count += 1
            except Exception as e:
                print(f"❌ Error embedding {path}: {e}")
                continue
        
        with open(output_file, 'w') as f:
            json.dump(embeddings, f)
        print(f"✅ Embeddings saved to {output_file} ({processed_count} files processed)")
        return True
        
    except Exception as e:
        print(f"❌ Critical error in create_embeddings: {e}")
        # Create a minimal embeddings file to prevent crashes
        # This ensures the application can still run even if embeddings fail
        with open(output_file, 'w') as f:
            json.dump({
                "error": "Failed to create embeddings", 
                "message": str(e),
                "platform": platform.system() if 'platform' in locals() else "unknown",
                "sample_data": {
                    "test_file.py": [0.1] * 1536,  # Mock embedding for testing
                    "sample_project.json": [0.2] * 1536
                }
            }, f)
        return False

if __name__ == "__main__":
    workspace = str(Path.home() / "Documents" / "workspace")
    print(f"🔍 Scanning workspace: {workspace}")
    data = scan_workspace(workspace)
    print(f"📁 Found {len(data)} files to process")
    success = create_embeddings(data)
    if success:
        print("✅ Workspace scanning completed successfully!")
    else:
        print("⚠️ Workspace scanning completed with errors - but application will still work!")
