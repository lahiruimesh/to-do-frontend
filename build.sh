#!/bin/bash
# TodoMaster Frontend - Docker Build Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="todomaster-frontend"
DEFAULT_TAG="latest"
PLATFORMS="linux/amd64,linux/arm64"
DEFAULT_API_URL="http://localhost:5000/api"

print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  TodoMaster Frontend - Docker Build Script${NC}"
    echo -e "${BLUE}================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Function to build single platform
build_single() {
    local tag=${1:-$DEFAULT_TAG}
    local api_url=${2:-$DEFAULT_API_URL}
    
    print_info "Building ${IMAGE_NAME}:${tag} for current platform..."
    print_info "API URL: ${api_url}"
    
    docker build \
        --build-arg REACT_APP_API_URL="${api_url}" \
        -t "${IMAGE_NAME}:${tag}" \
        .
    
    if [ $? -eq 0 ]; then
        print_success "Built ${IMAGE_NAME}:${tag}"
        echo
        print_info "Image size:"
        docker images "${IMAGE_NAME}:${tag}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
        echo
        print_info "To run the container:"
        echo "docker run -d --name todo-frontend -p 3000:80 ${IMAGE_NAME}:${tag}"
        echo
        print_info "Then access at: http://localhost:3000"
    else
        print_error "Build failed!"
        exit 1
    fi
}

# Function to build multi-platform
build_multiplatform() {
    local tag=${1:-$DEFAULT_TAG}
    local api_url=${2:-$DEFAULT_API_URL}
    
    print_info "Building ${IMAGE_NAME}:${tag} for multiple platforms..."
    print_info "Platforms: ${PLATFORMS}"
    print_info "API URL: ${api_url}"
    
    # Check if buildx is available
    if ! docker buildx version >/dev/null 2>&1; then
        print_error "Docker Buildx not available. Install Docker Buildx for multi-platform builds."
        exit 1
    fi
    
    # Create builder if it doesn't exist
    docker buildx create --name todobuilder --use 2>/dev/null || docker buildx use todobuilder
    
    docker buildx build \
        --platform "${PLATFORMS}" \
        --build-arg REACT_APP_API_URL="${api_url}" \
        -t "${IMAGE_NAME}:${tag}" \
        --push \
        .
    
    if [ $? -eq 0 ]; then
        print_success "Built and pushed ${IMAGE_NAME}:${tag} for multiple platforms"
        print_info "Platforms: ${PLATFORMS}"
        print_info "API URL configured: ${api_url}"
    else
        print_error "Multi-platform build failed!"
        exit 1
    fi
}

# Function to build development version
build_dev() {
    local api_url=${1:-$DEFAULT_API_URL}
    
    print_info "Building development version with API URL: ${api_url}"
    
    docker build \
        --build-arg REACT_APP_API_URL="${api_url}" \
        -t "${IMAGE_NAME}:dev" \
        .
    
    if [ $? -eq 0 ]; then
        print_success "Built ${IMAGE_NAME}:dev"
        print_info "Starting container on port 3000..."
        
        # Stop existing dev container if running
        docker stop todo-frontend-dev 2>/dev/null || true
        docker rm todo-frontend-dev 2>/dev/null || true
        
        # Start new container
        docker run -d --name todo-frontend-dev -p 3000:80 "${IMAGE_NAME}:dev"
        
        print_success "Frontend development server running at http://localhost:3000"
    else
        print_error "Development build failed!"
        exit 1
    fi
}

# Main script
print_header

case "${1:-single}" in
    "single")
        build_single "${2}" "${3}"
        ;;
    "multi")
        build_multiplatform "${2}" "${3}"
        ;;
    "dev")
        build_dev "${2}"
        ;;
    *)
        echo "Usage: $0 {single|multi|dev} [tag] [api_url]"
        echo
        echo "Commands:"
        echo "  single [tag] [api_url]  - Build for current platform"
        echo "  multi [tag] [api_url]   - Build for multiple platforms and push"
        echo "  dev [api_url]          - Build and run development version"
        echo
        echo "Parameters:"
        echo "  tag       - Docker image tag (default: latest)"
        echo "  api_url   - Backend API URL (default: http://localhost:5000/api)"
        echo
        echo "Examples:"
        echo "  $0 single                                    # Build with default settings"
        echo "  $0 single v1.0.0                           # Build with version tag"
        echo "  $0 single latest https://api.example.com    # Build with custom API"
        echo "  $0 multi v1.0.0 https://api.example.com    # Multi-platform build"
        echo "  $0 dev https://api.example.com              # Development build"
        exit 1
        ;;
esac