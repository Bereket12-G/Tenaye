#!/bin/bash

# 🚀 Challenge Portal Deployment Script
# This script helps you deploy your React app to Vercel and GitHub Pages

set -e

echo "🚀 Challenge Portal Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not found. Please initialize git first."
    exit 1
fi

# Function to build the project
build_project() {
    print_status "Building the project..."
    npm run build
    print_success "Build completed successfully!"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please login first:"
        echo "vercel login"
        return 1
    fi
    
    # Deploy to Vercel
    vercel --prod
    print_success "Deployed to Vercel successfully!"
}

# Function to deploy to GitHub Pages
deploy_github_pages() {
    print_status "Preparing for GitHub Pages deployment..."
    
    # Check if homepage is set in package.json
    if ! grep -q '"homepage"' package.json; then
        print_warning "Homepage not set in package.json. Please update it with your GitHub Pages URL."
        echo "Example: \"homepage\": \"https://YOUR_USERNAME.github.io/YOUR_REPO_NAME\""
        return 1
    fi
    
    # Check if GitHub Actions workflow exists
    if [ ! -f ".github/workflows/deploy.yml" ]; then
        print_error "GitHub Actions workflow not found. Please ensure .github/workflows/deploy.yml exists."
        return 1
    fi
    
    # Commit and push changes
    print_status "Committing and pushing changes..."
    git add .
    git commit -m "Deploy to GitHub Pages" || true
    git push origin main
    
    print_success "Changes pushed to GitHub. GitHub Actions will handle the deployment."
    print_status "Check the Actions tab in your GitHub repository to monitor deployment progress."
}

# Function to show deployment status
show_status() {
    print_status "Checking deployment status..."
    
    # Check if build works
    if npm run build &> /dev/null; then
        print_success "✅ Build test passed"
    else
        print_error "❌ Build test failed"
        return 1
    fi
    
    # Check if linting passes
    if npm run lint &> /dev/null; then
        print_success "✅ Linting passed"
    else
        print_warning "⚠️  Linting issues found"
    fi
    
    # Check TypeScript
    if npx tsc --noEmit &> /dev/null; then
        print_success "✅ TypeScript check passed"
    else
        print_error "❌ TypeScript errors found"
        return 1
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  build     - Build the project"
    echo "  vercel    - Deploy to Vercel"
    echo "  github    - Deploy to GitHub Pages"
    echo "  status    - Check deployment status"
    echo "  all       - Build and deploy to both platforms"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 vercel"
    echo "  $0 github"
    echo "  $0 all"
}

# Main script logic
case "${1:-help}" in
    "build")
        build_project
        ;;
    "vercel")
        build_project
        deploy_vercel
        ;;
    "github")
        build_project
        deploy_github_pages
        ;;
    "status")
        show_status
        ;;
    "all")
        build_project
        deploy_vercel
        deploy_github_pages
        ;;
    "help"|*)
        show_help
        ;;
esac

echo ""
print_success "Deployment script completed!"