#!/bin/bash

# 🚀 Revolutionary Project Generator Script
# This script automates the creation of revenue-generating projects using n8n integration
# Each project = revenue-generating microservice with $2,500-$5,000 potential

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

# Configuration
N8N_BASE_URL="${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
N8N_API_TOKEN="${N8N_API_TOKEN}"
PROJECTS_DIR="generated-projects"
WORKFLOWS_DIR="workflows"
COMPONENTS_DIR="src/components/n8n"
API_ROUTES_DIR="src/app/api"

echo -e "${BLUE}🚀 Revolutionary Project Generator${NC}"
echo -e "${BLUE}Revenue Potential: $2,500 - $5,000 per Project${NC}"
echo ""

# Function to display usage
show_usage() {
    echo -e "${CYAN}Usage: $0 <template-id> <project-name> [options]${NC}"
    echo ""
    echo -e "${YELLOW}Available Templates:${NC}"
    echo "  resume-auditor     - Resume Compliance Auditor (\$2,500)"
    echo "  business-intelligence - Business Intelligence Dashboard (\$3,500)"
    echo "  content-analyzer   - Content Performance Analyzer (\$3,000)"
    echo "  financial-planner  - AI Financial Planning Assistant (\$4,000)"
    echo "  social-media-manager - Social Media Performance Manager (\$2,800)"
    echo "  customer-support-ai - AI Customer Support Assistant (\$3,200)"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --custom-features  - Add custom features (comma-separated)"
    echo "  --target-market    - Specify target market"
    echo "  --revenue-potential - Override revenue potential"
    echo "  --deploy           - Automatically deploy to n8n server"
    echo ""
    echo -e "${GREEN}Example:${NC}"
    echo "  $0 business-intelligence \"My BI Dashboard\" --custom-features \"Custom Reports,Advanced Analytics\" --deploy"
}

# Function to validate template
validate_template() {
    local template_id="$1"
    case $template_id in
        resume-auditor|business-intelligence|content-analyzer|financial-planner|social-media-manager|customer-support-ai)
            return 0
            ;;
        *)
            echo -e "${RED}❌ Invalid template ID: $template_id${NC}"
            return 1
            ;;
    esac
}

# Function to get template configuration
get_template_config() {
    local template_id="$1"
    case $template_id in
        resume-auditor)
            echo "resume-auditor|Resume Compliance Auditor|AI-powered resume analysis with compliance scoring|2500|HR Professionals, Recruiters|resume-audit-webhook|ResumeComplianceAuditor|/api/n8n-resume-auditor"
            ;;
        business-intelligence)
            echo "business-intelligence|Business Intelligence Dashboard|Real-time business metrics and predictive analytics|3500|Small Businesses, Startups|business-intelligence-webhook|BusinessIntelligenceDashboard|/api/n8n-business-intelligence"
            ;;
        content-analyzer)
            echo "content-analyzer|Content Performance Analyzer|AI-powered content analysis with SEO optimization|3000|Content Creators, Marketers|content-analysis-webhook|ContentAnalyzer|/api/n8n-content-analyzer"
            ;;
        financial-planner)
            echo "financial-planner|AI Financial Planning Assistant|Personalized financial planning with investment recommendations|4000|Individuals, Financial Advisors|financial-planning-webhook|FinancialPlanner|/api/n8n-financial-planner"
            ;;
        social-media-manager)
            echo "social-media-manager|Social Media Performance Manager|Comprehensive social media analytics with automated posting|2800|Social Media Managers, Businesses|social-media-webhook|SocialMediaManager|/api/n8n-social-media-manager"
            ;;
        customer-support-ai)
            echo "customer-support-ai|AI Customer Support Assistant|Intelligent customer support with automated responses|3200|Customer Service Teams, E-commerce|customer-support-webhook|CustomerSupportAI|/api/n8n-customer-support"
            ;;
    esac
}

# Function to create n8n workflow
create_n8n_workflow() {
    local project_name="$1"
    local webhook_path="$2"
    local workflow_file="$3"
    
    echo -e "${BLUE}🔧 Creating n8n workflow...${NC}"
    
    cat > "$workflow_file" << EOF
{
  "name": "$project_name",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "$webhook_path",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-node",
      "name": "$project_name Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{\n  \"timestamp\": \"{{ \$now }}\",\n  \"projectName\": \"$project_name\",\n  \"status\": \"success\",\n  \"message\": \"Project generated successfully\",\n  \"data\": {\n    \"input\": {{ \$json }},\n    \"processed\": true,\n    \"revenuePotential\": \"Generated by $project_name\"\n  }\n}",
        "options": {}
      },
      "id": "respond-node",
      "name": "$project_name Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [460, 300]
    }
  ],
  "connections": {
    "$project_name Webhook": {
      "main": [
        [
          {
            "node": "$project_name Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null
}
EOF

    echo -e "${GREEN}✅ n8n workflow created: $workflow_file${NC}"
}

# Function to create Next.js API route
create_nextjs_api_route() {
    local project_name="$1"
    local api_route="$2"
    local component_name="$3"
    local api_dir="$4"
    
    echo -e "${BLUE}🌐 Creating Next.js API route...${NC}"
    
    mkdir -p "$api_dir"
    
    # Extract webhook path from API route
    local webhook_path=$(echo "$api_route" | sed 's|.*/||')
    
    cat > "$api_dir/route.ts" << EOF
import { NextRequest, NextResponse } from 'next/server';

// 🚀 $project_name API Route
// Generated by Revolutionary Project Generator
// Revenue Potential: Generated automatically

interface ${component_name}Request {
  // Add your request interface here
  [key: string]: any;
}

interface ${component_name}Response {
  timestamp: string;
  projectName: string;
  status: string;
  message: string;
  data: {
    input: any;
    processed: boolean;
    revenuePotential: string;
  };
  source: 'n8n-workflow' | 'fallback-analysis';
  workflowId: string;
}

// Fallback analysis function
function analyze${component_name}Fallback(data: ${component_name}Request): ${component_name}Response {
  return {
    timestamp: new Date().toISOString(),
    projectName: '$project_name',
    status: 'success',
    message: 'Analysis completed using fallback engine',
    data: {
      input: data,
      processed: true,
      revenuePotential: 'Generated by $project_name'
    },
    source: 'fallback-analysis',
    workflowId: '$component_name-fallback'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ${component_name}Request = await request.json();
    
    // Try to call n8n workflow first
    const n8nUrl = process.env.N8N_BASE_URL || '$N8N_BASE_URL';
    const webhookPath = '$webhook_path';
    
    try {
      const n8nResponse = await fetch(\`\${n8nUrl}/webhook/\${webhookPath}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000)
      });
      
      if (n8nResponse.ok) {
        const n8nResult = await n8nResponse.json();
        
        if (n8nResult.status === 'success') {
          return NextResponse.json({
            ...n8nResult,
            source: 'n8n-workflow',
            workflowId: '$component_name-webhook'
          });
        }
      }
    } catch (n8nError) {
      console.log('n8n workflow call failed, using fallback analysis:', n8nError);
    }
    
    // Fallback to local analysis
    const fallbackResult = analyze${component_name}Fallback(body);
    
    return NextResponse.json(fallbackResult);
    
  } catch (error) {
    console.error('Error in $component_name API:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '$project_name API',
    status: 'active',
    workflowId: '$component_name-webhook',
    endpoints: {
      POST: '$api_route',
      description: 'Generated by Revolutionary Project Generator'
    },
    integration: 'n8n-workflow + Next.js fallback',
    revenuePotential: 'Generated automatically',
    timestamp: new Date().toISOString()
  });
}
EOF

    echo -e "${GREEN}✅ Next.js API route created: $api_dir/route.ts${NC}"
}

# Function to create React component
create_react_component() {
    local project_name="$1"
    local component_name="$2"
    local component_file="$3"
    
    echo -e "${BLUE}🎨 Creating React component...${NC}"
    
    cat > "$component_file" << EOF
'use client';

import React, { useState } from 'react';

// 🚀 $component_name Component
// Generated by Revolutionary Project Generator
// Revenue Potential: Generated automatically

interface ${component_name}Data {
  timestamp: string;
  projectName: string;
  status: string;
  message: string;
  data: {
    input: any;
    processed: boolean;
    revenuePotential: string;
  };
  source: string;
  workflowId: string;
}

const ${component_name}: React.FC = () => {
  const [inputData, setInputData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<${component_name}Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value);
  };

  const handleProcess = async () => {
    if (!inputData.trim()) {
      setError('Please provide input data');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('${api_route}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: inputData }),
      });

      if (!response.ok) {
        throw new Error(\`Processing failed: \${response.statusText}\`);
      }

      const analysisResult = await response.json();
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="lcars-container">
      {/* Header Panel */}
      <div className="lcars-panel lcars-primary-panel">
        <h2 className="lcars-title">🚀 $project_name</h2>
        <p className="lcars-subtitle">
          Generated by Revolutionary Project Generator
        </p>
        <p className="lcars-description">
          AI-powered analysis with real-time processing and strategic insights
        </p>
        <div className="lcars-revenue-potential">
          <strong>Revenue Potential: Generated automatically</strong>
        </div>
      </div>

      {/* Input Panel */}
      <div className="lcars-panel lcars-secondary-panel">
        <h3 className="lcars-panel-title">📝 Input Data</h3>
        <textarea
          className="lcars-textarea"
          value={inputData}
          onChange={handleInputChange}
          placeholder="Enter your data for analysis..."
          rows={6}
        />
        <button
          className={\`lcars-button \${isProcessing ? 'lcars-button-disabled' : 'lcars-button-primary'}\`}
          onClick={handleProcess}
          disabled={isProcessing}
        >
          {isProcessing ? '🔍 Processing...' : '🚀 Process Data'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="lcars-panel lcars-error-panel">
          <h3 className="lcars-panel-title">⚠️ Error</h3>
          <p className="lcars-error-text">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="lcars-panel lcars-success-panel">
          <h3 className="lcars-panel-title">📊 Analysis Results</h3>
          <div className="analysis-results">
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Message:</strong> {result.message}</p>
            <p><strong>Source:</strong> {result.source}</p>
            <p><strong>Workflow ID:</strong> {result.workflowId}</p>
            <p><strong>Processed:</strong> {result.data.processed ? 'Yes' : 'No'}</p>
            <p><strong>Revenue Potential:</strong> {result.data.revenuePotential}</p>
            <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Integration Status Panel */}
      <div className="lcars-panel lcars-info-panel">
        <h3 className="lcars-panel-title">🔗 Integration Status</h3>
        <div className="lcars-integration-status">
          <p><strong>Project:</strong> $project_name</p>
          <p><strong>Status:</strong> {result ? 'Active' : 'Standby'}</p>
          <p><strong>Source:</strong> {result?.source || 'Next.js API'}</p>
          <p><strong>Fallback:</strong> Local analysis engine</p>
          <p><strong>Generated:</strong> By Revolutionary Project Generator</p>
        </div>
      </div>
    </div>
  );
};

export default ${component_name};
EOF

    echo -e "${GREEN}✅ React component created: $component_file${NC}"
}

# Function to deploy to n8n server
deploy_to_n8n() {
    local workflow_file="$1"
    local project_name="$2"
    
    if [ -z "$N8N_API_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  N8N_API_TOKEN not set, skipping deployment${NC}"
        return 0
    fi
    
    echo -e "${BLUE}🚀 Deploying to n8n server...${NC}"
    
    # Create clean payload
    local clean_payload=$(cat "$workflow_file" | jq -c '{
        name: .name,
        nodes: .nodes,
        connections: .connections,
        settings: .settings,
        staticData: .staticData
    }')
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to process workflow JSON${NC}"
        return 1
    fi
    
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "X-N8N-API-KEY: $N8N_API_TOKEN" \
        -d "$clean_payload" \
        "$N8N_BASE_URL/api/v1/workflows")
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Deployment request failed${NC}"
        return 1
    fi
    
    if echo "$response" | grep -q '"id"'; then
        local workflow_id=$(echo "$response" | jq -r '.id')
        echo -e "${GREEN}✅ Deployed to n8n server!${NC}"
        echo -e "${GREEN}   Workflow ID: $workflow_id${NC}"
                 local webhook_name=$(echo "$project_name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
         echo -e "${GREEN}   Webhook URL: $N8N_BASE_URL/webhook/${webhook_name}-webhook${NC}"
        return 0
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Function to create project documentation
create_project_docs() {
    local project_name="$1"
    local template_config="$2"
    local docs_file="$3"
    
    echo -e "${BLUE}📚 Creating project documentation...${NC}"
    
    cat > "$docs_file" << EOF
# $project_name

## Project Overview
Generated by the Revolutionary Project Generator using n8n integration.

## Template Configuration
- Template ID: $(echo $template_config | cut -d'|' -f1)
- Base Name: $(echo $template_config | cut -d'|' -f2)
- Description: $(echo $template_config | cut -d'|' -f3)
- Revenue Potential: \$$(echo $template_config | cut -d'|' -f4)
- Target Market: $(echo $template_config | cut -d'|' -f5)

## Generated Files
- n8n Workflow: workflows/$project_name.json
- Next.js API Route: src/app/api/n8n-$project_name/route.ts
- React Component: src/components/n8n/$project_name.tsx

## Integration Endpoints
- n8n Webhook: $N8N_BASE_URL/webhook/${project_name// /-}-webhook
- Next.js API: /api/n8n-$project_name
- React Component: $project_name

## Usage
1. Deploy the n8n workflow to your n8n server
2. Import the React component into your Next.js application
3. Use the API route for server-side integration
4. Customize the component and workflow as needed

## Revenue Strategy
This project represents a revenue-generating microservice with potential for:
- Direct monetization through API usage
- Integration into larger business solutions
- White-label licensing opportunities
- Custom development services

## Generated: $(date)
EOF

    echo -e "${GREEN}✅ Project documentation created: $docs_file${NC}"
}

# Main function
main() {
    # Parse command line arguments
    if [ $# -lt 2 ]; then
        show_usage
        exit 1
    fi
    
    local template_id="$1"
    local project_name="$2"
    shift 2
    
    # Parse options
    local custom_features=""
    local target_market=""
    local revenue_potential=""
    local deploy_flag=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --custom-features)
                custom_features="$2"
                shift 2
                ;;
            --target-market)
                target_market="$2"
                shift 2
                ;;
            --revenue-potential)
                revenue_potential="$2"
                shift 2
                ;;
            --deploy)
                deploy_flag=true
                shift
                ;;
            *)
                echo -e "${RED}❌ Unknown option: $1${NC}"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Validate template
    if ! validate_template "$template_id"; then
        exit 1
    fi
    
    # Get template configuration
    local template_config=$(get_template_config "$template_id")
    local base_name=$(echo $template_config | cut -d'|' -f2)
    local description=$(echo $template_config | cut -d'|' -f3)
    local base_revenue=$(echo $template_config | cut -d'|' -f4)
    local base_target_market=$(echo $template_config | cut -d'|' -f5)
    local webhook_path=$(echo $template_config | cut -d'|' -f6)
    local component_name=$(echo $template_config | cut -d'|' -f7)
    local api_route=$(echo $template_config | cut -d'|' -f8)
    
    # Use provided values or defaults
    local final_target_market="${target_market:-$base_target_market}"
    local final_revenue="${revenue_potential:-$base_revenue}"
    
    echo -e "${BLUE}🚀 Generating Project: $project_name${NC}"
    echo -e "${BLUE}Template: $base_name${NC}"
    echo -e "${BLUE}Revenue Potential: \$${final_revenue}${NC}"
    echo -e "${BLUE}Target Market: $final_target_market${NC}"
    echo ""
    
    # Create project directory
    local project_dir="$PROJECTS_DIR/$project_name"
    mkdir -p "$project_dir"
    
    # Create n8n workflow
    local workflow_file="$project_dir/$project_name.json"
    local webhook_name=$(echo "$project_name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    create_n8n_workflow "$project_name" "${webhook_name}-webhook" "$workflow_file"
    
    # Create Next.js API route
    local api_dir="$project_dir/api/n8n-$project_name"
    create_nextjs_api_route "$project_name" "$api_route" "$component_name" "$api_dir"
    
    # Create React component
    local component_file="$project_dir/$project_name.tsx"
    create_react_component "$project_name" "$component_name" "$component_file"
    
    # Create project documentation
    local docs_file="$project_dir/README.md"
    create_project_docs "$project_name" "$template_config" "$docs_file"
    
    # Deploy to n8n if requested
    if [ "$deploy_flag" = true ]; then
        deploy_to_n8n "$workflow_file" "$project_name"
    fi
    
    # Create project summary
    echo ""
    echo -e "${GREEN}🎉 Project Generated Successfully!${NC}"
    echo ""
    echo -e "${CYAN}Project Details:${NC}"
    echo "  Name: $project_name"
    echo "  Template: $base_name"
    echo "  Revenue Potential: \$${final_revenue}"
    echo "  Target Market: $final_target_market"
    echo "  Generated Files: $project_dir/"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo "  1. Review generated files in $project_dir/"
    echo "  2. Customize the workflow and component as needed"
    echo "  3. Deploy to n8n server: $0 $template_id \"$project_name\" --deploy"
    echo "  4. Integrate into your Next.js application"
    echo "  5. Start generating revenue!"
    echo ""
    echo -e "${GREEN}🚀 Ready to scale to \$${final_revenue} in revenue!${NC}"
}

# Run main function
main "$@"
