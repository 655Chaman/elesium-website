#!/usr/bin/env bash
# ==============================================================================
# Sovereign Enterprise AI Benchmarks — Standalone GitHub Deployment Script
# Author: Elesium Digital Systems (https://elesium.online)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "========================================================================"
echo "🔱 [ELESIUM] Sovereign Enterprise AI Benchmarks — Repository Publisher"
echo "Working Directory: ${SCRIPT_DIR}"
echo "========================================================================"

# Check git availability
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed. Please install git to proceed."
    exit 1
fi

# Initialize standalone git repository if not present
if [ ! -d ".git" ]; then
    echo "📦 Initializing standalone git repository..."
    git init -b main
else
    echo "ℹ️ Existing git repository detected."
fi

# Ensure .gitignore exists for this standalone repo
if [ ! -f ".gitignore" ]; then
    cat << 'EOF' > .gitignore
__pycache__/
*.py[cod]
*$py.class
.DS_Store
.env
.venv
env/
venv/
outlines_cache/
*.log
EOF
    echo "📄 Created default .gitignore"
fi

# Stage files
echo "📝 Staging repository assets..."
git add .

# Check if there are changes to commit
if git status --porcelain | grep -q .; then
    echo "💾 Creating initial release commit..."
    git commit -m "feat(benchmarks): initial release of sovereign enterprise ai benchmarks & production specs"
else
    echo "ℹ️ No uncommitted changes detected."
fi

# GitHub Remote Setup
REMOTE_EXISTS=$(git remote get-url origin 2>/dev/null || true)

if [ -n "${REMOTE_EXISTS}" ]; then
    echo "🔗 Found existing git remote origin: ${REMOTE_EXISTS}"
    read -r -p "Do you want to push to this remote? [Y/n]: " CONFIRM_PUSH
    CONFIRM_PUSH=${CONFIRM_PUSH:-Y}
    if [[ "${CONFIRM_PUSH}" =~ ^[Yy]$ ]]; then
        echo "🚀 Pushing to origin main..."
        git push -u origin main
        echo "✅ Successfully pushed to GitHub!"
        exit 0
    fi
fi

# Check if GitHub CLI (gh) is installed
if command -v gh &> /dev/null && gh auth status &> /dev/null; then
    echo "🐙 GitHub CLI (gh) detected and authenticated."
    read -r -p "Create a new public repository via GitHub CLI? [Y/n]: " USE_GH
    USE_GH=${USE_GH:-Y}
    if [[ "${USE_GH}" =~ ^[Yy]$ ]]; then
        read -r -p "Enter repository name [sovereign-enterprise-ai-benchmarks]: " REPO_NAME
        REPO_NAME=${REPO_NAME:-sovereign-enterprise-ai-benchmarks}
        echo "🚀 Creating and pushing to GitHub: ${REPO_NAME}..."
        gh repo create "${REPO_NAME}" --public --source=. --remote=origin --push
        echo "✅ Repository created and pushed successfully: https://github.com/$(gh api user -q .login)/${REPO_NAME}"
        exit 0
    fi
fi

# Fallback: Prompt for remote repository URL
echo ""
echo "Please provide your GitHub remote repository URL."
echo "Example: git@github.com:your-organization/sovereign-enterprise-ai-benchmarks.git"
read -r -p "Repository Remote URL: " REMOTE_URL

if [ -z "${REMOTE_URL}" ]; then
    echo "❌ Error: Remote URL cannot be empty. Aborting push."
    exit 1
fi

if git remote get-url origin &> /dev/null; then
    git remote set-url origin "${REMOTE_URL}"
else
    git remote add origin "${REMOTE_URL}"
fi

echo "🚀 Pushing branch 'main' to ${REMOTE_URL}..."
git push -u origin main

echo "========================================================================"
echo "✅ [SUCCESS] Sovereign Enterprise AI Benchmarks published to GitHub!"
echo "Visit: https://elesium.online/solutions for continuous integration specs."
echo "========================================================================"
