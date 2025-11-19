# Intelligent Automation

A modern, full-stack web application demonstrating the capabilities of an Intelligent Automation Intern at . This internal tool manages automation projects, onboarding, surveys, documentation, and governance — all built with a React frontend and Express backend.

**🐳 Docker Ready** | Single-command deployment with Docker Compose | Production-optimized Nginx reverse proxy | All services on port 8080

## 🎯 Purpose

This application showcases how an automation intern could solve real-world problems using modern JavaScript technologies instead of Power Platform. It demonstrates:

- **Developer Onboarding Automation**: Track and manage platform onboarding tasks
- **Satisfaction Surveys**: Collect end-of-delivery feedback from stakeholders
- **AI-Driven Documentation**: Manage HOTs (Hands-On Tasks) with AI-assisted content generation
- **Work Item Tracking**: Monitor automation initiatives through their lifecycle
- **Governance & Compliance**: Manage policies, controls, and compliance checklists
- **SharePoint Integration**: Mock Microsoft Graph API integration for content management
- **Analytics Dashboard**: Visualize metrics and insights with interactive charts

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Tailwind CSS** - Utility-first styling
- **Vitest & React Testing Library** - Testing framework

### Backend
- **Node.js & Express** - RESTful API server
- **In-memory data store** - No database required (self-contained)
- **CORS enabled** - Frontend/backend communication
- **Morgan** - HTTP request logging
- **Jest & Supertest** - API testing

## 📁 Project Structure

```
intelligent_automation/
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/           # API endpoints
│   │   ├── models/           # Data models and store
│   │   ├── middleware/       # Error handling, etc.
│   │   └── server.js         # Main server file
│   ├── __tests__/            # Backend tests
│   └── package.json
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context (auth)
│   │   ├── services/         # API client
│   │   ├── __tests__/        # Frontend tests
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   └── package.json
│
├── package.json              # Root scripts
└── README.md                 # This file
```

## 🐳 Docker Deployment (Recommended)

The easiest way to run the application is using Docker Compose, which sets up everything with a single command.

### Prerequisites for Docker

- **Docker** >= 20.10.0
- **Docker Compose** >= 2.0.0

### Quick Start with Docker

1. **Clone the repository and navigate to it**
   ```bash
   cd intelligent_automation
   ```

2. **Use the automated start script (easiest)**
   ```bash
   ./start.sh
   ```

   The script automatically detects Docker and starts the application. If Docker isn't available, it falls back to development mode.

   **Or manually with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

   **Or using Make:**
   ```bash
   make up
   ```

3. **Access the application**

   Open your browser to **http://localhost:8080**

   Everything runs on a single port (8080)!
   - Frontend: Served by Nginx
   - Backend API: Proxied through Nginx at `/api/*`
   - Health check: `http://localhost:8080/health`

4. **View logs**
   ```bash
   docker-compose logs -f
   ```

   Or:
   ```bash
   make logs
   ```

5. **Stop the application**
   ```bash
   docker-compose down
   ```

   Or:
   ```bash
   make down
   ```

### Docker Architecture

The application uses a three-container architecture:

```
┌─────────────────────────────────────────┐
│  Nginx (Port 8080)                      │
│  - Serves React frontend                │
│  - Reverse proxy for /api/* → backend   │
│  - SSL/TLS ready                        │
│  - Gzip compression                     │
│  - Security headers                     │
└─────────────┬───────────────────────────┘
              │
       ┌──────┴──────┐
       ▼             ▼
┌─────────────┐  ┌──────────────┐
│  Frontend   │  │   Backend    │
│  (Built)    │  │   API        │
│  React +    │  │   Express    │
│  Vite       │  │   Node.js    │
└─────────────┘  └──────────────┘
```

**Key Features:**
- ✅ Single port exposure (8080)
- ✅ Production-optimized builds
- ✅ Health checks for all services
- ✅ Automatic restarts
- ✅ Network isolation
- ✅ Multi-stage builds for small images

### Available Make Commands

```bash
make help      # Show all available commands
make build     # Build Docker images (no cache)
make up        # Start all services
make down      # Stop all services
make restart   # Restart all services
make logs      # View service logs
make clean     # Remove all containers, images, volumes
make test      # Run tests (local)
make dev       # Run development mode (without Docker)
```

### Docker Environment Variables

Edit `docker-compose.yml` to customize:

```yaml
environment:
  - NODE_ENV=production
  - PORT=5000
  - CORS_ORIGIN=http://localhost:8080
  - GRAPH_TENANT_ID=your-tenant-id
  - GRAPH_CLIENT_ID=your-client-id
```

### Troubleshooting Docker

**Port already in use:**
```bash
# Change the port in docker-compose.yml
ports:
  - "3000:80"  # Change 8080 to 3000
```

**Rebuild after code changes:**
```bash
docker-compose up -d --build
```

**View container status:**
```bash
docker-compose ps
```

**Access container shell:**
```bash
docker exec -it automation-hub-backend sh
docker exec -it automation-hub-nginx sh
```

**Clean everything and start fresh:**
```bash
make clean
make build
make up
```

---

## 🚀 Local Development (Without Docker)

If you prefer to run the application locally without Docker:

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   cd intelligent_automation
   ```

2. **Install all dependencies** (root, server, and client)
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   ```bash
   # Server configuration
   cd server
   cp .env.example .env
   # Edit .env if needed (defaults work fine for local development)
   cd ..
   ```

### Running the Application

#### Option 1: Run Both Server and Client Together (Recommended)

```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Accessing the Application (Local Development)

1. Open your browser to **http://localhost:5173** (Vite dev server)
2. You'll be redirected to the login page
3. Use one of these demo accounts:

   | Username | Password | Role                    |
   |----------|----------|-------------------------|
   | intern   | demo     | Intern                  |
   | analyst  | demo     | Automation Analyst      |
   | lead     | demo     | Team Lead               |

4. Explore the features:
   - 📊 **Dashboard** - Overview with charts and metrics
   - 🚀 **Onboarding** - Manage developer onboarding tasks
   - 📝 **Surveys** - Submit and view satisfaction surveys
   - 📚 **Documentation** - Create docs with AI assistance
   - 📋 **Work Items** - Track projects (Kanban/List view)
   - 🛡️ **Governance** - Manage compliance checks
   - ☁️ **SharePoint** - Mock Graph API integration

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Backend Tests Only
```bash
npm run test:server
```

### Run Frontend Tests Only
```bash
npm run test:client
```

### Example Test Coverage

**Backend Test** (`server/__tests__/onboarding.test.js`):
- Tests CRUD operations for onboarding tasks
- Validates request/response formats
- Checks error handling

**Frontend Test** (`client/src/__tests__/StatCard.test.jsx`):
- Tests component rendering
- Validates props handling
- Checks UI states

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Onboarding Tasks
- `GET /api/onboarding-tasks` - List all tasks
- `POST /api/onboarding-tasks` - Create new task
- `PUT /api/onboarding-tasks/:id` - Update task
- `DELETE /api/onboarding-tasks/:id` - Delete task

### Surveys
- `GET /api/surveys` - List all surveys
- `GET /api/surveys/stats` - Get survey statistics
- `POST /api/surveys` - Submit new survey

### Documentation Tasks
- `GET /api/doc-tasks` - List all documentation tasks
- `POST /api/doc-tasks` - Create new doc task
- `PUT /api/doc-tasks/:id` - Update doc task
- `DELETE /api/doc-tasks/:id` - Delete doc task
- `POST /api/doc-tasks/ai-suggestion` - Generate AI suggestion

### Work Items
- `GET /api/work-items` - List all work items
- `POST /api/work-items` - Create new work item
- `PUT /api/work-items/:id` - Update work item
- `DELETE /api/work-items/:id` - Delete work item

### Governance
- `GET /api/governance-checks` - List all checks
- `POST /api/governance-checks` - Create new check
- `PUT /api/governance-checks/:id` - Update check
- `DELETE /api/governance-checks/:id` - Delete check

### SharePoint (Mock)
- `GET /api/sharepoint-migration/sites` - List SharePoint sites
- `GET /api/sharepoint-migration/sites/:id` - Get site details
- `GET /api/sharepoint-migration/sites/:id/content` - Get site content
- `GET /api/sharepoint-migration/config` - Get Graph API config

### Dashboard
- `GET /api/summary` - Get dashboard summary data

## 🔧 Configuration

### Server Configuration (`.env`)

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Microsoft Graph API (Mock - for demonstration only)
GRAPH_TENANT_ID=your-tenant-id-here
GRAPH_CLIENT_ID=your-client-id-here
GRAPH_BASE_URL=https://graph.microsoft.com/v1.0
```

### Frontend Configuration

The frontend automatically proxies API requests to the backend during development (configured in `vite.config.js`).

## 🎨 Key Features

### 1. Developer Onboarding Automation
- Create and track onboarding tasks
- Categorize by Access, Training, or Tools
- Update status and assign to developers
- Filter and search capabilities
- Visual statistics dashboard

### 2. Satisfaction Surveys
- Submit end-of-delivery feedback
- Rating system (1-5 stars)
- View average ratings and distribution
- Interactive charts for data visualization

### 3. AI-Driven Documentation
- Create documentation tasks
- Mock AI suggestion generator
- Status workflow (Draft → In Review → Approved)
- Link to automation work items
- Real-time documentation preview

### 4. Work Item Tracker
- Kanban board and list views
- Status tracking (Idea → Discovery → In Delivery → Live → On Hold)
- Priority management (Low, Medium, High)
- Target go-live date tracking
- Business owner assignment

### 5. Governance & Compliance
- Policy, Control, and Checklist management
- Status tracking and alerts
- Implementation monitoring
- Review date tracking

### 6. SharePoint Migration Tool
- Mock Microsoft Graph API integration
- Browse SharePoint sites
- View site content (folders/files)
- Demonstrates production-ready architecture
- Configuration guidance for real implementation

### 7. Analytics Dashboard
- Real-time metrics and KPIs
- Interactive charts (Bar, Pie)
- Recent activity feeds
- Upcoming deadlines
- Governance status overview

## 🔒 Security Notes

⚠️ **This is a demonstration application** - Not production-ready as-is!

For production deployment, you would need:
- Real authentication (OAuth, JWT, or similar)
- Database instead of in-memory storage
- Environment variable validation
- HTTPS/SSL certificates
- Rate limiting and security headers
- Input validation and sanitization
- Proper error logging
- User session management
- RBAC (Role-Based Access Control)

## 🚧 Limitations & Future Improvements

### Current Limitations
- In-memory data storage (resets on server restart)
- Mock authentication (no real security)
- Mock AI suggestions (no real AI integration)
- Mock Graph API (no real SharePoint connection)
- Limited error recovery
- No file upload/download
- No email notifications
- No audit logging

### Potential Improvements
1. **Database Integration**
   - PostgreSQL or MongoDB for persistent storage
   - Migrations and seed scripts
   - Proper indexing and queries

2. **Authentication & Authorization**
   - Azure AD / Entra ID integration
   - JWT token-based auth
   - Role-based permissions

3. **Real AI Integration**
   - OpenAI API for documentation generation
   - Azure OpenAI Service
   - Custom prompts and templates

4. **Microsoft Graph API**
   - Real SharePoint integration
   - File upload/download
   - Batch operations
   - Webhook subscriptions

5. **Enhanced Features**
   - Email notifications (SendGrid, etc.)
   - File attachments
   - Commenting system
   - Activity audit logs
   - Export to Excel/PDF
   - Advanced search and filtering

6. **DevOps & Deployment**
   - Docker containerization
   - CI/CD pipeline
   - Azure App Service deployment
   - Monitoring and logging (Application Insights)
   - Automated backups

## 📚 Learning Resources

### Microsoft Graph API
- [Graph API Overview](https://learn.microsoft.com/en-us/graph/overview)
- [SharePoint Sites API](https://learn.microsoft.com/en-us/graph/api/resources/sharepoint)
- [MSAL Authentication](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview)

### React & Vite
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

### Express
- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design](https://restfulapi.net/)

## 🤝 Contributing

This is a demonstration project, but if you'd like to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is for demonstration purposes. Use it as a template for your own projects.

## 👥 Credits

Built to demonstrate the capabilities of an Intelligent Automation Intern role at , showcasing modern full-stack JavaScript development skills.

---

**Note**: This application uses NO Power Platform technologies (no Power Apps, Power Automate, or Power BI). It's a pure JavaScript/React/Express implementation to demonstrate equivalent capabilities using open-source technologies.

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change PORT in server/.env
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

### API Connection Issues
- Ensure backend is running on port 5000
- Check CORS settings in `server/src/server.js`
- Verify proxy configuration in `client/vite.config.js`

### Build Errors
```bash
# Clear Vite cache
cd client
rm -rf node_modules/.vite
npm run build
```

---

**Happy Automating! 🤖✨**
