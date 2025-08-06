#!/usr/bin/env python3
import os
import openai

print("Testing OpenAI API...")
print(f"OpenAI version: {openai.__version__}")

# Check environment variables
api_key = os.getenv('OPENAI_API_KEY')
print(f"API key present: {bool(api_key)}")

try:
    # Test basic client creation with explicit proxy settings
    client = openai.OpenAI(
        api_key=api_key,
        http_client=None  # Try to disable any default HTTP client
    )
    print("✅ OpenAI client created successfully")
    
    # Test a simple embedding
    response = client.embeddings.create(
        input="Hello, world!",
        model="text-embedding-3-small"
    )
    print("✅ Embedding created successfully")
    print(f"Embedding length: {len(response.data[0].embedding)}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e)}")
    
    # Try alternative approach
    try:
        print("\nTrying alternative approach...")
        import httpx
        
        # Create a custom HTTP client without proxies
        http_client = httpx.Client(
            proxies=None,
            timeout=30.0
        )
        
        client = openai.OpenAI(
            api_key=api_key,
            http_client=http_client
        )
        print("✅ OpenAI client created with custom HTTP client")
        
        response = client.embeddings.create(
            input="Hello, world!",
            model="text-embedding-3-small"
        )
        print("✅ Embedding created successfully")
        print(f"Embedding length: {len(response.data[0].embedding)}")
        
    except Exception as e2:
        print(f"❌ Alternative approach also failed: {e2}")
 