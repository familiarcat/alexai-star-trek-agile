#!/bin/bash
echo "🔍 Verifying deployment..."
echo "  Checking if application is running..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "  ✅ Application is responding"
else
    echo "  ❌ Application is not responding"
fi

echo "  Checking AI agents..."
if curl -s http://localhost:3000/api/crew/captain-picard > /dev/null; then
    echo "  ✅ AI agents are operational"
else
    echo "  ❌ AI agents are not responding"
fi

echo "  Checking Ship Computer..."
if curl -s http://localhost:3000/ship-computer-demo > /dev/null; then
    echo "  ✅ Ship Computer is operational"
else
    echo "  ❌ Ship Computer is not responding"
fi

echo "🎉 Deployment verification complete!"
