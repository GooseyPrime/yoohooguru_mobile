# YooHoo.guru - Skill-Sharing Platform

A comprehensive skill-sharing platform where users exchange skills, discover purpose, and create exponential community impact. Now featuring both web and mobile applications.

## 🏗️ Monorepo Structure

```
yoohooguru_mobile/
├── apps/
│   ├── web/                 # React web application (Vercel)
│   ├── mobile/              # Expo React Native app 
│   └── backend/             # Express.js API server (Railway)
├── packages/
│   ├── sdk/                 # Shared TypeScript SDK
│   └── ui/                  # Shared UI components (future)
└── docs/                    # Documentation
```

## 📱 Applications

### Web App (`/apps/web`)
- **Framework**: React 18 with Webpack
- **Styling**: styled-components, framer-motion
- **State**: Context API + react-query
- **Deployment**: Vercel
- **Features**: Full platform functionality

### Mobile App (`/apps/mobile`) 
- **Framework**: Expo React Native
- **Navigation**: expo-router (file-based)
- **State**: TanStack Query + AsyncStorage
- **Deployment**: EAS Build (TestFlight/Play Console)
- **Features**: Native iOS/Android app with feature parity

### Backend API (`/apps/backend`)
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Auth**: Firebase Admin SDK
- **Payments**: Stripe
- **Deployment**: Railway
- **Features**: RESTful API with real-time capabilities

### Shared SDK (`/packages/sdk`)
- **Language**: TypeScript
- **Features**: 
  - HTTP client with Firebase auth
  - Zod schemas for validation
  - Shared types and models
  - API service classes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Expo CLI (for mobile development)

### Installation
```bash
# Clone the repository
git clone https://github.com/GooseyPrime/yoohooguru_mobile.git
cd yoohooguru_mobile

# Install all dependencies
npm run install:all

# Build shared SDK
npm run build:sdk
```

### Development

#### Start all services
```bash
npm run dev  # Starts web + backend
```

#### Individual apps
```bash
# Web app (React)
npm run dev:web

# Mobile app (Expo)
npm run dev:mobile

# Backend API
npm run dev:backend
```

### Building

```bash
# Build all applications
npm run build

# Build individual apps
npm run build:web
npm run build:mobile
npm run build:backend
npm run build:sdk
```

## 📋 Environment Variables

### Web App (`.env`)
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_API_URL=https://api.yoohoo.guru
```

### Mobile App (`.env`)
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_API_BASE_URL=https://api.yoohoo.guru
```

### Backend (`.env`)
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
STRIPE_SECRET_KEY=your_stripe_key
DATABASE_URL=your_database_url
```

## 🔧 Tech Stack

### Frontend
- **Web**: React 18, Webpack, styled-components
- **Mobile**: Expo, React Native, expo-router
- **Shared**: TypeScript, TanStack Query, Firebase Auth

### Backend
- **API**: Express.js, Node.js
- **Database**: Firebase Firestore
- **Auth**: Firebase Admin SDK
- **Payments**: Stripe
- **Hosting**: Railway

### DevOps
- **CI/CD**: GitHub Actions
- **Web Deploy**: Vercel
- **Mobile Deploy**: EAS Build
- **API Deploy**: Railway
- **Monitoring**: Sentry

## 📦 Package Scripts

### Root Level
```bash
npm run dev              # Start web + backend
npm run build           # Build all applications
npm run test            # Run all tests
npm run lint            # Lint all projects
npm install:all         # Install all dependencies
```

### Mobile Specific
```bash
npm run dev:mobile      # Start Expo dev server
npm run build:mobile    # Build mobile app
npm run test:mobile     # Run mobile tests
npm run lint:mobile     # Lint mobile app
```

## 🏃‍♂️ Mobile Development

### Prerequisites
```bash
# Install Expo CLI
npm install -g @expo/cli

# For iOS development (macOS only)
# Install Xcode from App Store

# For Android development
# Install Android Studio
```

### Running on Device
```bash
cd apps/mobile

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Building for Production
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas login
eas init

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both platforms
eas build --platform all
```

## 🔐 Authentication

The platform uses Firebase Authentication with the following features:
- Email/password authentication
- Social login (Google, Apple) - ready for implementation
- Phone number verification - ready for implementation
- Secure token management across web and mobile

## 💳 Payments

Stripe integration supports:
- One-time payments for skill exchanges
- Subscription billing (future)
- Instant payouts to service providers
- Multi-party marketplace transactions

## 🔔 Notifications

Mobile app includes:
- Push notifications via Expo Notifications
- In-app messaging
- Real-time updates
- Background sync

## 📊 Monitoring & Analytics

- **Error Tracking**: Sentry integration
- **Performance**: React Query DevTools
- **Analytics**: Ready for integration
- **Logging**: Winston (backend), Console (frontend)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific app
npm run test:web
npm run test:mobile
npm run test:backend
npm run test:sdk

# Run tests with coverage
npm run test:coverage
```

## 📈 Deployment

### Automatic Deployment (CI/CD)
- **Web**: Vercel (automatic on push to main)
- **Mobile**: EAS Build (manual trigger)
- **Backend**: Railway (automatic on push to main)

### Manual Deployment
```bash
# Deploy web app
npm run deploy:web

# Deploy backend
npm run deploy:backend

# Build mobile app
npm run build:mobile
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](./docs/)
- Contact the development team

## 🗺️ Roadmap

### v1.0 (Current)
- [x] Web application
- [x] Mobile application foundation
- [x] User authentication
- [x] Basic skill sharing
- [x] Payment integration

### v1.1 (Next)
- [ ] Enhanced mobile features
- [ ] Push notifications
- [ ] Offline support
- [ ] Advanced search

### v1.2 (Future)
- [ ] Video calling integration
- [ ] AI-powered skill matching
- [ ] Community features
- [ ] Advanced analytics

---

Built with ❤️ by the YooHoo.guru team