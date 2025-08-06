#!/bin/bash

# 🚀 AlexAI Feature Branch Workflow
# Automates the entire Agile/Kanban process for feature development

set -e

# Configuration
MAIN_BRANCH="main"
FEATURE_PREFIX="feature"
HOTFIX_PREFIX="hotfix"
RELEASE_PREFIX="release"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Show usage
show_usage() {
    echo -e "${CYAN}🚀 AlexAI Feature Branch Workflow${NC}"
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  create-feature <name>    Create a new feature branch"
    echo "  create-hotfix <name>     Create a new hotfix branch"
    echo "  create-release <version> Create a new release branch"
    echo "  merge-feature <name>     Merge feature branch to main"
    echo "  merge-hotfix <name>      Merge hotfix branch to main"
    echo "  merge-release <version>  Merge release branch to main"
    echo "  list-branches            List all feature branches"
    echo "  cleanup-branches         Clean up merged feature branches"
    echo "  deploy-feature <name>    Deploy feature branch to staging"
    echo "  test-feature <name>      Run tests on feature branch"
    echo ""
    echo "Examples:"
    echo "  $0 create-feature user-authentication"
    echo "  $0 merge-feature user-authentication"
    echo "  $0 deploy-feature user-authentication"
}

# Validate git repository
validate_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
}

# Get current branch
get_current_branch() {
    git branch --show-current
}

# Check if branch exists
branch_exists() {
    local branch_name="$1"
    git show-ref --verify --quiet refs/heads/"$branch_name"
}

# Create feature branch
create_feature_branch() {
    local feature_name="$1"
    local branch_name="${FEATURE_PREFIX}/${feature_name}"
    
    log_step "Creating feature branch: $branch_name"
    
    # Validate input
    if [ -z "$feature_name" ]; then
        log_error "Feature name is required"
        exit 1
    fi
    
    # Check if branch already exists
    if branch_exists "$branch_name"; then
        log_error "Branch $branch_name already exists"
        exit 1
    fi
    
    # Ensure we're on main branch
    if [ "$(get_current_branch)" != "$MAIN_BRANCH" ]; then
        log_warning "Not on main branch. Switching to main..."
        git checkout "$MAIN_BRANCH"
    fi
    
    # Pull latest changes
    log_info "Pulling latest changes from main..."
    git pull origin "$MAIN_BRANCH"
    
    # Create and checkout feature branch
    git checkout -b "$branch_name"
    
    log_success "Feature branch created: $branch_name"
    log_info "You can now start developing your feature!"
    
    # Create feature development checklist
    create_feature_checklist "$feature_name"
}

# Create hotfix branch
create_hotfix_branch() {
    local hotfix_name="$1"
    local branch_name="${HOTFIX_PREFIX}/${hotfix_name}"
    
    log_step "Creating hotfix branch: $branch_name"
    
    # Validate input
    if [ -z "$hotfix_name" ]; then
        log_error "Hotfix name is required"
        exit 1
    fi
    
    # Check if branch already exists
    if branch_exists "$branch_name"; then
        log_error "Branch $branch_name already exists"
        exit 1
    fi
    
    # Ensure we're on main branch
    if [ "$(get_current_branch)" != "$MAIN_BRANCH" ]; then
        log_warning "Not on main branch. Switching to main..."
        git checkout "$MAIN_BRANCH"
    fi
    
    # Pull latest changes
    log_info "Pulling latest changes from main..."
    git pull origin "$MAIN_BRANCH"
    
    # Create and checkout hotfix branch
    git checkout -b "$branch_name"
    
    log_success "Hotfix branch created: $branch_name"
    log_info "You can now start fixing the issue!"
}

# Create release branch
create_release_branch() {
    local version="$1"
    local branch_name="${RELEASE_PREFIX}/${version}"
    
    log_step "Creating release branch: $branch_name"
    
    # Validate input
    if [ -z "$version" ]; then
        log_error "Version is required"
        exit 1
    fi
    
    # Check if branch already exists
    if branch_exists "$branch_name"; then
        log_error "Branch $branch_name already exists"
        exit 1
    fi
    
    # Ensure we're on main branch
    if [ "$(get_current_branch)" != "$MAIN_BRANCH" ]; then
        log_warning "Not on main branch. Switching to main..."
        git checkout "$MAIN_BRANCH"
    fi
    
    # Pull latest changes
    log_info "Pulling latest changes from main..."
    git pull origin "$MAIN_BRANCH"
    
    # Create and checkout release branch
    git checkout -b "$branch_name"
    
    # Update version in relevant files
    update_version "$version"
    
    log_success "Release branch created: $branch_name"
    log_info "You can now prepare for release!"
}

# Merge feature branch
merge_feature_branch() {
    local feature_name="$1"
    local branch_name="${FEATURE_PREFIX}/${feature_name}"
    
    log_step "Merging feature branch: $branch_name"
    
    # Validate input
    if [ -z "$feature_name" ]; then
        log_error "Feature name is required"
        exit 1
    fi
    
    # Check if branch exists
    if ! branch_exists "$branch_name"; then
        log_error "Branch $branch_name does not exist"
        exit 1
    fi
    
    # Ensure we're on main branch
    if [ "$(get_current_branch)" != "$MAIN_BRANCH" ]; then
        log_warning "Not on main branch. Switching to main..."
        git checkout "$MAIN_BRANCH"
    fi
    
    # Pull latest changes
    log_info "Pulling latest changes from main..."
    git pull origin "$MAIN_BRANCH"
    
    # Run tests on feature branch
    log_info "Running tests on feature branch..."
    git checkout "$branch_name"
    if [ -f "deployment/scripts/automated/ci_cd_pipeline.sh" ]; then
        deployment/scripts/automated/ci_cd_pipeline.sh
    fi
    
    # Switch back to main
    git checkout "$MAIN_BRANCH"
    
    # Merge feature branch
    log_info "Merging $branch_name into main..."
    git merge "$branch_name" --no-ff -m "Merge feature: $feature_name"
    
    # Push to remote
    log_info "Pushing to remote..."
    git push origin "$MAIN_BRANCH"
    
    # Delete feature branch
    log_info "Deleting feature branch..."
    git branch -d "$branch_name"
    git push origin --delete "$branch_name" 2>/dev/null || true
    
    log_success "Feature branch merged successfully!"
}

# Deploy feature branch
deploy_feature_branch() {
    local feature_name="$1"
    local branch_name="${FEATURE_PREFIX}/${feature_name}"
    
    log_step "Deploying feature branch: $branch_name"
    
    # Validate input
    if [ -z "$feature_name" ]; then
        log_error "Feature name is required"
        exit 1
    fi
    
    # Check if branch exists
    if ! branch_exists "$branch_name"; then
        log_error "Branch $branch_name does not exist"
        exit 1
    fi
    
    # Switch to feature branch
    git checkout "$branch_name"
    
    # Run CI/CD pipeline for staging deployment
    if [ -f "deployment/scripts/automated/ci_cd_pipeline.sh" ]; then
        log_info "Running CI/CD pipeline for staging deployment..."
        deployment/scripts/automated/ci_cd_pipeline.sh
    else
        log_error "CI/CD pipeline script not found"
        exit 1
    fi
    
    log_success "Feature branch deployed to staging!"
}

# Test feature branch
test_feature_branch() {
    local feature_name="$1"
    local branch_name="${FEATURE_PREFIX}/${feature_name}"
    
    log_step "Testing feature branch: $branch_name"
    
    # Validate input
    if [ -z "$feature_name" ]; then
        log_error "Feature name is required"
        exit 1
    fi
    
    # Check if branch exists
    if ! branch_exists "$branch_name"; then
        log_error "Branch $branch_name does not exist"
        exit 1
    fi
    
    # Switch to feature branch
    git checkout "$branch_name"
    
    # Run tests
    log_info "Running test suite..."
    if [ -f "test_reorganized_deployment.py" ]; then
        python test_reorganized_deployment.py
    fi
    
    # Run any other test scripts
    for test_script in tests/*.py; do
        if [ -f "$test_script" ] && [ "$test_script" != "tests/__init__.py" ]; then
            log_info "Running $test_script..."
            python "$test_script"
        fi
    done
    
    log_success "Feature branch tests completed!"
}

# List all feature branches
list_branches() {
    log_step "Listing all feature branches..."
    
    echo -e "${CYAN}Feature Branches:${NC}"
    git branch | grep "$FEATURE_PREFIX/" | sed 's/^[ *]*//' || echo "No feature branches found"
    
    echo -e "\n${CYAN}Hotfix Branches:${NC}"
    git branch | grep "$HOTFIX_PREFIX/" | sed 's/^[ *]*//' || echo "No hotfix branches found"
    
    echo -e "\n${CYAN}Release Branches:${NC}"
    git branch | grep "$RELEASE_PREFIX/" | sed 's/^[ *]*//' || echo "No release branches found"
}

# Clean up merged branches
cleanup_branches() {
    log_step "Cleaning up merged feature branches..."
    
    # Get list of merged feature branches
    local merged_branches=$(git branch --merged main | grep "$FEATURE_PREFIX/" | sed 's/^[ *]*//')
    
    if [ -z "$merged_branches" ]; then
        log_info "No merged feature branches to clean up"
        return 0
    fi
    
    echo "The following merged feature branches will be deleted:"
    echo "$merged_branches"
    echo ""
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for branch in $merged_branches; do
            log_info "Deleting $branch..."
            git branch -d "$branch"
            git push origin --delete "$branch" 2>/dev/null || true
        done
        log_success "Cleanup completed!"
    else
        log_info "Cleanup cancelled"
    fi
}

# Create feature development checklist
create_feature_checklist() {
    local feature_name="$1"
    local checklist_file="docs/features/${feature_name}_checklist.md"
    
    mkdir -p "docs/features"
    
    cat > "$checklist_file" << EOF
# Feature Development Checklist: $feature_name

## Development Phase
- [ ] Write feature specification
- [ ] Create feature branch: \`feature/$feature_name\`
- [ ] Implement core functionality
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update documentation
- [ ] Test locally

## Testing Phase
- [ ] Run full test suite
- [ ] Deploy to staging environment
- [ ] Perform manual testing
- [ ] Fix any issues found
- [ ] Get code review approval

## Deployment Phase
- [ ] Merge to main branch
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Update project documentation
- [ ] Close feature ticket

## Notes
- Feature branch: \`feature/$feature_name\`
- Created: $(date)
- Developer: $(git config user.name)

EOF
    
    log_info "Feature checklist created: $checklist_file"
}

# Update version in files
update_version() {
    local version="$1"
    
    # Update version in main.py if it exists
    if [ -f "main.py" ]; then
        sed -i.bak "s/version = '.*'/version = '$version'/" main.py 2>/dev/null || true
    fi
    
    # Update version in README.md if it exists
    if [ -f "README.md" ]; then
        sed -i.bak "s/Version: .*/Version: $version/" README.md 2>/dev/null || true
    fi
    
    log_info "Version updated to $version"
}

# Main function
main() {
    validate_git_repo
    
    case "$1" in
        "create-feature")
            create_feature_branch "$2"
            ;;
        "create-hotfix")
            create_hotfix_branch "$2"
            ;;
        "create-release")
            create_release_branch "$2"
            ;;
        "merge-feature")
            merge_feature_branch "$2"
            ;;
        "merge-hotfix")
            merge_hotfix_branch "$2"
            ;;
        "merge-release")
            merge_release_branch "$2"
            ;;
        "deploy-feature")
            deploy_feature_branch "$2"
            ;;
        "test-feature")
            test_feature_branch "$2"
            ;;
        "list-branches")
            list_branches
            ;;
        "cleanup-branches")
            cleanup_branches
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 