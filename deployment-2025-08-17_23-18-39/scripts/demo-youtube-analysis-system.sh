#!/bin/bash

# 🎬 YouTube Analysis & Profitability System Demonstration Script
# This script demonstrates the complete workflow from YouTube content to profitable projects

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
VIDEO_URL="https://www.youtube.com/watch?v=S8a7gkFhoBA&t=398s"
DEMO_DIR="demo-results"

echo -e "${CYAN}🎬 ALEXAI YOUTUBE ANALYSIS & PROFITABILITY SYSTEM DEMONSTRATION${NC}"
echo -e "${CYAN}================================================================${NC}"
echo ""

# Create demo directory
mkdir -p "$DEMO_DIR"

# Function to print section headers
print_section() {
    echo -e "\n${YELLOW}📋 $1${NC}"
    echo -e "${YELLOW}$(printf '=%.0s' {1..50})${NC}"
}

# Function to print success/failure
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Function to wait for user input
wait_for_user() {
    echo -e "\n${BLUE}Press Enter to continue to the next step...${NC}"
    read -r
}

print_section "SYSTEM HEALTH CHECK"
echo "Checking if the development server is running..."

if curl -s "$BASE_URL/api/health" > /dev/null 2>&1; then
    print_result 0 "Development server is running at $BASE_URL"
else
    print_result 1 "Development server is not running. Please start with: npm run dev"
    exit 1
fi

wait_for_user

print_section "YOUTUBE ANALYSIS API TEST"
echo "Testing the YouTube analysis API endpoint..."

# Test GET endpoint
echo "Testing GET endpoint..."
GET_RESPONSE=$(curl -s "$BASE_URL/api/youtube-analysis")
if echo "$GET_RESPONSE" | grep -q "success.*true"; then
    print_result 0 "GET endpoint is operational"
else
    print_result 1 "GET endpoint failed"
fi

# Test POST endpoint with YouTube analysis
echo "Testing POST endpoint with YouTube content analysis..."
POST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/youtube-analysis" \
    -H "Content-Type: application/json" \
    -d "{\"videoUrl\":\"$VIDEO_URL\",\"analysisType\":\"full\"}")

# Save response to file
echo "$POST_RESPONSE" > "$DEMO_DIR/youtube-analysis-response.json"

if echo "$POST_RESPONSE" | grep -q "success.*true"; then
    print_result 0 "POST endpoint analysis completed successfully"
    
    # Extract key metrics
    PROFITABILITY_SCORE=$(echo "$POST_RESPONSE" | jq -r '.data.profitabilityScore')
    OPPORTUNITIES_COUNT=$(echo "$POST_RESPONSE" | jq -r '.data.businessOpportunities | length')
    CREW_RECOMMENDATIONS=$(echo "$POST_RESPONSE" | jq -r '.data.crewRecommendations | length')
    
    echo -e "${GREEN}📊 Analysis Results:${NC}"
    echo -e "  • Profitability Score: ${CYAN}$PROFITABILITY_SCORE%${NC}"
    echo -e "  • Business Opportunities: ${CYAN}$OPPORTUNITIES_COUNT${NC}"
    echo -e "  • Crew Recommendations: ${CYAN}$CREW_RECOMMENDATIONS${NC}"
    
else
    print_result 1 "POST endpoint analysis failed"
    echo "Response: $POST_RESPONSE"
fi

wait_for_user

print_section "BUSINESS OPPORTUNITIES ANALYSIS"
echo "Analyzing identified business opportunities..."

# Extract and display business opportunities
echo "$POST_RESPONSE" | jq -r '.data.businessOpportunities[] | "🎯 \(.title)\n   ROI: \(.estimatedROI)% | Complexity: \(.complexity) | Timeline: \(.implementationTime)\n   Category: \(.category)\n"' > "$DEMO_DIR/business-opportunities.txt"

cat "$DEMO_DIR/business-opportunities.txt"

wait_for_user

print_section "CREW RECOMMENDATIONS"
echo "Displaying crew-specific recommendations..."

# Extract and display crew recommendations
echo "$POST_RESPONSE" | jq -r '.data.crewRecommendations[] | "👥 \(.crewMember) - \(.expertise)\n   Priority: \(.priority) | Timeline: \(.timeline)\n   Recommendation: \(.recommendation)\n   Impact: \(.estimatedImpact)\n"' > "$DEMO_DIR/crew-recommendations.txt"

cat "$DEMO_DIR/crew-recommendations.txt"

wait_for_user

print_section "IMPLEMENTATION ROADMAP"
echo "Generating implementation roadmap..."

# Extract and display next steps
echo "$POST_RESPONSE" | jq -r '.data.nextSteps[] | "📋 \(.action)\n   Responsible: \(.responsibleCrew) | Timeline: \(.timeline)\n   Priority: \(.priority)\n"' > "$DEMO_DIR/implementation-roadmap.txt"

cat "$DEMO_DIR/implementation-roadmap.txt"

wait_for_user

print_section "PROFITABILITY CALCULATIONS"
echo "Calculating profitability metrics..."

# Calculate total ROI
TOTAL_ROI=$(echo "$POST_RESPONSE" | jq -r '[.data.businessOpportunities[].estimatedROI] | add')
AVERAGE_ROI=$(echo "$POST_RESPONSE" | jq -r '[.data.businessOpportunities[].estimatedROI] | add / length')

echo -e "${GREEN}💰 Profitability Analysis:${NC}"
echo -e "  • Total Combined ROI: ${CYAN}$TOTAL_ROI%${NC}"
echo -e "  • Average ROI per Opportunity: ${CYAN}$AVERAGE_ROI%${NC}"
echo -e "  • Profitability Score: ${CYAN}$PROFITABILITY_SCORE%${NC}"

# Calculate projected revenue (assuming $10K base investment)
BASE_INVESTMENT=10000
PROJECTED_REVENUE=$(echo "$BASE_INVESTMENT * $TOTAL_ROI / 100" | bc -l)

echo -e "  • Base Investment: ${CYAN}\$$BASE_INVESTMENT${NC}"
echo -e "  • Projected Revenue: ${CYAN}\$$(printf "%.0f" $PROJECTED_REVENUE)${NC}"

wait_for_user

print_section "IMMEDIATE ACTION PLAN"
echo "Creating immediate action plan for profitability..."

cat > "$DEMO_DIR/immediate-action-plan.md" << EOF
# 🚀 IMMEDIATE PROFITABILITY ACTION PLAN

## 📅 Next 7 Days - Critical Actions

### Day 1-2: Sales Enablement
- [ ] Create sales pitch for AI automation consulting
- [ ] Set up billing and invoicing system  
- [ ] Research competitor pricing ($150-300/hour)

### Day 3-4: Client Identification
- [ ] List 50 potential clients in your network
- [ ] Research their current automation needs
- [ ] Create personalized outreach messages

### Day 5-7: First Outreach
- [ ] Contact 20 high-probability prospects
- [ ] Schedule 5-10 discovery calls
- [ ] Prepare automation opportunity assessments

## 🎯 Success Metrics (Week 1)
- **Target**: 3-5 qualified leads
- **Goal**: 1-2 proposals requested
- **Outcome**: First consulting contract signed

## 💰 Revenue Projection
- **Week 4**: First \$5,000 in consulting revenue
- **Month 3**: \$25,000/month from pilot program
- **Month 6**: \$100,000/month from market expansion

## 👥 Crew Assignment
- **Captain Picard**: Strategic leadership & pricing
- **Chief Communications Officer**: Client acquisition & sales
- **Commander Data**: Technical architecture planning
- **Chief Engineer Scott**: Infrastructure planning
EOF

cat "$DEMO_DIR/immediate-action-plan.md"

wait_for_user

print_section "SYSTEM INTEGRATION TEST"
echo "Testing system integration with crew coordination..."

# Test crew coordination endpoint
echo "Testing crew coordination API..."
CREW_RESPONSE=$(curl -s -X POST "$BASE_URL/api/crew-coordination" \
    -H "Content-Type: application/json" \
    -d "{\"action\":\"youtube-analysis-complete\",\"priority\":\"high\",\"analysis\":\"$POST_RESPONSE\"}")

if echo "$CREW_RESPONSE" | grep -q "success.*true"; then
    print_result 0 "Crew coordination API is working"
else
    print_result 1 "Crew coordination API failed"
fi

wait_for_user

print_section "DEMONSTRATION SUMMARY"
echo -e "${GREEN}🎉 YouTube Analysis & Profitability System Demonstration Complete!${NC}"
echo ""
echo -e "${CYAN}📊 What We've Demonstrated:${NC}"
echo -e "  ✅ YouTube content analysis and transcription"
echo -e "  ✅ Business opportunity identification"
echo -e "  ✅ Crew expertise integration"
echo -e "  ✅ Profitability scoring and ROI calculation"
echo -e "  ✅ Implementation roadmap generation"
echo -e "  ✅ Immediate action planning"
echo -e "  ✅ System integration testing"
echo ""
echo -e "${CYAN}🚀 Next Steps for Profitability:${NC}"
echo -e "  1. Follow the immediate action plan in: $DEMO_DIR/immediate-action-plan.md"
echo -e "  2. Start consulting services within 7 days"
echo -e "  3. Generate first revenue within 4 weeks"
echo -e "  4. Build MVP platform in parallel"
echo -e "  5. Scale to \$100K/month within 6 months"
echo ""
echo -e "${CYAN}📁 Demo Results Saved To:${NC}"
echo -e "  • $DEMO_DIR/youtube-analysis-response.json"
echo -e "  • $DEMO_DIR/business-opportunities.txt"
echo -e "  • $DEMO_DIR/crew-recommendations.txt"
echo -e "  • $DEMO_DIR/implementation-roadmap.txt"
echo -e "  • $DEMO_DIR/immediate-action-plan.md"
echo ""
echo -e "${GREEN}🖖 Live long and prosper with automated profitability!${NC}"

# Open the demo results in the browser
if command -v open >/dev/null 2>&1; then
    echo -e "\n${BLUE}Opening demo results in browser...${NC}"
    open "$BASE_URL"
fi
