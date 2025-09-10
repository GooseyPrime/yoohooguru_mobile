# Deployment Guide

This guide covers deploying yoohoo.guru to various hosting platforms.

## Prerequisites

- Node.js 18+ installed locally
- Firebase project configured
- Environment variables configured
- Domain name (for production)

## Environment Setup

### 1. Environment Variables

**Important**: For complete environment variable documentation, see [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md).

Copy `.env.example` to `.env` and configure:

```env
# Production Environment
NODE_ENV=production
PORT=3001

# App Branding (customize for your deployment)
APP_BRAND_NAME=yoohoo.guru
APP_DISPLAY_NAME=yoohoo.guru
APP_LEGAL_EMAIL=legal@yoohoo.guru
APP_PRIVACY_EMAIL=privacy@yoohoo.guru
APP_SUPPORT_EMAIL=support@yoohoo.guru

# CORS Origins (update with your actual domains)
CORS_ORIGIN_PRODUCTION=https://your-domain.com,https://www.your-domain.com

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Frontend URLs
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENVIRONMENT=production

# Frontend Branding (must use REACT_APP_ prefix)
REACT_APP_BRAND_NAME=yoohoo.guru
REACT_APP_DISPLAY_NAME=yoohoo.guru
REACT_APP_LEGAL_EMAIL=legal@yoohoo.guru
REACT_APP_PRIVACY_EMAIL=privacy@yoohoo.guru
REACT_APP_SUPPORT_EMAIL=support@yoohoo.guru
REACT_APP_CONTACT_ADDRESS=yoohoo.guru, Legal Department

# Security & JWT (REQUIRED in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Rate Limiting (optional, has defaults)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Add all other variables from .env.example
```

### 2. Firebase Service Account

For backend deployment, you'll need a Firebase service account:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `firebase-service-account.json`
4. Set environment variable: `GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json`

## Frontend Deployment

### Netlify Deployment

1. **Build Settings**
   ```bash
   # Build command
   cd frontend && npm install && npm run build
   
   # Publish directory
   frontend/dist
   ```

2. **Environment Variables**
   Add in Netlify dashboard under Site Settings → Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   REACT_APP_FIREBASE_API_KEY=your_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   # ... other REACT_APP_ variables
   ```

3. **Redirects Configuration**
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configuration**
   Create `vercel.json` in frontend directory:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "webpack",
     "env": {
       "REACT_APP_API_URL": "@react_app_api_url",
       "REACT_APP_FIREBASE_API_KEY": "@react_app_firebase_api_key"
     }
   }
   ```

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize**
   ```bash
   cd frontend
   firebase init hosting
   ```

3. **Configure**
   Update `firebase.json`:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Backend Deployment

### Railway Deployment

Railway is the recommended deployment platform for yoohoo.guru backend. The repository is pre-configured for Railway deployment.

#### Quick Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy from Repository Root**
   ```bash
   # Deploy the entire project (backend will be deployed)
   railway up .
   ```

   Or deploy backend specifically:
   ```bash
   cd backend
   railway up
   ```

#### Detailed Setup

1. **Project Configuration**
   
   The repository includes `railway.json` and `Procfile` for automated deployment:
   
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm run build"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/health"
     }
   }
   ```
   
   **Note**: The build command uses `npm run build` (not `npm run build:backend`) because the backend serves the frontend static files. Both frontend and backend must be built for proper deployment.

2. **Environment Variables**
   
   Set required environment variables in Railway dashboard or via CLI:
   
   ```bash
   # Core Configuration
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   
   # Firebase Configuration
   railway variables set FIREBASE_PROJECT_ID=your_project_id
   railway variables set FIREBASE_API_KEY=your_api_key
   railway variables set FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   
   # JWT and Security
   railway variables set JWT_SECRET=your_super_secret_jwt_key
   
   # API Keys
   railway variables set OPENROUTER_API_KEY=your_openrouter_key
   railway variables set STRIPE_SECRET_KEY=sk_live_your_stripe_key
   
   # Rate Limiting
   railway variables set RATE_LIMIT_WINDOW_MS=900000
   railway variables set RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Custom Domain (Optional)**
   ```bash
   railway domain add yourdomain.com
   ```

4. **Monitoring**
   Railway provides built-in monitoring. Access logs via:
   ```bash
   railway logs
   ```

#### Deployment Commands Reference

| Command | Description |
|---------|-------------|
| `railway up .` | Deploy from repository root |
| `railway up` | Deploy from current directory |
| `railway deploy` | Deploy with existing configuration |
| `railway logs` | View deployment logs |
| `railway status` | Check deployment status |
| `railway variables` | Manage environment variables |
| `railway domain` | Manage custom domains |

#### Troubleshooting Railway Deployment

- **Build Failures**: Check that all dependencies are in `package.json`
- **Environment Variables**: Ensure all required vars are set in Railway
- **Port Issues**: Railway automatically assigns PORT, don't hardcode it
- **Health Checks**: Endpoint `/health` must return 200 status

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Configure**
   Create `Procfile` in backend directory:
   ```
   web: node src/index.js
   ```

4. **Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FIREBASE_PROJECT_ID=your_project_id
   # ... other variables
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### DigitalOcean App Platform

1. **Create App Spec**
   Create `.do/app.yaml`:
   ```yaml
   name: yoohooguru-backend
   services:
   - name: api
     source_dir: /backend
     github:
       repo: your-username/yoohooguru
       branch: main
     run_command: node src/index.js
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: PORT
       value: "8080"
   ```

### Docker Deployment

1. **Create Dockerfiles**

   Backend `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 3001
   CMD ["node", "src/index.js"]
   ```

   Frontend `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine as builder
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Docker Compose**
   Create `docker-compose.yml`:
   ```yaml
   version: '3.8'
   
   services:
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       environment:
         - REACT_APP_API_URL=http://localhost:3001/api
   
     backend:
       build: ./backend
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - PORT=3001
       env_file:
         - .env
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

## Database Setup

### Firebase Configuration

1. **Security Rules**
   Configure in Firebase Console → Database → Rules:
   ```javascript
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
           ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
         }
       },
       "exchanges": {
         "$exchangeId": {
           ".read": "data.child('teacherId').val() === auth.uid || data.child('learnerId').val() === auth.uid",
           ".write": "data.child('teacherId').val() === auth.uid || data.child('learnerId').val() === auth.uid"
         }
       }
     }
   }
   ```

2. **Indexes**
   Configure in Firebase Console for optimal query performance:
   ```json
   {
     "rules": {},
     "indexes": {
       "users": {
         "tier": {}
       },
       "exchanges": {
         "teacherId": {},
         "learnerId": {},
         "status": {}
       }
     }
   }
   ```

## SSL/HTTPS Setup

### Let's Encrypt (for VPS)

1. **Install Certbot**
   ```bash
   sudo apt install certbot
   ```

2. **Generate Certificate**
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Nginx Configuration

Create `/etc/nginx/sites-available/yoohooguru`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/yoohooguru/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Logging

### Production Logging

1. **Winston Configuration**
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.errors({ stack: true }),
       winston.format.json()
     ),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

2. **Health Checks**
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({
       status: 'OK',
       timestamp: new Date().toISOString(),
       uptime: process.uptime()
     });
   });
   ```

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/node
   ```

   ```javascript
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV
   });
   ```

## Performance Optimization

### Frontend Optimization

1. **Build Optimization**
   ```javascript
   // webpack.config.js
   module.exports = {
     optimization: {
       splitChunks: {
         chunks: 'all',
         cacheGroups: {
           vendor: {
             test: /[\\/]node_modules[\\/]/,
             name: 'vendors',
             chunks: 'all',
           },
         },
       },
     },
   };
   ```

2. **Service Worker**
   ```javascript
   // Register in index.js
   if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
     navigator.serviceWorker.register('/service-worker.js');
   }
   ```

### Backend Optimization

1. **Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Caching Headers**
   ```javascript
   app.use('/static', express.static('public', {
     maxAge: '1y',
     etag: false
   }));
   ```

## Backup & Recovery

### Database Backup

1. **Firebase Export**
   ```bash
   firebase database:get / > backup-$(date +%Y%m%d).json
   ```

2. **Automated Backups**
   ```bash
   #!/bin/bash
   # backup.sh
   DATE=$(date +%Y%m%d)
   firebase database:get / > backup-$DATE.json
   aws s3 cp backup-$DATE.json s3://your-backup-bucket/
   ```

### Code Backup

1. **Git Tags**
   ```bash
   git tag -a v1.0.0 -m "Production release v1.0.0"
   git push origin v1.0.0
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check API URL in frontend environment
   - Verify CORS configuration in backend
   - Ensure proper protocol (http vs https)

2. **Firebase Connection Issues**
   - Verify service account credentials
   - Check Firebase project settings
   - Ensure proper environment variables

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Health Checks

```bash
# Test backend health
curl https://your-api-domain.com/health

# Test frontend
curl https://your-frontend-domain.com

# Check SSL certificate
openssl s_client -connect your-domain.com:443
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Firebase security rules configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error messages don't expose sensitive data
- [ ] Dependencies updated and scanned
- [ ] CORS properly configured
- [ ] Headers security (Helmet.js)
- [ ] Authentication tokens secured

## Post-Deployment

1. **Test all functionality**
2. **Monitor logs for errors**
3. **Set up monitoring alerts**
4. **Configure backup schedules**
5. **Update DNS records**
6. **Test mobile responsiveness**
7. **Verify PWA functionality**

This deployment guide ensures yoohoo.guru is properly deployed with security, performance, and reliability best practices.