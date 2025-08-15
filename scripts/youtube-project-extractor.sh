#!/bin/bash

# 🚀 YouTube Project Extractor & Production Integration
# This script extracts project ideas from YouTube channels and integrates them into our agile workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
YOUTUBE_SCRAPER="$SCRIPT_DIR/youtube-project-ideas-scraper.js"
PROJECT_GENERATOR="$SCRIPT_DIR/generate-project.sh"
REVIEW_DIR="$PROJECT_ROOT/youtube-project-reviews"
APPROVED_DIR="$PROJECT_ROOT/approved-projects"
ARCHIVED_DIR="$PROJECT_ROOT/archived-projects"
EMAIL_TEMPLATE_DIR="$PROJECT_ROOT/email-templates"
LOG_FILE="$PROJECT_ROOT/logs/youtube-extraction-$(date +%Y%m%d-%H%M%S).log"

# Create necessary directories
mkdir -p "$REVIEW_DIR" "$APPROVED_DIR" "$ARCHIVED_DIR" "$EMAIL_TEMPLATE_DIR" "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to show usage
show_usage() {
    cat << EOF
🚀 YouTube Project Extractor & Production Integration

Usage: $0 [OPTIONS] [CHANNEL_URL]

OPTIONS:
    -c, --channel URL     YouTube channel URL to extract from
    -r, --review          Review extracted projects interactively
    -a, --auto-approve    Automatically approve all extracted projects
    -e, --email           Send daily email with approved projects
    -i, --integrate       Integrate approved projects into agile workflow
    -f, --force           Force re-extraction even if projects exist
    -v, --verbose         Verbose output
    -h, --help            Show this help message

EXAMPLES:
    $0 -c "https://www.youtube.com/@GregIsenberg/videos" -r
    $0 --channel "https://www.youtube.com/@GregIsenberg/videos" --review --email
    $0 --auto-approve --integrate

DEFAULT CHANNEL: https://www.youtube.com/@GregIsenberg/videos

EOF
}

# Function to extract projects from YouTube channel
extract_projects() {
    local channel_url="$1"
    local force="$2"
    
    log "🎬 Starting YouTube project extraction from: $channel_url"
    
    # Check if Node.js and required packages are available
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if puppeteer is installed
    if ! node -e "require('puppeteer')" &> /dev/null; then
        warning "Puppeteer not found. Installing..."
        npm install puppeteer
    fi
    
    # Create extraction timestamp
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local extraction_file="$REVIEW_DIR/extraction-$timestamp.json"
    
    log "📊 Running YouTube scraper..."
    
    # Run the YouTube scraper
    if node "$YOUTUBE_SCRAPER" "$channel_url" > "$extraction_file" 2>&1; then
        log "✅ Project extraction completed successfully"
        log "📁 Results saved to: $extraction_file"
        echo "$extraction_file"
    else
        error "❌ Project extraction failed"
        return 1
    fi
}

# Function to review extracted projects
review_projects() {
    local extraction_file="$1"
    
    if [[ ! -f "$extraction_file" ]]; then
        error "Extraction file not found: $extraction_file"
        return 1
    fi
    
    log "🔍 Starting project review process..."
    
    # Parse the extraction results
    local projects=$(jq -r '.projectTemplates[] | @base64' "$extraction_file" 2>/dev/null || echo "")
    
    if [[ -z "$projects" ]]; then
        warning "No projects found in extraction file"
        return 1
    fi
    
    local approved_count=0
    local archived_count=0
    local deleted_count=0
    
    echo -e "\n${CYAN}=== PROJECT REVIEW ===${NC}"
    echo "Review each project and choose:"
    echo "  [A]pprove - Add to agile workflow"
    echo "  [R]eject - Archive project"
    echo "  [D]elete - Remove completely"
    echo "  [S]kip - Review later"
    echo "  [Q]uit - Exit review"
    echo ""
    
    while IFS= read -r project_base64; do
        if [[ -z "$project_base64" ]]; then
            continue
        fi
        
        # Decode project data
        local project_json=$(echo "$project_base64" | base64 -d)
        local project_id=$(echo "$project_json" | jq -r '.id')
        local project_name=$(echo "$project_json" | jq -r '.name')
        local revenue_potential=$(echo "$project_json" | jq -r '.revenuePotential')
        local complexity=$(echo "$project_json" | jq -r '.complexity')
        local category=$(echo "$project_json" | jq -r '.category')
        local description=$(echo "$project_json" | jq -r '.description')
        
        echo -e "\n${YELLOW}Project: $project_name${NC}"
        echo "ID: $project_id"
        echo "Revenue Potential: \$${revenue_potential}"
        echo "Complexity: $complexity"
        echo "Category: $category"
        echo "Description: $description"
        echo ""
        
        while true; do
            read -p "Action [A/R/D/S/Q]: " action
            case $action in
                [Aa])
                    log "✅ Approving project: $project_name"
                    echo "$project_json" > "$APPROVED_DIR/$project_id.json"
                    ((approved_count++))
                    break
                    ;;
                [Rr])
                    log "📁 Archiving project: $project_name"
                    echo "$project_json" > "$ARCHIVED_DIR/$project_id.json"
                    ((archived_count++))
                    break
                    ;;
                [Dd])
                    log "🗑️ Deleting project: $project_name"
                    ((deleted_count++))
                    break
                    ;;
                [Ss])
                    log "⏭️ Skipping project: $project_name"
                    break
                    ;;
                [Qq])
                    log "👋 Review process terminated by user"
                    break 2
                    ;;
                *)
                    echo "Invalid option. Please choose A/R/D/S/Q"
                    ;;
            esac
        done
    done <<< "$projects"
    
    log "📊 Review Summary:"
    log "  ✅ Approved: $approved_count"
    log "  📁 Archived: $archived_count"
    log "  🗑️ Deleted: $deleted_count"
}

# Function to auto-approve all projects
auto_approve_projects() {
    local extraction_file="$1"
    
    log "🤖 Auto-approving all extracted projects..."
    
    # Parse and approve all projects
    local approved_count=0
    
    while IFS= read -r project_base64; do
        if [[ -z "$project_base64" ]]; then
            continue
        fi
        
        local project_json=$(echo "$project_base64" | base64 -d)
        local project_id=$(echo "$project_json" | jq -r '.id')
        local project_name=$(echo "$project_json" | jq -r '.name')
        
        echo "$project_json" > "$APPROVED_DIR/$project_id.json"
        log "✅ Auto-approved: $project_name"
        ((approved_count++))
    done < <(jq -r '.projectTemplates[] | @base64' "$extraction_file" 2>/dev/null)
    
    log "🤖 Auto-approval complete: $approved_count projects approved"
}

# Function to integrate approved projects into agile workflow
integrate_projects() {
    log "🔗 Integrating approved projects into agile workflow..."
    
    local integrated_count=0
    
    # Process each approved project
    for project_file in "$APPROVED_DIR"/*.json; do
        if [[ ! -f "$project_file" ]]; then
            continue
        fi
        
        local project_id=$(basename "$project_file" .json)
        local project_name=$(jq -r '.name' "$project_file")
        local template_id=$(jq -r '.id' "$project_file")
        
        log "🔧 Integrating project: $project_name"
        
        # Generate the project using our project generator
        if "$PROJECT_GENERATOR" "$template_id" "$project_name" --auto-deploy; then
            log "✅ Successfully integrated: $project_name"
            ((integrated_count++))
            
            # Move to processed directory
            mv "$project_file" "$APPROVED_DIR/processed/$project_id.json"
        else
            error "❌ Failed to integrate: $project_name"
        fi
    done
    
    log "🔗 Integration complete: $integrated_count projects integrated"
}

# Function to generate daily email with approved projects
generate_daily_email() {
    log "📧 Generating daily email with approved projects..."
    
    local email_file="$EMAIL_TEMPLATE_DIR/daily-projects-$(date +%Y%m%d).html"
    local approved_projects=()
    
    # Collect approved projects
    for project_file in "$APPROVED_DIR"/*.json; do
        if [[ -f "$project_file" ]]; then
            approved_projects+=("$project_file")
        fi
    done
    
    if [[ ${#approved_projects[@]} -eq 0 ]]; then
        log "📧 No approved projects to include in email"
        return 0
    fi
    
    # Generate HTML email
    cat > "$email_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Daily Project Updates - $(date +%Y-%m-%d)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 5px; }
        .project { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .project h3 { color: #2c3e50; margin-top: 0; }
        .revenue { color: #27ae60; font-weight: bold; }
        .complexity { color: #e74c3c; font-weight: bold; }
        .category { color: #3498db; font-weight: bold; }
        .footer { margin-top: 30px; padding: 15px; background: #ecf0f1; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Daily Project Updates</h1>
        <p>Date: $(date +%Y-%m-%d)</p>
        <p>Generated by AlexAI YouTube Project Extractor</p>
    </div>
    
    <h2>📋 Approved Projects (${#approved_projects[@]})</h2>
EOF
    
    # Add each project to the email
    for project_file in "${approved_projects[@]}"; do
        local project_name=$(jq -r '.name' "$project_file")
        local revenue_potential=$(jq -r '.revenuePotential' "$project_file")
        local complexity=$(jq -r '.complexity' "$project_file")
        local category=$(jq -r '.category' "$project_file")
        local description=$(jq -r '.description' "$project_file")
        local target_market=$(jq -r '.targetMarket' "$project_file")
        local estimated_time=$(jq -r '.estimatedTime' "$project_file")
        
        cat >> "$email_file" << EOF
    <div class="project">
        <h3>$project_name</h3>
        <p><strong>Revenue Potential:</strong> <span class="revenue">\$${revenue_potential}</span></p>
        <p><strong>Complexity:</strong> <span class="complexity">$complexity</span></p>
        <p><strong>Category:</strong> <span class="category">$category</span></p>
        <p><strong>Target Market:</strong> $target_market</p>
        <p><strong>Estimated Time:</strong> $estimated_time</p>
        <p><strong>Description:</strong> $description</p>
    </div>
EOF
    done
    
    # Add footer
    cat >> "$email_file" << EOF
    
    <div class="footer">
        <p><strong>Total Projects:</strong> ${#approved_projects[@]}</p>
        <p><strong>Total Revenue Potential:</strong> \$$(jq -s 'map(.revenuePotential) | add' "$APPROVED_DIR"/*.json)</p>
        <p>Generated by AlexAI Star Trek Agile System</p>
        <p>Date: $(date)</p>
    </div>
</body>
</html>
EOF
    
    log "📧 Daily email generated: $email_file"
    
    # Send email if configured
    if [[ -n "$SMTP_CONFIG" ]]; then
        log "📧 Sending daily email..."
        # Add email sending logic here
    fi
}

# Function to create agile project entries
create_agile_entries() {
    log "📋 Creating agile project entries..."
    
    local agile_file="$PROJECT_ROOT/data/agile-projects-$(date +%Y%m%d).json"
    local projects=()
    
    # Collect approved projects
    for project_file in "$APPROVED_DIR"/*.json; do
        if [[ -f "$project_file" ]]; then
            local project_data=$(cat "$project_file")
            projects+=("$project_data")
        fi
    done
    
    if [[ ${#projects[@]} -eq 0 ]]; then
        log "📋 No projects to add to agile system"
        return 0
    fi
    
    # Create agile project structure
    cat > "$agile_file" << EOF
{
  "date": "$(date +%Y-%m-%d)",
  "source": "youtube-extraction",
  "channel": "Greg Isenberg",
  "total_projects": ${#projects[@]},
  "total_revenue_potential": $(jq -s 'map(.revenuePotential) | add' "$APPROVED_DIR"/*.json),
  "projects": [
EOF
    
    # Add each project
    local first=true
    for project_file in "$APPROVED_DIR"/*.json; do
        if [[ -f "$project_file" ]]; then
            if [[ "$first" == "true" ]]; then
                first=false
            else
                echo "," >> "$agile_file"
            fi
            
            # Add agile-specific fields
            jq '. + {
                "agile_id": (.id + "-" + (now | todate)),
                "status": "approved",
                "priority": "medium",
                "sprint": "backlog",
                "assigned_to": "team",
                "created_date": (now | todate),
                "estimated_story_points": (if .complexity == "Simple" then 3 elif .complexity == "Medium" then 5 else 8 end)
            }' "$project_file" >> "$agile_file"
        fi
    done
    
    cat >> "$agile_file" << EOF
  ]
}
EOF
    
    log "📋 Agile project entries created: $agile_file"
}

# Main execution function
main() {
    local channel_url="https://www.youtube.com/@GregIsenberg/videos"
    local review_mode=false
    local auto_approve=false
    local send_email=false
    local integrate=false
    local force=false
    local verbose=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -c|--channel)
                channel_url="$2"
                shift 2
                ;;
            -r|--review)
                review_mode=true
                shift
                ;;
            -a|--auto-approve)
                auto_approve=true
                shift
                ;;
            -e|--email)
                send_email=true
                shift
                ;;
            -i|--integrate)
                integrate=true
                shift
                ;;
            -f|--force)
                force=true
                shift
                ;;
            -v|--verbose)
                verbose=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                if [[ -z "$channel_url" ]]; then
                    channel_url="$1"
                else
                    error "Unknown option: $1"
                    show_usage
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Set verbose mode
    if [[ "$verbose" == "true" ]]; then
        set -x
    fi
    
    log "🚀 Starting YouTube Project Extractor & Production Integration"
    log "📺 Channel: $channel_url"
    log "📁 Working directory: $PROJECT_ROOT"
    
    # Extract projects
    local extraction_file
    extraction_file=$(extract_projects "$channel_url" "$force")
    
    if [[ $? -ne 0 ]]; then
        error "❌ Project extraction failed"
        exit 1
    fi
    
    # Review or auto-approve projects
    if [[ "$review_mode" == "true" ]]; then
        review_projects "$extraction_file"
    elif [[ "$auto_approve" == "true" ]]; then
        auto_approve_projects "$extraction_file"
    else
        log "💡 Use -r for interactive review or -a for auto-approval"
    fi
    
    # Generate daily email
    if [[ "$send_email" == "true" ]]; then
        generate_daily_email
    fi
    
    # Integrate into agile workflow
    if [[ "$integrate" == "true" ]]; then
        integrate_projects
        create_agile_entries
    fi
    
    log "🎉 YouTube Project Extractor & Production Integration completed successfully!"
    log "📊 Check the following directories for results:"
    log "  📁 Reviews: $REVIEW_DIR"
    log "  ✅ Approved: $APPROVED_DIR"
    log "  📁 Archived: $ARCHIVED_DIR"
    log "  📧 Emails: $EMAIL_TEMPLATE_DIR"
    log "  📋 Logs: $LOG_FILE"
}

# Run main function with all arguments
main "$@"
