#!/bin/bash

# AlexAI Agent Testing Runner
# Simple script to run all agent tests from project root

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 AlexAI Agent Testing Suite${NC}"
echo -e "${CYAN}============================${NC}"
echo ""

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Function to show usage
show_usage() {
    echo -e "${BLUE}Usage:${NC}"
    echo -e "  ${GREEN}./test-agents.sh${NC}          # Run comprehensive test suite"
    echo -e "  ${GREEN}./test-agents.sh quick${NC}    # Run quick connectivity tests"
    echo -e "  ${GREEN}./test-agents.sh mock${NC}     # Generate mock data only"
    echo -e "  ${GREEN}./test-agents.sh help${NC}     # Show this help message"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo -e "  ${GREEN}./test-agents.sh quick${NC}    # Quick system check"
    echo -e "  ${GREEN}./test-agents.sh${NC}          # Full validation"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if test scripts exist
    if [[ ! -f "scripts/test/run-comprehensive-agent-test.sh" ]]; then
        echo -e "${RED}❌ Comprehensive test script not found${NC}"
        echo -e "${BLUE}   Please ensure the testing framework is properly installed${NC}"
        exit 1
    fi
    
    if [[ ! -f "scripts/test/quick-test.sh" ]]; then
        echo -e "${RED}❌ Quick test script not found${NC}"
        echo -e "${BLUE}   Please ensure the testing framework is properly installed${NC}"
        exit 1
    fi
    
    if [[ ! -f "scripts/test/generate-mock-data.sh" ]]; then
        echo -e "${RED}❌ Mock data generator not found${NC}"
        echo -e "${BLUE}   Please ensure the testing framework is properly installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    echo ""
}

# Function to run quick tests
run_quick_tests() {
    echo -e "${CYAN}⚡ Running Quick Tests...${NC}"
    echo ""
    
    if ./scripts/test/quick-test.sh; then
        echo -e "${GREEN}🎉 Quick tests completed successfully!${NC}"
        return 0
    else
        echo -e "${RED}❌ Quick tests failed!${NC}"
        return 1
    fi
}

# Function to generate mock data
generate_mock_data() {
    echo -e "${CYAN}🎭 Generating Mock Data...${NC}"
    echo ""
    
    if ./scripts/test/generate-mock-data.sh; then
        echo -e "${GREEN}🎉 Mock data generated successfully!${NC}"
        return 0
    else
        echo -e "${RED}❌ Mock data generation failed!${NC}"
        return 1
    fi
}

# Function to run comprehensive tests
run_comprehensive_tests() {
    echo -e "${CYAN}🧪 Running Comprehensive Test Suite...${NC}"
    echo ""
    
    if ./scripts/test/run-comprehensive-agent-test.sh; then
        echo -e "${GREEN}🎉 Comprehensive tests completed successfully!${NC}"
        return 0
    else
        echo -e "${RED}❌ Comprehensive tests failed!${NC}"
        return 1
    fi
}

# Main execution
main() {
    case "${1:-comprehensive}" in
        "quick"|"q")
            check_prerequisites
            run_quick_tests
            ;;
        "mock"|"m")
            check_prerequisites
            generate_mock_data
            ;;
        "comprehensive"|"full"|"")
            check_prerequisites
            run_comprehensive_tests
            ;;
        "help"|"h"|"-h"|"--help")
            show_usage
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"
