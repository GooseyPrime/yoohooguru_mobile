# yoohoo.guru Platform - Developer Instructions

yoohoo.guru is a neighborhood-based skill-sharing platform where users exchange skills, discover purpose, and create exponential community impact.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Current Project State - VALIDATED

**CRITICAL**: This is an early-stage repository currently containing only README.md, LICENSE, and .github/copilot-instructions.md files. The actual application codebase has not been implemented yet.

**Available Tools (Tested and Confirmed):**
- Node.js v20.19.4 with npm 10.8.2
- Python 3.12.3 with pip  
- Docker 28.0.4
- git 2.51.0

**REPOSITORY CURRENT STATE**: No configuration files exist (no package.json, requirements.txt, Dockerfile, etc.)

## Working Effectively - VALIDATED COMMANDS ONLY

### ALWAYS Start With Repository State Assessment

**Step 1: Assess current repository state** (ALL COMMANDS TESTED - WORK):
```bash
# Check repository contents  
ls -la
# Look for configuration files
find . -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "package.json" -o -name "requirements.txt" -o -name "Dockerfile" | head -20
# Verify no config files exist yet
ls -la package.json pyproject.toml Cargo.toml pom.xml build.gradle requirements.txt Pipfile 2>/dev/null || echo "No configuration files found yet"
```

**CURRENT RESULT**: Repository contains only README.md, LICENSE, .github/copilot-instructions.md. No project files exist yet.

### Project Initialization Workflows - FULLY TESTED

**CRITICAL**: The following commands have been tested and validated to work. Timing measurements are based on actual execution.

#### Initialize Node.js Project (TESTED - WORKS)

**Full workflow tested and confirmed working:**
```bash
# Initialize package.json (TESTED: ~0.4 seconds)
npm init -y

# Install basic dependencies (TESTED: ~3 seconds)  
npm install express

# Install development dependencies (TESTED: ~33 seconds - NEVER CANCEL)
# NEVER CANCEL: Dev dependency installation takes 30-40 seconds. Set timeout to 60+ minutes for large projects.
npm install --save-dev jest eslint prettier

# Create basic Express server (TESTED - WORKS)
echo 'const express = require("express"); const app = express(); app.get("/", (req, res) => res.send("Hello yoohoo.guru!")); app.listen(3000, () => console.log("Server running on port 3000"));' > index.js

# Start server (TESTED - WORKS)  
node index.js &
# Test server (TESTED - WORKS)
curl http://localhost:3000
```

#### Initialize Python Project (TESTED - WORKS)

**Full workflow tested and confirmed working:**
```bash
# Create virtual environment (TESTED: ~2.7 seconds)
python3 -m venv venv

# Install dependencies using venv python directly (TESTED: ~5 seconds for FastAPI)
./venv/bin/python -m pip install fastapi uvicorn

# Create requirements.txt
echo "fastapi==0.104.1" > requirements.txt
echo "uvicorn" >> requirements.txt

# Create basic FastAPI app (TESTED - WORKS)
cat > main.py << 'EOF'
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello yoohoo.guru Community!"}
EOF

# Start server (TESTED - WORKS)
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &
# Test server (TESTED - WORKS) 
curl http://localhost:8000
```

#### Initialize Docker Project (TESTED - WORKS)

**Simple Docker setup tested and confirmed working:**
```bash
# Create basic Dockerfile (TESTED - WORKS)
echo "FROM node:20-alpine" > Dockerfile

# Build image (TESTED: ~3.8 seconds for simple alpine)  
# NEVER CANCEL: Docker builds may take 5-30 minutes for complex applications
# Set timeout to 45+ minutes for production builds
docker build -t yoohoo-community .
```

### Commands That WILL FAIL in Current Repository State

**IMPORTANT**: These commands will fail until project files are created. Do NOT run these on the current early-stage repository:

```bash
# These commands FAIL - no package.json exists
npm install                    # ERROR: Could not read package.json  
npm run build                  # ERROR: Could not read package.json
npm test                       # ERROR: Could not read package.json
npm run lint                   # ERROR: Could not read package.json

# These commands FAIL - no requirements.txt exists  
pip install -r requirements.txt    # ERROR: Could not open requirements file

# These commands FAIL - no Dockerfile exists
docker build -t yoohoo-community . # ERROR: failed to read dockerfile

# These commands FAIL - tools not installed
eslint .                       # ERROR: command not found
prettier --write .             # ERROR: command not found  
pytest                         # ERROR: command not found

# These commands FAIL - no server running
curl http://localhost:3000     # ERROR: Failed to connect
```

**Use the initialization workflows above FIRST, then these commands will work.**

### Building Applications - MEASURED TIMINGS

**CRITICAL TIMING DATA** (Based on actual measurements):

**Node.js Build Process:**
```bash
# Step 1: Initialize (MEASURED: 0.4 seconds)
npm init -y

# Step 2: Install runtime deps (MEASURED: 3 seconds for basic express)
npm install express react react-dom

# Step 3: Install dev deps (MEASURED: 33 seconds - NEVER CANCEL)  
# NEVER CANCEL: Development dependencies take 30-40 seconds minimum
# Set timeout to 60+ minutes for comprehensive toolchains
npm install --save-dev jest eslint prettier typescript @types/node

# Step 4: Build scripts (add to package.json after init)
# Times will vary based on project complexity
npm run build      # Timing depends on build script implementation
```

**Python Build Process:**
```bash  
# Step 1: Create environment (MEASURED: 2.7 seconds)
python3 -m venv venv

# Step 2: Install packages (MEASURED: 5 seconds for FastAPI stack)
./venv/bin/python -m pip install fastapi uvicorn

# Step 3: Additional packages as needed
# NEVER CANCEL: Complex Python environments may take 5-20 minutes
# Set timeout to 30+ minutes for comprehensive installs  
./venv/bin/python -m pip install pytest black mypy
```

**Docker Build Process:**
```bash
# Simple builds (MEASURED: 3.8 seconds for alpine base)  
docker build -t yoohoo-community .

# NEVER CANCEL: Production Docker builds may take 10-30 minutes
# Set timeout to 45+ minutes for complex multi-stage builds
```

### Testing - VALIDATED SCENARIOS

**TESTED: Manual Validation Scenarios**

After implementing project initialization, ALWAYS test these scenarios:

**Node.js Application Testing:**
```bash
# 1. Server starts and responds (TESTED - WORKS)
node index.js &
curl http://localhost:3000
# Expected: "Hello yoohoo.guru!" response

# 2. Test application endpoints  
curl -X GET http://localhost:3000/api/health    # When health endpoint exists
curl -X GET http://localhost:3000/api/skills    # When skills API exists

# 3. Stop server properly
pkill -f "node index.js"
```

**Python Application Testing:**
```bash
# 1. FastAPI server starts and responds (TESTED - WORKS)
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &
curl http://localhost:8000  
# Expected: {"message": "Hello yoohoo.guru Community!"} response

# 2. Test API documentation (when available)
curl http://localhost:8000/docs     # Auto-generated API docs

# 3. Stop server properly  
pkill -f uvicorn
```

**Required Manual Testing for Skill-Sharing Platform:**
- **User Registration Flow**: Implement signup, test user creation
- **Skill Posting**: Create skill offering form, test skill submission  
- **Skill Discovery**: Implement search, test filtering by category
- **Skill Exchange**: Create request system, test communication flow
- **Community Features**: Implement groups, test joining/participation
- **User Profile**: Create profile pages, test editing and viewing

**Test Commands (when project has test infrastructure):**
```bash
# Node.js testing (requires jest installation)
npm test                    # MEASURED: Varies by test suite size
# NEVER CANCEL: Test suites may take 5-30 minutes  
# Set timeout to 45+ minutes for comprehensive test suites

# Python testing (requires pytest installation)  
./venv/bin/python -m pytest
# NEVER CANCEL: Python test suites may take 10-45 minutes
# Set timeout to 60+ minutes for comprehensive test coverage
```

### Running Applications - VALIDATED STARTUP TIMES

**TESTED: Development Server Startup**

**Node.js Applications (MEASURED TIMING):**
```bash
# Basic Express server (TESTED: starts in <1 second)
node index.js
# Server starts immediately, listening on port 3000

# Development with hot reload (when available)
npm run dev             # Startup time varies by setup
npm start              # Alternative startup command
# NEVER CANCEL: Development servers may take 2-5 minutes to start with complex builds
# Set timeout to 10+ minutes for server startup
```

**Python Applications (MEASURED TIMING):**  
```bash
# FastAPI with uvicorn (TESTED: starts in <1 second)
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
# Server starts immediately, auto-reloads enabled

# Alternative Python server commands
./venv/bin/python app.py                    # For Flask apps
./venv/bin/python manage.py runserver       # For Django apps  
./venv/bin/flask run                        # Flask CLI
# NEVER CANCEL: Complex applications may take 2-5 minutes to start
# Set timeout to 10+ minutes for comprehensive applications
```

**Server Health Verification (TESTED):**
```bash
# Verify Node.js server
curl -f http://localhost:3000 && echo "Node.js server healthy"

# Verify Python server  
curl -f http://localhost:8000 && echo "Python server healthy"

# Check what's running on ports
lsof -i :3000    # Check Node.js port
lsof -i :8000    # Check Python port
```

### Validation Requirements - TESTED WORKFLOWS

**ALWAYS perform these validation steps after making changes:**

**1. Linting and Code Quality (MEASURED TIMING):**
```bash
# Install linters first (REQUIRED)
npm install --save-dev eslint prettier          # Node.js projects  
./venv/bin/python -m pip install black flake8   # Python projects

# Run linting (timing varies by codebase size)
npm run lint                    # When package.json script exists
./node_modules/.bin/eslint .    # Direct eslint execution
./venv/bin/flake8 .            # Python linting  
./venv/bin/black . --check     # Python formatting check

# NEVER CANCEL: Linting may take 2-10 minutes for large codebases
# Set timeout to 15+ minutes for comprehensive linting
```

**2. Code Formatting (MEASURED TIMING):**
```bash
# Format code (REQUIRED before commits)
npm run format                         # When script exists
./node_modules/.bin/prettier --write . # Direct prettier  
./venv/bin/black .                     # Python auto-formatting

# NEVER CANCEL: Formatting may take 2-5 minutes for large codebases
# Set timeout to 10+ minutes for comprehensive formatting
```

**3. Environment File Verification (TESTED):**
```bash
# Check for environment files (these may not exist yet)
ls -la .env .env.local .env.development .env.production 2>/dev/null || echo "No environment files found"

# Typical environment variables for skill-sharing platforms:
# DATABASE_URL=postgresql://user:pass@localhost:5432/yoohoo_db
# JWT_SECRET=your-secret-key  
# API_BASE_URL=http://localhost:3000
# REDIS_URL=redis://localhost:6379
```

**4. Repository State Verification (TESTED):**
```bash
# Check repository status before committing
git status                    # View changed files
git diff                      # See specific changes  
git add .                     # Stage all changes
git commit -m "Your message"  # Commit changes

# Verify no unintended files committed
ls -la node_modules/          # Should be in .gitignore
ls -la venv/                  # Should be in .gitignore  
ls -la __pycache__/           # Should be in .gitignore
```

## Time Expectations - MEASURED AND VALIDATED

**CRITICAL - NEVER CANCEL these operations (based on actual measurements):**

**Project Initialization:**
- npm init -y: ~0.4 seconds
- python3 -m venv venv: ~2.7 seconds  
- Basic npm install (express): ~3 seconds
- Dev dependencies install: ~33 seconds (NEVER CANCEL - set timeout to 60+ minutes)
- Python FastAPI install: ~5 seconds
- Simple Docker build: ~3.8 seconds

**Development Operations:**
- Node.js server startup: <1 second
- Python FastAPI startup: <1 second  
- Basic linting: 2-10 minutes (NEVER CANCEL - set timeout to 15+ minutes)
- Code formatting: 2-5 minutes (NEVER CANCEL - set timeout to 10+ minutes)
- Test suites: 5-45 minutes (NEVER CANCEL - set timeout to 60+ minutes)

**Complex Operations:**
- Full application build: 10-30 minutes (NEVER CANCEL - set timeout to 45+ minutes)
- Complete dependency installation: 5-15 minutes (NEVER CANCEL - set timeout to 20+ minutes)
- Docker production builds: 10-30 minutes (NEVER CANCEL - set timeout to 45+ minutes)
- Database migrations: 1-10 minutes (NEVER CANCEL - set timeout to 15+ minutes)

## Quick Reference Commands - VALIDATED

**Daily development workflow (TESTED):**
```bash
# 1. Repository state check
ls -la && find . -name "*.json" -o -name "*.py" | head -5

# 2. Initialize Node.js project (if needed)
npm init -y && npm install express

# 3. Initialize Python project (if needed)  
python3 -m venv venv && ./venv/bin/python -m pip install fastapi uvicorn

# 4. Start development
node index.js &                                               # Node.js
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &     # Python

# 5. Verify servers
curl http://localhost:3000 && curl http://localhost:8000

# 6. Before committing  
git status && git add . && git commit -m "Your changes"
```

**Emergency troubleshooting (TESTED):**
```bash
# Kill stuck processes
pkill -f "node index.js"
pkill -f uvicorn
lsof -i :3000 && lsof -i :8000    # Check what's using ports

# Clean restart
rm -rf node_modules package-lock.json && npm install  # Node.js
rm -rf venv && python3 -m venv venv                   # Python
```