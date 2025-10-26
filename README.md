# TodoMaster Frontend

A modern, responsive React frontend for the TodoMaster task management application with glassmorphic UI design and Docker support.

##  Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)

##  Installation & Setup

### Local Development

```bash
# Clone the repository
git clone https://github.com/lahiruimesh/todo-frontend.git
cd todo-frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env
# Edit REACT_APP_API_URL if needed

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

##  Docker Deployment

### Using Docker Compose (Recommended)

The frontend includes a `docker-compose.yml` for easy deployment:

```bash
# Ensure backend network exists (if using separate backend)
docker network create todo-network

# Start the frontend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop service
docker-compose down
```

### Build Docker Image

```bash
# Build with default API URL
docker build -t todomaster-frontend:latest .

# Build with custom API URL
docker build --build-arg REACT_APP_API_URL=https://api.example.com/api -t todomaster-frontend:latest .

# Or use the build script
chmod +x build.sh
./build.sh single latest https://api.example.com/api
```

### Run with Docker

```bash
# Run the container
docker run -d \
  --name todomaster-frontend \
  -p 80:80 \
  todomaster-frontend:latest

# Access at http://localhost
```

### Docker Hub Image

```bash
# Pull from Docker Hub
docker pull lahiruimesh/todomasterfrontend:v1.0.0

# Run the official image
docker run -d \
  --name todomaster-frontend \
  -p 80:80 \
  lahiruimesh/todomasterfrontend:v1.0.0
```

##  Features

### User Experience
-  **Welcome Page**: Animated welcome screen with 5-second auto-redirect
-  **Modern UI**: Glassmorphic design with gradient backgrounds
-  **Responsive Design**: Works perfectly on all device sizes
-  **Branded Experience**: TodoMaster logo integration throughout
-  **Fast Loading**: Optimized React builds with code splitting

### Task Management
-  **Create Tasks**: Easy task creation with title and description
-  **Edit Tasks**: In-place editing functionality
-  **Complete Tasks**: One-click "Done" button (no checkboxes)
-  **Delete Tasks**: Remove unwanted tasks
-  **Smart Display**: Shows only last 5 pending tasks
-  **Auto-refresh**: Automatic updates every 30 seconds

### Technical Features
-  **Component Architecture**: Modular React components
-  **State Management**: React hooks for efficient state handling
-  **API Integration**: Axios for backend communication
-  **Error Handling**: Comprehensive error boundaries
-  **Environment Config**: Configurable API endpoints

##  Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |

### Example .env file

```env
REACT_APP_API_URL=http://localhost:5000/api
```

##  Available Scripts

### Development
```bash
npm start          # Start development server (port 3000)
npm test           # Run test suite
npm run build      # Create production build
npm run eject      # Eject from Create React App (not recommended)
```

### Docker Build Scripts
```bash
# Build for current platform
./build.sh single [tag] [api_url]

# Build for multiple platforms  
./build.sh multi [tag] [api_url]

# Build and run development version
./build.sh dev [api_url]
```

### Examples
```bash
# Development build with custom API
./build.sh dev https://dev-api.example.com/api

# Production build with version tag
./build.sh single v1.0.0 https://api.example.com/api

# Multi-platform build and push
./build.sh multi v1.0.0 https://api.example.com/api
```

##  Project Structure

```
src/
├── components/
│   ├── WelcomePage.js     # Animated welcome screen
│   ├── TodoForm.js        # Task creation form
│   ├── TodoItem.js        # Individual task component
│   └── TodoList.js        # Task list container
├── services/
│   └── api.js             # API service layer
├── assets/
│   └── todoMaster.png     # Brand logo
├── App.js                 # Main application component
├── index.js               # Application entry point
└── index.css              # Global styles
public/
├── todoMaster.png         # Public logo asset
├── index.html             # HTML template
└── manifest.json          # PWA manifest
```

##  UI Components

### WelcomePage
- Animated TodoMaster logo with rotation effects
- Progressive welcome messages during countdown
- Auto-redirect after 5 seconds
- Skip functionality for immediate access
- Glassmorphic design with floating elements

### TodoForm  
- Clean input design with validation
- Title and description fields
- Real-time validation feedback
- Loading states during submission

### TodoItem
- Glassmorphic card design with gradients
- Hover animations and micro-interactions
- "Done" button for task completion
- Edit and delete functionality
- Responsive layout for all screen sizes

### TodoList
- Container for all TodoItem components
- Loading states and error handling
- Empty state messaging
- Automatic refresh functionality

##  Customization

### Styling
The application uses Tailwind CSS for styling:

```bash
# Customize theme in tailwind.config.js
# Add custom components in src/index.css
# Modify component styles directly in JSX
```

### API Integration
Configure the backend connection:

```javascript
// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Welcome Page
Customize the welcome experience:

```javascript
// src/components/WelcomePage.js
const welcomeSteps = [
  "Welcome to TodoMaster",
  "Your productivity companion", 
  "Ready to get organized?"
];
```

##  Production Deployment

### Build Optimization
```bash
# Create optimized production build
npm run build

# Serve with a static server
npx serve -s build -l 3000
```

### Docker Production
```bash
# Multi-stage Docker build for optimization
docker build -t todomaster-frontend:prod .

# The image includes:
# - Optimized React build
# - Nginx with gzip compression
# - Security headers
# - Static asset caching
```

## Browser Support

-  Chrome (latest)
-  Firefox (latest)  
-  Safari (latest)
-  Edge (latest)
-  Mobile browsers (iOS Safari, Chrome Mobile)

##  Technologies Used

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **React Hooks** - State management
- **Create React App** - Build toolchain
- **Docker** - Containerization
- **Nginx** - Production web server

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

##  License

This project is licensed under the MIT License.

##  Support

- **Issues**: [GitHub Issues](https://github.com/lahiruimesh/todo-frontend/issues)
- **Live Demo**: [TodoMaster App](http://localhost:3000)
- **Docker Hub**: [lahiruimesh/todomasterfrontend](https://hub.docker.com/r/lahiruimesh/todomasterfrontend)

---



### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
