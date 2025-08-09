#!/bin/bash

# 🧪 Quick N8N Activation Test
# Test specific webhook after manual activation

set -e

echo "🧪 QUICK N8N ACTIVATION TEST"
echo "============================"
echo ""

# Test main webhook
echo "🔗 Testing main crew coordination webhook..."
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"query":"activation test","timestamp":"'"$(date -Iseconds)"'"}' \
    https://n8n.pbradygeorgen.com/webhook/crew-request 2>/dev/null || echo "ERROR")

if echo "$response" | grep -q "ERROR"; then
    echo "❌ Webhook connection failed"
elif echo "$response" | grep -q -E "(response|crew|coordination)"; then
    echo "✅ Webhook ACTIVE - AI agents responding!"
    echo "🤖 Response preview: $(echo "$response" | head -c 100)..."
else
    echo "⚠️ Webhook responding but may need configuration"
    echo "📋 Response: $response"
fi

echo ""
echo "🎯 If successful, run the full test:"
echo "   ./test-n8n-ai-agents-evolution.sh"
