#!/bin/bash

# Repository Cleanup Script for Chord-Lab
# This script helps identify and clean up stale branches and consolidate pull requests

set -e

echo "🧹 Chord Lab Repository Cleanup Script"
echo "======================================="

# Configuration
REPO_OWNER="Mr-Gill"
REPO_NAME="Chord-Lab"
MAIN_BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if gh CLI is available
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed or not in PATH"
        log_info "Please install GitHub CLI: https://cli.github.com/"
        exit 1
    fi
    
    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI is not authenticated"
        log_info "Please run: gh auth login"
        exit 1
    fi
}

# Analysis functions
analyze_branches() {
    log_info "Analyzing branches..."
    
    echo "📊 Branch Analysis Report"
    echo "========================"
    
    # Get all branches
    all_branches=$(git branch -r --format='%(refname:short)' | grep -v HEAD | sed 's/origin\///')
    total_branches=$(echo "$all_branches" | wc -l)
    
    echo "Total branches: $total_branches"
    echo ""
    
    # Categorize branches
    codex_branches=$(echo "$all_branches" | grep "^codex/" | wc -l)
    copilot_branches=$(echo "$all_branches" | grep "^copilot/" | wc -l)
    feature_branches=$(echo "$all_branches" | grep -E "^(feat|feature)/" | wc -l)
    
    echo "📈 Branch Categories:"
    echo "  • Codex branches (automated): $codex_branches"
    echo "  • Copilot fix branches: $copilot_branches"
    echo "  • Feature branches: $feature_branches"
    echo "  • Other branches: $((total_branches - codex_branches - copilot_branches - feature_branches))"
    echo ""
    
    # Find potentially stale branches
    echo "🕰️  Potentially Stale Branches (>30 days old):"
    stale_count=0
    for branch in $all_branches; do
        if [ "$branch" != "$MAIN_BRANCH" ]; then
            # Get last commit date for branch
            last_commit_date=$(git log -1 --format=%ct "origin/$branch" 2>/dev/null || echo "0")
            current_date=$(date +%s)
            days_old=$(( (current_date - last_commit_date) / 86400 ))
            
            if [ $days_old -gt 30 ]; then
                echo "  • $branch ($days_old days old)"
                ((stale_count++))
            fi
        fi
    done
    
    if [ $stale_count -eq 0 ]; then
        echo "  None found"
    fi
    echo ""
}

analyze_pull_requests() {
    log_info "Analyzing pull requests..."
    
    echo "📋 Pull Request Analysis Report"
    echo "==============================="
    
    # Get open PRs using gh CLI
    pr_data=$(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open --json number,title,isDraft,author,createdAt,headRefName)
    
    echo "$pr_data" | jq -r '
        "Total open PRs: " + (length | tostring) + "\n" +
        "\n📊 PR Categories:" +
        "\n  • Draft PRs: " + ([.[] | select(.isDraft)] | length | tostring) +
        "\n  • Ready for review: " + ([.[] | select(.isDraft | not)] | length | tostring) +
        "\n\n📝 Open PRs:" +
        "\n" + 
        (.[] | "  • #" + (.number | tostring) + " - " + .title + 
         (if .isDraft then " (DRAFT)" else "" end) +
         " [" + .headRefName + "]")
    '
    echo ""
}

# Cleanup functions
identify_safe_deletions() {
    log_info "Identifying branches safe for deletion..."
    
    echo "🔍 Safe Deletion Candidates"
    echo "==========================="
    
    # Branches that can likely be deleted safely:
    # 1. Codex branches that are >7 days old and have no open PRs
    # 2. Merged branches (if we can detect them)
    # 3. Copilot fix branches with no open PRs
    
    all_branches=$(git branch -r --format='%(refname:short)' | grep -v HEAD | sed 's/origin\///')
    open_pr_branches=$(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open --json headRefName | jq -r '.[].headRefName')
    
    safe_deletions=()
    
    for branch in $all_branches; do
        if [ "$branch" = "$MAIN_BRANCH" ]; then
            continue
        fi
        
        # Check if branch has open PR
        has_open_pr=false
        for pr_branch in $open_pr_branches; do
            if [ "$branch" = "$pr_branch" ]; then
                has_open_pr=true
                break
            fi
        done
        
        if [ "$has_open_pr" = "false" ]; then
            # Check if it's a codex branch older than 7 days
            if echo "$branch" | grep -q "^codex/"; then
                last_commit_date=$(git log -1 --format=%ct "origin/$branch" 2>/dev/null || echo "0")
                current_date=$(date +%s)
                days_old=$(( (current_date - last_commit_date) / 86400 ))
                
                if [ $days_old -gt 7 ]; then
                    safe_deletions+=("$branch")
                fi
            fi
            
            # Check if it's a copilot fix branch with no open PR
            if echo "$branch" | grep -q "^copilot/fix-"; then
                safe_deletions+=("$branch")
            fi
        fi
    done
    
    if [ ${#safe_deletions[@]} -eq 0 ]; then
        echo "No branches identified as safe for automatic deletion."
    else
        echo "Branches recommended for deletion:"
        for branch in "${safe_deletions[@]}"; do
            echo "  • $branch"
        done
        echo ""
        echo "To delete these branches:"
        echo "git push origin --delete branch_name"
    fi
    echo ""
}

suggest_pr_consolidation() {
    log_info "Analyzing PR consolidation opportunities..."
    
    echo "🔄 PR Consolidation Suggestions"
    echo "==============================="
    
    # Get PR data with more details
    pr_data=$(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open --json number,title,isDraft,headRefName,labels)
    
    echo "Related PRs that could be consolidated:"
    echo ""
    
    # Group piano diagram related PRs
    piano_prs=$(echo "$pr_data" | jq -r '.[] | select(.title | test("piano|Piano")) | "#" + (.number | tostring) + " - " + .title')
    if [ -n "$piano_prs" ]; then
        echo "🎹 Piano Diagram Related PRs:"
        echo "$piano_prs" | sed 's/^/  • /'
        echo "  → Consider consolidating these piano-related changes"
        echo ""
    fi
    
    # Group code quality PRs
    quality_prs=$(echo "$pr_data" | jq -r '.[] | select(.title | test("ESLint|TypeScript|CI|test")) | "#" + (.number | tostring) + " - " + .title')
    if [ -n "$quality_prs" ]; then
        echo "🔧 Code Quality PRs:"
        echo "$quality_prs" | sed 's/^/  • /'
        echo "  → These could be merged in sequence: TypeScript fixes → ESLint fixes → CI fixes"
        echo ""
    fi
    
    # Identify draft PRs that might be ready
    draft_prs=$(echo "$pr_data" | jq -r '.[] | select(.isDraft) | "#" + (.number | tostring) + " - " + .title')
    if [ -n "$draft_prs" ]; then
        echo "📝 Draft PRs to Review:"
        echo "$draft_prs" | sed 's/^/  • /'
        echo "  → Review these for potential promotion to ready-for-review"
        echo ""
    fi
}

generate_cleanup_commands() {
    log_info "Generating cleanup commands..."
    
    echo "🛠️  Cleanup Command Reference"
    echo "============================="
    echo ""
    echo "# Branch Deletion Commands"
    echo "# (Review each branch before deleting!)"
    echo ""
    
    # Generate commands for stale codex branches
    all_branches=$(git branch -r --format='%(refname:short)' | grep -v HEAD | sed 's/origin\///')
    open_pr_branches=$(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open --json headRefName | jq -r '.[].headRefName')
    
    for branch in $all_branches; do
        if [ "$branch" = "$MAIN_BRANCH" ]; then
            continue
        fi
        
        # Check if branch has open PR
        has_open_pr=false
        for pr_branch in $open_pr_branches; do
            if [ "$branch" = "$pr_branch" ]; then
                has_open_pr=true
                break
            fi
        done
        
        if [ "$has_open_pr" = "false" ] && echo "$branch" | grep -q "^codex/"; then
            last_commit_date=$(git log -1 --format=%ct "origin/$branch" 2>/dev/null || echo "0")
            current_date=$(date +%s)
            days_old=$(( (current_date - last_commit_date) / 86400 ))
            
            if [ $days_old -gt 7 ]; then
                echo "# Delete $branch (${days_old} days old, no open PR)"
                echo "git push origin --delete $branch"
                echo ""
            fi
        fi
    done
    
    echo "# PR Management Commands"
    echo "# ======================"
    echo ""
    echo "# To close a PR:"
    echo "# gh pr close PR_NUMBER --comment \"Reason for closing\""
    echo ""
    echo "# To merge a ready PR:"
    echo "# gh pr merge PR_NUMBER --squash"
    echo ""
    echo "# To convert draft to ready:"
    echo "# gh pr ready PR_NUMBER"
    echo ""
}

create_cleanup_plan() {
    log_info "Creating comprehensive cleanup plan..."
    
    cat > CLEANUP_PLAN.md << EOF
# Chord Lab Repository Cleanup Plan
Generated on: $(date)

## Current Status
- **Total Branches**: $(git branch -r | grep -v HEAD | wc -l)
- **Open Pull Requests**: $(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open | wc -l)

## Cleanup Goals
- **Target Branches**: Reduce to 10-15 active branches
- **Target PRs**: Reduce to 2-3 active PRs
- **Maintain**: Code quality and stability

## Phase 1: Branch Cleanup (Safe Deletions)

### Automated Codex Branches (Stale)
These branches are older than 7 days and have no open PRs:

$(
    all_branches=$(git branch -r --format='%(refname:short)' | grep -v HEAD | sed 's/origin\///')
    open_pr_branches=$(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open --json headRefName | jq -r '.[].headRefName')
    
    for branch in $all_branches; do
        if [ "$branch" = "$MAIN_BRANCH" ]; then
            continue
        fi
        
        has_open_pr=false
        for pr_branch in $open_pr_branches; do
            if [ "$branch" = "$pr_branch" ]; then
                has_open_pr=true
                break
            fi
        done
        
        if [ "$has_open_pr" = "false" ] && echo "$branch" | grep -q "^codex/"; then
            last_commit_date=$(git log -1 --format=%ct "origin/$branch" 2>/dev/null || echo "0")
            current_date=$(date +%s)
            days_old=$(( (current_date - last_commit_date) / 86400 ))
            
            if [ $days_old -gt 7 ]; then
                echo "- [ ] \`$branch\` (${days_old} days old)"
            fi
        fi
    done
)

## Phase 2: Pull Request Consolidation

### Code Quality PRs (Merge in sequence)
$(echo "$(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open --json number,title | jq -r '.[] | select(.title | test("TypeScript|ESLint|CI")) | "- [ ] #" + (.number | tostring) + " - " + .title')")

### Feature PRs (Review individually)
$(echo "$(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open --json number,title | jq -r '.[] | select(.title | test("feat|style|refactor")) | "- [ ] #" + (.number | tostring) + " - " + .title')")

## Phase 3: Execution Steps

1. **Review and test each PR** before merging
2. **Delete stale branches** after confirming no valuable changes
3. **Consolidate related changes** where appropriate
4. **Update main branch** to incorporate merged changes

## Commands Reference

### Delete stale branches:
\`\`\`bash
$(
    all_branches=$(git branch -r --format='%(refname:short)' | grep -v HEAD | sed 's/origin\///')
    open_pr_branches=$(gh pr list --repo "$REPO_OWNER/$REPO_NAME" --state open --json headRefName | jq -r '.[].headRefName')
    
    for branch in $all_branches; do
        if [ "$branch" = "$MAIN_BRANCH" ]; then
            continue
        fi
        
        has_open_pr=false
        for pr_branch in $open_pr_branches; do
            if [ "$branch" = "$pr_branch" ]; then
                has_open_pr=true
                break
            fi
        done
        
        if [ "$has_open_pr" = "false" ] && echo "$branch" | grep -q "^codex/"; then
            last_commit_date=$(git log -1 --format=%ct "origin/$branch" 2>/dev/null || echo "0")
            current_date=$(date +%s)
            days_old=$(( (current_date - last_commit_date) / 86400 ))
            
            if [ $days_old -gt 7 ]; then
                echo "git push origin --delete $branch"
            fi
        fi
    done
)
\`\`\`

### Merge ready PRs:
\`\`\`bash
# Replace PR_NUMBER with actual numbers
gh pr merge PR_NUMBER --squash --delete-branch
\`\`\`

## Success Metrics
- [ ] Branches reduced to target range (10-15)
- [ ] PRs reduced to target range (2-3)
- [ ] All tests passing
- [ ] Main branch stable
- [ ] No regression in functionality

---
*This cleanup plan was generated automatically. Review each action before execution.*
EOF

    log_success "Cleanup plan created: CLEANUP_PLAN.md"
}

# Main execution
main() {
    echo "Starting repository cleanup analysis..."
    echo ""
    
    # Check prerequisites
    check_gh_cli
    
    # Fetch latest data
    log_info "Fetching latest repository data..."
    git fetch origin >/dev/null 2>&1
    
    # Run analysis
    analyze_branches
    analyze_pull_requests
    identify_safe_deletions
    suggest_pr_consolidation
    generate_cleanup_commands
    create_cleanup_plan
    
    echo ""
    log_success "Cleanup analysis complete!"
    echo ""
    echo "📄 Review the generated CLEANUP_PLAN.md file for detailed steps."
    echo "⚠️  Always test and review before executing any deletion commands."
    echo ""
    echo "Next steps:"
    echo "1. Review CLEANUP_PLAN.md"
    echo "2. Test PRs in staging environment"
    echo "3. Execute cleanup commands carefully"
    echo "4. Monitor for any issues"
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi