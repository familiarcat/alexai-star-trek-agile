#!/bin/zsh

# 🧠 AlexAI Knowledge Base Reorganization
# Implements comprehensive didactic system for AI agents

set -e

# Source safe utilities
source scripts/utils/safe-echo.sh

print_header "ALEXAI KNOWLEDGE BASE REORGANIZATION" "Implementing AI Agent Didactic System"

# Function: Create knowledge architecture
create_knowledge_architecture() {
    print_section "CREATING KNOWLEDGE ARCHITECTURE" "🏗️"
    
    local base_dir="alexai-knowledge-base"
    
    print_status "working" "Creating knowledge base directory structure..."
    
    # Create main directories
    mkdir -p "$base_dir"/{01-foundations,02-ai-agents,03-operations,04-projects,05-evolution,06-reference}
    
    # 01-foundations subdirectories
    mkdir -p "$base_dir/01-foundations"/{architecture,standards,glossary}
    mkdir -p "$base_dir/01-foundations/architecture"/{system-design,ui-frameworks,integration-patterns}
    mkdir -p "$base_dir/01-foundations/standards"/{coding-guidelines,security-protocols,validation-procedures}
    mkdir -p "$base_dir/01-foundations/glossary"
    
    # 02-ai-agents subdirectories
    mkdir -p "$base_dir/02-ai-agents"/{crew-definitions,workflows,capabilities,training-data}
    mkdir -p "$base_dir/02-ai-agents/workflows"/{n8n-definitions,interaction-patterns,self-evolution-frameworks}
    mkdir -p "$base_dir/02-ai-agents/capabilities"/{natural-language-processing,technical-analysis,emotional-intelligence,engineering-solutions,logical-reasoning,security-protocols}
    mkdir -p "$base_dir/02-ai-agents/training-data"/{historical-interactions,successful-patterns,learning-examples}
    
    # 03-operations subdirectories
    mkdir -p "$base_dir/03-operations"/{procedures,scripts,environments,troubleshooting}
    mkdir -p "$base_dir/03-operations/procedures"/{deployment,testing,monitoring,maintenance}
    mkdir -p "$base_dir/03-operations/scripts"/{automation,validation,deployment,utilities}
    mkdir -p "$base_dir/03-operations/environments"/{local-development,staging,production}
    mkdir -p "$base_dir/03-operations/troubleshooting"/{common-issues,diagnostic-procedures,resolution-playbooks}
    
    # 04-projects subdirectories
    mkdir -p "$base_dir/04-projects"/{active-projects,completed-projects,planning,retrospectives}
    mkdir -p "$base_dir/04-projects/active-projects"/{project-templates,agile-workflows,kanban-boards}
    mkdir -p "$base_dir/04-projects/completed-projects"/{case-studies,lessons-learned,success-stories}
    mkdir -p "$base_dir/04-projects/planning"/{project-proposals,resource-allocation,timeline-management}
    mkdir -p "$base_dir/04-projects/retrospectives"/{what-worked,improvements,action-items}
    
    # 05-evolution subdirectories
    mkdir -p "$base_dir/05-evolution"/{learning-logs,adaptation-records,innovation-pipeline,knowledge-synthesis}
    mkdir -p "$base_dir/05-evolution/learning-logs"/{agent-improvements,system-optimizations,capability-expansions}
    mkdir -p "$base_dir/05-evolution/adaptation-records"/{context-adaptations,performance-tuning,behavior-modifications}
    mkdir -p "$base_dir/05-evolution/innovation-pipeline"/{experimental-features,proof-of-concepts,future-roadmap}
    mkdir -p "$base_dir/05-evolution/knowledge-synthesis"/{cross-domain-insights,pattern-recognition,emergent-capabilities}
    
    # 06-reference subdirectories
    mkdir -p "$base_dir/06-reference"/{api-documentation,best-practices,external-resources,quick-reference}
    mkdir -p "$base_dir/06-reference/api-documentation"/{crew-apis,system-apis,integration-apis}
    mkdir -p "$base_dir/06-reference/best-practices"/{anthropic-guidelines,industry-standards,internal-conventions}
    mkdir -p "$base_dir/06-reference/external-resources"/{anthropic-documentation,nextjs-resources,n8n-resources}
    mkdir -p "$base_dir/06-reference/quick-reference"/{command-cheatsheets,troubleshooting-guides,emergency-procedures}
    
    print_status "success" "Knowledge architecture created successfully"
}

# Function: Categorize and migrate markdown files
migrate_markdown_files() {
    print_section "MIGRATING MARKDOWN FILES" "📚"
    
    local base_dir="alexai-knowledge-base"
    
    print_status "working" "Analyzing and categorizing 865 markdown files..."
    
    # Create categorization script
    cat > temp_categorize.py << 'EOF'
import os
import shutil
from pathlib import Path
import re

def categorize_md_file(filepath):
    """Categorize markdown file based on filename and content"""
    filename = os.path.basename(filepath).lower()
    
    # Architecture and Design
    if any(keyword in filename for keyword in ['architecture', 'design', 'lcars', 'ui', 'nextjs', 'system']):
        return '01-foundations/architecture'
    
    # Standards and Guidelines
    if any(keyword in filename for keyword in ['standards', 'guidelines', 'security', 'validation', 'best-practices']):
        return '01-foundations/standards'
    
    # AI Agents and Crew
    if any(keyword in filename for keyword in ['crew', 'agent', 'n8n', 'workflow', 'picard', 'data', 'troi', 'scott', 'spock', 'worf', 'ai']):
        return '02-ai-agents'
    
    # Operations and Deployment
    if any(keyword in filename for keyword in ['deployment', 'testing', 'ci', 'cd', 'operations', 'monitoring']):
        return '03-operations'
    
    # Projects and Management
    if any(keyword in filename for keyword in ['project', 'agile', 'kanban', 'milestone', 'planning', 'retrospective']):
        return '04-projects'
    
    # Evolution and Learning
    if any(keyword in filename for keyword in ['evolution', 'learning', 'adaptation', 'improvement', 'optimization']):
        return '05-evolution'
    
    # Reference and Documentation
    if any(keyword in filename for keyword in ['reference', 'api', 'documentation', 'guide', 'manual']):
        return '06-reference'
    
    # Default to reference
    return '06-reference/quick-reference'

def migrate_files():
    base_dir = 'alexai-knowledge-base'
    migrated_count = 0
    
    # Find all markdown files
    for root, dirs, files in os.walk('.'):
        # Skip the knowledge base directory itself
        if 'alexai-knowledge-base' in root:
            continue
            
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                category = categorize_md_file(filepath)
                
                target_dir = os.path.join(base_dir, category)
                os.makedirs(target_dir, exist_ok=True)
                
                target_path = os.path.join(target_dir, file)
                
                # Handle duplicates
                counter = 1
                original_target = target_path
                while os.path.exists(target_path):
                    name, ext = os.path.splitext(original_target)
                    target_path = f"{name}_{counter}{ext}"
                    counter += 1
                
                shutil.copy2(filepath, target_path)
                migrated_count += 1
                
                if migrated_count % 50 == 0:
                    print(f"Migrated {migrated_count} files...")
    
    print(f"Migration complete: {migrated_count} files processed")

if __name__ == "__main__":
    migrate_files()
EOF
    
    python3 temp_categorize.py
    rm temp_categorize.py
    
    print_status "success" "Markdown files migrated and categorized"
}

# Function: Migrate shell scripts
migrate_shell_scripts() {
    print_section "MIGRATING SHELL SCRIPTS" "⚙️"
    
    local base_dir="alexai-knowledge-base"
    
    print_status "working" "Categorizing and migrating 76 shell scripts..."
    
    # Create script migration logic
    find . -name "*.sh" -type f ! -path "./alexai-knowledge-base/*" | while read script; do
        script_name=$(basename "$script")
        
        # Categorize based on script purpose
        if [[ "$script_name" =~ (deploy|deployment) ]]; then
            target_dir="$base_dir/03-operations/scripts/deployment"
        elif [[ "$script_name" =~ (test|validation|verify) ]]; then
            target_dir="$base_dir/03-operations/scripts/validation"
        elif [[ "$script_name" =~ (setup|install|environment) ]]; then
            target_dir="$base_dir/03-operations/scripts/automation"
        elif [[ "$script_name" =~ (n8n|workflow|crew) ]]; then
            target_dir="$base_dir/02-ai-agents/workflows/n8n-definitions"
        else
            target_dir="$base_dir/03-operations/scripts/utilities"
        fi
        
        mkdir -p "$target_dir"
        cp "$script" "$target_dir/"
    done
    
    print_status "success" "Shell scripts migrated successfully"
}

# Function: Create knowledge index
create_knowledge_index() {
    print_section "CREATING KNOWLEDGE INDEX" "📇"
    
    local base_dir="alexai-knowledge-base"
    
    print_status "working" "Generating comprehensive knowledge index..."
    
    cat > "$base_dir/KNOWLEDGE_INDEX.md" << 'EOF'
# 🧠 AlexAI Knowledge Base Index
## Comprehensive AI Agent Reference System

### 📊 **KNOWLEDGE BASE STATISTICS**

Generated: $(date)

**Total Categories:** 6 major domains
**Total Subdirectories:** 45+ specialized areas
**Total Files:** $(find alexai-knowledge-base -type f | wc -l | tr -d ' ') organized assets

### 🗂️ **KNOWLEDGE DOMAINS**

#### **01-FOUNDATIONS** 🏗️
Core architectural knowledge and standards
- **Architecture:** System design, UI frameworks, integration patterns
- **Standards:** Coding guidelines, security protocols, validation procedures
- **Glossary:** Technical terms, AI concepts, project terminology

#### **02-AI-AGENTS** 🤖
AI agent capabilities and training materials
- **Crew Definitions:** Individual agent specifications and roles
- **Workflows:** N8N definitions, interaction patterns, evolution frameworks
- **Capabilities:** Domain-specific expertise areas
- **Training Data:** Historical interactions and learning examples

#### **03-OPERATIONS** ⚙️
Operational procedures and automation scripts
- **Procedures:** Deployment, testing, monitoring, maintenance
- **Scripts:** Automation, validation, deployment utilities
- **Environments:** Local, staging, production configurations
- **Troubleshooting:** Issue resolution and diagnostic procedures

#### **04-PROJECTS** 📋
Project management and agile workflows
- **Active Projects:** Current initiatives and templates
- **Completed Projects:** Case studies and lessons learned
- **Planning:** Resource allocation and timeline management
- **Retrospectives:** Continuous improvement insights

#### **05-EVOLUTION** 🌱
Learning and adaptation systems
- **Learning Logs:** Agent improvements and optimizations
- **Adaptation Records:** Performance tuning and modifications
- **Innovation Pipeline:** Experimental features and roadmap
- **Knowledge Synthesis:** Cross-domain insights and patterns

#### **06-REFERENCE** 📚
Quick access documentation and external resources
- **API Documentation:** System and integration APIs
- **Best Practices:** Industry standards and guidelines
- **External Resources:** Third-party documentation
- **Quick Reference:** Cheatsheets and emergency procedures

### 🔍 **SEARCH AND NAVIGATION**

Use the following patterns to quickly locate information:

**By Domain:**
- `find 01-foundations -name "*keyword*"`
- `grep -r "search_term" 02-ai-agents/`

**By File Type:**
- Markdown files: `find . -name "*.md"`
- Shell scripts: `find . -name "*.sh"`
- JSON workflows: `find . -name "*.json"`

**By Agent:**
- Captain Picard: `02-ai-agents/crew-definitions/captain-picard.md`
- Lieutenant Data: `02-ai-agents/crew-definitions/lieutenant-data.md`
- And so forth for all crew members...

### 🤖 **AI AGENT INTEGRATION**

This knowledge base is designed for optimal AI agent utilization:

1. **Context-Aware Access:** Agents can reference relevant sections based on query type
2. **Progressive Learning:** New experiences update the knowledge base
3. **Cross-Reference Networks:** Related knowledge domains are interconnected
4. **Version Control:** All updates are tracked and validated

### 📈 **CONTINUOUS IMPROVEMENT**

The knowledge base evolves through:
- Regular audits and reorganization
- Agent learning feedback loops
- User experience optimization
- Industry best practice integration

---

*"Knowledge is power, but organized knowledge is transformation."* - AlexAI Crew
EOF
    
    print_status "success" "Knowledge index created"
}

# Function: Create agent reference API
create_agent_reference_api() {
    print_section "CREATING AGENT REFERENCE API" "🔗"
    
    print_status "working" "Creating API for agent knowledge access..."
    
    cat > src/app/api/knowledge/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const query = searchParams.get('query');
    const agent = searchParams.get('agent');
    
    const knowledgeBase = path.join(process.cwd(), 'alexai-knowledge-base');
    
    if (domain) {
      // Return specific domain information
      const domainPath = path.join(knowledgeBase, domain);
      const files = await fs.readdir(domainPath, { recursive: true });
      
      return NextResponse.json({
        domain,
        files: files.filter(file => file.endsWith('.md') || file.endsWith('.sh')),
        timestamp: new Date().toISOString()
      });
    }
    
    if (query) {
      // Search across knowledge base
      // Implementation for full-text search would go here
      return NextResponse.json({
        query,
        results: [],
        message: 'Search functionality to be implemented',
        timestamp: new Date().toISOString()
      });
    }
    
    if (agent) {
      // Return agent-specific knowledge
      const agentKnowledge = {
        'captain-picard': ['01-foundations', '04-projects'],
        'lieutenant-data': ['01-foundations/standards', '02-ai-agents', '03-operations'],
        'counselor-troi': ['02-ai-agents/capabilities/emotional-intelligence', '04-projects'],
        'chief-engineer-scott': ['03-operations', '01-foundations/architecture'],
        'commander-spock': ['01-foundations/standards', '05-evolution'],
        'lieutenant-worf': ['01-foundations/standards/security-protocols', '03-operations/troubleshooting']
      };
      
      return NextResponse.json({
        agent,
        relevantDomains: agentKnowledge[agent] || [],
        timestamp: new Date().toISOString()
      });
    }
    
    // Return knowledge base overview
    const overview = {
      domains: [
        '01-foundations',
        '02-ai-agents', 
        '03-operations',
        '04-projects',
        '05-evolution',
        '06-reference'
      ],
      totalFiles: 'To be calculated',
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(overview);
    
  } catch (error) {
    console.error('Knowledge API error:', error);
    return NextResponse.json(
      { error: 'Failed to access knowledge base' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { domain, filename, content, agent } = await request.json();
    
    // Add new knowledge to the base
    const knowledgeBase = path.join(process.cwd(), 'alexai-knowledge-base');
    const targetPath = path.join(knowledgeBase, domain, filename);
    
    await fs.writeFile(targetPath, content, 'utf-8');
    
    return NextResponse.json({
      message: 'Knowledge added successfully',
      path: targetPath,
      agent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Knowledge addition error:', error);
    return NextResponse.json(
      { error: 'Failed to add knowledge' },
      { status: 500 }
    );
  }
}
EOF
    
    print_status "success" "Agent reference API created"
}

# Main execution
main() {
    print_header "KNOWLEDGE BASE REORGANIZATION" "$(date)"
    
    create_knowledge_architecture
    migrate_markdown_files
    migrate_shell_scripts
    create_knowledge_index
    create_agent_reference_api
    
    print_status "success" "Knowledge base reorganization completed successfully"
    
    # Display summary
    print_section "REORGANIZATION SUMMARY" "📊"
    
    local total_files=$(find alexai-knowledge-base -type f | wc -l | tr -d ' ')
    local total_dirs=$(find alexai-knowledge-base -type d | wc -l | tr -d ' ')
    
    print_status "info" "Total files organized: $total_files"
    print_status "info" "Total directories created: $total_dirs"
    print_status "info" "Knowledge domains: 6 major areas"
    print_status "info" "API endpoint: /api/knowledge"
    
    print_section "NEXT STEPS" "🎯"
    print_status "info" "1. Update N8N agents to reference new knowledge structure"
    print_status "info" "2. Test agent knowledge access capabilities"
    print_status "info" "3. Implement search and indexing features"
    print_status "info" "4. Begin agent training with organized knowledge"
}

main "$@"
