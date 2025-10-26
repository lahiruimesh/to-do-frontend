# TodoMaster Frontend - Docker Build Guide

## 🐳 Docker Build Process

### Prerequisites
- Docker Engine 20.10+
- Linux environment with Bash
- Git

### Build Commands

```bash
# Clone the frontend repository
git clone <your-frontend-repo-url>
cd todo-frontend

# Build the Docker image
docker build -t todomaster-frontend:latest .

# Or build with specific version tag
docker build -t todomaster-frontend:v1.0.0 .
```

### Build Arguments

You can customize the build with build arguments:

```bash
# Build with custom API URL
docker build \
  --build-arg REACT_APP_API_URL=https://your-api.com/api \
  -t todomaster-frontend:latest .
```

### Run Locally for Testing

```bash
# Run frontend container
docker run -d \
  --name todo-frontend \
  -p 3000:80 \
  todomaster-frontend:latest

# Access at http://localhost:3000
```

### Environment Configuration

The frontend can be configured with these environment variables:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

### Multi-Stage Build Process

The Dockerfile uses multi-stage builds for optimization:
1. **Build Stage**: Compiles React app
2. **Production Stage**: Serves static files with Nginx

### Nginx Configuration

Custom nginx.conf included for:
- React Router support (SPA routing)
- Gzip compression
- Security headers
- Static asset caching
- Performance optimization

### Build for Different Platforms

```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t todomaster-frontend:latest .

# Build for specific platform
docker build --platform linux/amd64 -t todomaster-frontend:latest .
```

### Features Included

- ✨ Welcome page with TodoMaster branding
- 🎨 Glassmorphic UI design
- 📱 Responsive design
- ⚡ Fast loading with optimized builds
- 🔒 Security headers configured