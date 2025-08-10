#!/bin/bash

echo "Test script working"
echo "Current directory: $(pwd)"
echo "Script directory: $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Project root: $(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
