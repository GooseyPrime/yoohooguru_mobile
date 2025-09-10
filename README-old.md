
# yoohoo.guru Platform

A comprehensive skill-sharing platform where users exchange skills, discover purpose, and create exponential community impact through neighborhood-based connections.

## 🚀 Platform Overview

**Status: 🟢 ACTIVE** | **Version: 1.0.0** | **Architecture: Full Stack**

This is a modern, full-stack web application built with:
- **Frontend**: React with Webpack, styled-components, and PWA support
- **Backend**: Node.js with Express, Firebase integration, and comprehensive API
- **Configuration**: Environment-driven architecture for flexible deployment

### ✅ Key Features

- **🎯 Skill Sharing Marketplace** - Connect community members for skill exchange
- **🔐 Firebase Authentication** - Secure user management and authentication
- **💳 Stripe Integration** - Payment processing for premium features
- **🤖 AI-Powered Recommendations** - Smart skill matching using OpenRouter
- **📱 Progressive Web App** - Mobile-optimized with offline capabilities
- **🛡️ Enterprise Security** - Rate limiting, CORS protection, and input validation
- **⚙️ Environment-Driven Configuration** - Fully configurable via environment variables

## 📁 Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # Main page components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   └── utils/           # Frontend utilities
│   ├── public/              # Static assets
│   ├── webpack.config.js    # Webpack configuration
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── config/          # Configuration management
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Backend utilities
│   │   └── lib/             # Business logic libraries
│   ├── tests/               # Backend test suites
│   └── package.json         # Backend dependencies
├── docs/                     # Documentation
│   ├── ENVIRONMENT_VARIABLES.md  # Complete env var guide
│   ├── DEPLOYMENT.md         # Deployment instructions
│   ├── RAILWAY_DEPLOYMENT.md # Railway-specific guide
│   └── FIREBASE_POLICY.md    # Firebase usage policy & standards
├── .env.example             # Environment variables template
├── package.json             # Root workspace configuration
└── README.md                # This file
```

## 🏃‍♂️ Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Firebase project** (for authentication and data)
- **Environment configuration** (see [Environment Variables Guide](./docs/ENVIRONMENT_VARIABLES.md))

### 1. Clone and Install

```bash
git clone https://github.com/GooseyPrime/yoohooguru.git
cd yoohooguru

# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# See docs/ENVIRONMENT_VARIABLES.md for complete guide
```

**Minimum required variables:**
```env
# Firebase (required)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key

# Security (required for production)
JWT_SECRET=your_super_secret_key

# App Branding (optional, defaults to yoohoo.guru)
APP_BRAND_NAME=yoohoo.guru
REACT_APP_BRAND_NAME=yoohoo.guru
```

### 3. Development

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # React dev server on port 3000
npm run dev:backend   # Express API server on port 3001
```

### 4. Production Build

```bash
# Build everything (first build: 15-60+ seconds, subsequent: 4-15 seconds)
npm run build

# Fast build (skips some optimizations for development)
npm run build:fast

# Clean build with optimization and timing
npm run build:clean

# Start production server
npm start
```

**Build Performance Notes:**
- First-time builds (cold cache): 15 seconds - 6+ minutes depending on hardware
- Subsequent builds (warm cache): 4-15 seconds
- Environment factors affect build time (CPU, RAM, storage type, OS)
- See [Build Performance Guide](docs/BUILD_PERFORMANCE.md) for optimization tips

## 🌍 Deployment

The platform supports multiple deployment options with full environment configuration:

- **[Railway](./docs/RAILWAY_DEPLOYMENT.md)** - Recommended for full-stack deployment
- **[Netlify + Railway](./docs/DEPLOYMENT.md)** - Frontend on Netlify, backend on Railway
- **[Docker](./docker-compose.yml)** - Container-based deployment
- **[Custom](./docs/DEPLOYMENT.md)** - Deploy anywhere with environment variables

### Environment Configuration

This platform is **fully environment-driven** with 40+ configurable variables:

- **🎨 Branding**: Customize app name, emails, contact info
- **🔗 URLs**: Configure domains, CORS origins, API endpoints  
- **🔧 Performance**: Adjust rate limits, cache settings, file upload limits
- **🚀 Features**: Enable/disable features via feature flags
- **🔐 Security**: Configure secrets, authentication, permissions

**📋 [Complete Environment Variables Guide](./docs/ENVIRONMENT_VARIABLES.md)**

## 🔧 Configuration Management

### Centralized Configuration

The platform uses a centralized configuration system with validation:

```javascript
// Backend configuration with validation
const { getConfig, validateConfig } = require('./backend/src/config/appConfig');
const config = getConfig();        // Load all environment variables
validateConfig(config);            // Validate required variables
```

### Environment-Specific Settings

```bash
# Development (automatic defaults)
NODE_ENV=development

# Production (requires all security variables)
NODE_ENV=production
JWT_SECRET=required_in_production
FIREBASE_PROJECT_ID=required_in_production
```

### Feature Flags

Control feature availability across environments:

```env
# Feature flags (environment-driven)
FEATURE_AI_RECOMMENDATIONS=true
FEATURE_DARK_MODE=false
FEATURE_MOBILE_APP=true
ADMIN_WRITE_ENABLED=false
```

## 🔌 API Endpoints

### Core API
- **GET /api** - API status and welcome message
- **GET /health** - Health check with system info
- **GET /api/feature-flags** - Available feature flags

### Authentication & Users
- **POST /api/auth/login** - User authentication
- **POST /api/auth/register** - User registration
- **GET /api/users/profile** - User profile management

### Skills & Exchanges
- **GET /api/skills** - Browse available skills
- **POST /api/skills** - Create skill offering
- **GET /api/exchanges** - Skill exchange history
- **POST /api/exchanges** - Request skill exchange

### Payments & Premium
- **POST /api/payments/create-intent** - Create payment
- **POST /api/payments/webhook** - Stripe webhook handler

### AI & Recommendations
- **POST /api/ai/recommendations** - Get AI-powered skill matches
- **POST /api/ai/chat** - AI assistant for skill guidance

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests separately
npm run test:frontend   # React component tests
npm run test:backend    # Express API tests

# Run with coverage
npm run test:coverage
```

### Test Coverage
- **Backend**: 31 tests covering API endpoints, utilities, and business logic
- **Frontend**: Component testing with Jest and React Testing Library
- **Integration**: End-to-end API testing with supertest

## 🔒 Security & Deployment Standards

### Firebase Production Policy

**🚨 Important**: This project enforces strict Firebase usage policies to ensure production deployments use live cloud infrastructure.

- **✅ Production/Staging**: Must use live Firebase projects only
- **❌ Prohibited**: Emulators, mocks, or demo configurations in deployed environments  
- **🔍 Enforcement**: Automated validation in CI/CD pipeline
- **📋 Documentation**: See [Firebase Policy Guide](./docs/FIREBASE_POLICY.md)

```bash
# Validate Firebase configuration before deployment
./scripts/validate-firebase-production.sh
```

### Environment Security
- All secrets managed via environment variables
- No hardcoded credentials in source code
- Production configurations validated at build time
- Separate Firebase projects for different environments

## 🔍 Development Commands

```bash
# Install dependencies
npm run install:all

# Development
npm run dev                 # Start both frontend and backend
npm run dev:frontend        # Frontend only (port 3000)
npm run dev:backend         # Backend only (port 3001)

# Building
npm run build               # Build both for production (see performance notes above)
npm run build:fast          # Fast build (skips optimizations)
npm run build:clean         # Clean build with optimization script
npm run build:analyze       # Build with bundle analysis
npm run build:frontend      # Build React app only
npm run build:backend       # Prepare backend for production

# Testing
npm test                    # Run all tests
npm run lint                # Check code style
npm run format              # Format code

# Deployment
npm start                   # Start production server
npm run deploy              # Deploy to configured services
```

## 🔒 Security Features

- **🛡️ Input Validation** - Comprehensive request validation with express-validator
- **🔐 Authentication** - Firebase Auth integration with JWT tokens
- **🚦 Rate Limiting** - Configurable rate limits per endpoint
- **🌐 CORS Protection** - Environment-configurable CORS origins
- **🔒 Helmet.js** - Security headers and protection middleware
- **📝 Audit Logging** - Comprehensive request/response logging

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Configure environment** (copy `.env.example` to `.env`)
4. **Make changes** with tests
5. **Run tests** (`npm test`)
6. **Commit changes** (`git commit -m 'Add amazing feature'`)
7. **Push to branch** (`git push origin feature/amazing-feature`)
8. **Open Pull Request**

### Development Guidelines

- **Environment-driven**: All configuration via environment variables
- **Test coverage**: Add tests for new features
- **Documentation**: Update docs for configuration changes
- **Security**: Follow security best practices
- **Performance**: Consider performance impact of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **📚 Documentation**: [docs/](./docs/) directory
- **🐛 Issues**: [GitHub Issues](https://github.com/GooseyPrime/yoohooguru/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/GooseyPrime/yoohooguru/discussions)
- **📧 Contact**: support@yoohoo.guru (configurable via `APP_SUPPORT_EMAIL`)

---

**Built with ❤️ for community skill sharing and exponential impact** 🚀

## Stripe Connect (Express)

Endpoints:
- POST `/api/connect/start`   → creates or reuses Express account and returns onboarding link
- GET  `/api/connect/status`  → returns charges/payouts readiness
- POST `/api/webhooks/stripe` → Stripe webhook (use raw body)

Webhook URL (prod): `https://yoohoo.guru/api/webhooks/stripe`  
Set `STRIPE_WEBHOOK_SECRET` from the Dashboard after adding the endpoint.

Booking charges should use Stripe Checkout with:
- `payment_intent_data.application_fee_amount`
- `payment_intent_data.transfer_data.destination = {connectedAccountId}`

Environment:
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `PUBLIC_BASE_URL`

The server will start on `http://localhost:8000`

### 5. Access the API

- **Root endpoint**: http://localhost:8000/
- **Health check**: http://localhost:8000/health
- **API documentation**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## Testing

### Run All Tests

```bash
pytest tests/ -v
```

### Run Specific Test Classes

```bash
# Test root endpoint
pytest tests/test_main.py::TestRootEndpoint -v

# Test health endpoint
pytest tests/test_main.py::TestHealthEndpoint -v

# Test API documentation
pytest tests/test_main.py::TestAPIDocumentation -v
```

### Test Coverage

```bash
# Install coverage if not already installed
pip install coverage

# Run tests with coverage
coverage run -m pytest tests/
coverage report
coverage html  # Generate HTML coverage report
```

## Railway Deployment

### Quick Deploy to Railway

The easiest way to deploy yoohoo.guru backend to production:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from repository root
railway up .
```

The repository is pre-configured for Railway with:
- `railway.json` - Deployment configuration
- `Procfile` - Process specification
- Health checks at `/health` endpoint

### Environment Variables for Railway

Set these in your Railway dashboard:

```bash
railway variables set NODE_ENV=production
railway variables set FIREBASE_PROJECT_ID=your_project_id
railway variables set FIREBASE_API_KEY=your_api_key
railway variables set JWT_SECRET=your_secret_key
# ... other variables from .env.example
```

For detailed Railway deployment instructions, see [Railway Deployment Guide](docs/RAILWAY_DEPLOYMENT.md).

## Docker Deployment

### Build Docker Image

```bash
docker build -t yoohooguru-mcp-server .
```

### Run Docker Container

```bash
# Run in foreground
docker run -p 8000:8000 yoohooguru-mcp-server

# Run in background
docker run -d -p 8000:8000 --name yoohooguru-server yoohooguru-mcp-server

# View logs
docker logs yoohooguru-server

# Stop container
docker stop yoohooguru-server
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  yoohooguru-server:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - LOG_LEVEL=info
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## Environment Variables

The server supports the following environment variables for configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Server host address |
| `PORT` | `8000` | Server port |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warning, error) |
| `ENVIRONMENT` | `development` | Environment (development, staging, production) |
| `DATABASE_URL` | `None` | Database connection URL (for future use) |
| `REDIS_URL` | `None` | Redis connection URL (for future use) |
| `SECRET_KEY` | `None` | Secret key for JWT tokens (for future use) |

Example:

```bash
export HOST=0.0.0.0
export PORT=8080
export LOG_LEVEL=debug
export ENVIRONMENT=development
python src/main.py
```

## API Response Format

All endpoints return JSON responses with the following structure:

```json
{
    "status": "healthy",
    "message": "yoohoo.guru MCP Server is running",
    "timestamp": "2025-08-30T19:21:46.822343Z",
    "version": "1.0.0"
}
```

## Code Quality

The codebase follows modern Python best practices:

- **PEP 8** compliance for code style
- **Type hints** for all functions and methods
- **Pydantic models** for data validation
- **Comprehensive docstrings** for all modules and functions
- **Structured logging** for debugging and monitoring

## Development Guidelines

### Adding New Endpoints

1. Add new route methods to the `MCPServer` class in `src/main.py`
2. Create corresponding Pydantic models if needed
3. Add comprehensive tests in `tests/test_main.py`
4. Update this README with new endpoint documentation

### Extending the Configuration

1. Add new settings to the `Settings` class in `src/config.py`
2. Update environment variable documentation in this README
3. Add corresponding tests if the settings affect functionality

## Monitoring and Health Checks

### Current Status: ✅ ACTIVE

The MCP server is currently **ACTIVE** and operational. All health checks pass successfully.

The server provides comprehensive health check endpoints suitable for:

- **Load balancers** (ALB, HAProxy, etc.)
- **Container orchestration** (Kubernetes, Docker Swarm)
- **Monitoring systems** (Prometheus, DataDog, etc.)

### Health Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /` | Service status | Returns server running confirmation |
| `GET /health` | Health monitoring | Returns operational status for load balancers |

### Verify Server Status

```bash
# Check if server is running
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "message": "Service is operational",
  "timestamp": "2025-08-30T21:00:17.783451Z",
  "version": "1.0.0"
}

# Test all endpoints
curl http://localhost:8000/           # Root status
curl http://localhost:8000/docs       # API documentation
curl http://localhost:8000/openapi.json  # OpenAPI schema
```

### Automated Status Verification

Use the provided verification script for comprehensive status checking:

```bash
# Run comprehensive status check
python scripts/verify_mcp_status.py

# Output JSON for monitoring integration
python scripts/verify_mcp_status.py --json

# Check remote server
python scripts/verify_mcp_status.py --url https://your-domain.com
```

**Example output:**
```
🎯 yoohoo.guru MCP Server Status Check
Testing server at: http://localhost:8000
------------------------------------------------------------
✅ Root endpoint (/)
   Status: healthy
   Message: yoohoo.guru MCP Server is running
   ✓ Response matches expected format
   Response time: 0.003s

✅ Health check (/health)
   Status: healthy
   Message: Service is operational
   Response time: 0.001s

✅ API Documentation (/docs)
   Response time: 0.001s

✅ OpenAPI Schema (/openapi.json)
   Response time: 0.002s

------------------------------------------------------------
🎉 MCP Server Status: ACTIVE - All checks passed!
```

### Health Check Integration

For production monitoring, configure your monitoring system to:

1. **Endpoint**: `GET /health`
2. **Expected Status Code**: `200`
3. **Expected Response**: `{"status": "healthy"}`
4. **Check Interval**: 30 seconds
5. **Timeout**: 5 seconds
6. **Retries**: 3

## Future Extensions

The MCP (Multi-Component Platform) architecture is designed to support:

- **User authentication and authorization**
- **Skill management APIs**
- **Community features**
- **Real-time messaging**
- **File upload and storage**
- **Search and filtering**
- **Analytics and reporting**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Ensure all tests pass (`pytest tests/`)
6. Update documentation as needed
7. Commit your changes (`git commit -am 'Add new feature'`)
8. Push to the branch (`git push origin feature/new-feature`)
9. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions, please:

1. Check the [Issues](https://github.com/GooseyPrime/yoohooguru/issues) page
2. Create a new issue if needed
3. Provide detailed information about your problem or suggestion

## Next Steps

1. **Database Integration**: Add PostgreSQL or MongoDB support
2. **Authentication**: Implement JWT-based authentication
3. **API Versioning**: Add versioned API endpoints
4. **Rate Limiting**: Implement request rate limiting
5. **Caching**: Add Redis-based caching
6. **Monitoring**: Integrate with monitoring solutions
7. **CI/CD**: Set up automated testing and deployment pipelines

### Stripe Connect — Debit cards & Instant Payouts (Express)

**Connect → Settings → Payouts**
- Require at least one external account: **ON**
- Collection method: **Financial Connections (with manual fallback)**
- Saved bank accounts (Link): **Allow**
- Allow debit cards: **ON**  ← required for Instant Payouts
- Payout schedule: **Weekly (Friday)** (default)
- Instant Payouts: **ON**
- Statement descriptor (payouts): `YOOHOO GURU PAYOUT`

Gurus can manage payout methods in the Stripe Express Dashboard (button in **/account/payouts**).
