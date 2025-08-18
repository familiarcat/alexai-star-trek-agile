#!/bin/bash
# 🎯 **MASTER ORCHESTRATOR**
# Unified entry point for all operations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Import core modules
source "$SCRIPT_DIR/deployment/unified-deployment.sh"
source "$SCRIPT_DIR/testing/unified-testing.sh"
source "$SCRIPT_DIR/setup/unified-setup.sh"
source "$SCRIPT_DIR/utility/unified-utilities.sh"
source "$SCRIPT_DIR/cleanup/unified-cleanup.sh"

# Main orchestrator
main() {
    case "${1:-help}" in
        "deploy") shift; deploy_local "$@" ;;
        "test") shift; run_unit_tests "$@" ;;
        "setup") shift; setup_environment "$@" ;;
        "utility") shift; safe_echo "$@" ;;
        "cleanup") shift; cleanup_backups "$@" ;;
        "help") 
            echo "🚀 Master Orchestrator Usage:"
            echo "  $0 deploy [local|production|testing]"
            echo "  $0 test [unit|integration|system|all]"
            echo "  $0 setup [env|deps|workflows|all]"
            echo "  $0 utility [echo|validate|monitor]"
            echo "  $0 cleanup [backups|scripts|temp|all]"
            ;;
        *) echo "Usage: $0 [deploy|test|setup|utility|cleanup|help]" ;;
    esac
}

main "$@"
