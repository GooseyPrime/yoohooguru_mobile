# 🎯 yoohoo.guru Architecture

## Overview

yoohoo.guru is designed as a scalable, modern web application built with a microservices-inspired architecture that can grow with the community's needs.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External      │
│  (React Web)    │◄──►│  (Node.js)      │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React Native  │    │ • Express.js    │    │ • Firebase      │
│   Web           │    │ • Authentication│    │ • Stripe        │
│ • PWA           │    │ • Rate Limiting │    │ • OpenRouter    │
│ • Responsive    │    │ • Validation    │    │ • Email Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with React Native Web
- **Styling**: Styled Components with custom design system
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Build Tool**: Webpack 5
- **PWA**: Service Worker + Web App Manifest

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: Firebase Admin SDK
- **Validation**: Express Validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest + Supertest

### Database & Storage
- **Primary Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage (future)
- **Caching**: In-memory (Redis planned)

### External Integrations
- **Payments**: Stripe
- **AI Services**: OpenRouter API
- **Email**: SMTP (configurable)
- **Analytics**: Google Analytics (planned)

## Data Flow

### Authentication Flow
```
1. User submits credentials
2. Frontend sends to Firebase Auth
3. Firebase returns ID token
4. Token sent to backend for validation
5. Backend validates with Firebase Admin
6. Protected resources accessed with token
```

### Skill Matching Flow
```
1. User searches for skills
2. Backend queries Firebase database
3. AI service (OpenRouter) ranks matches
4. Results returned with compatibility scores
5. Frontend displays ranked matches
```

## Database Schema

### Users Collection
```javascript
users: {
  [uid]: {
    // Profile Information
    email: string,
    displayName: string,
    photoURL: string,
    location: string,
    purposeStory: string,
    
    // Skills
    skillsOffered: string[],
    skillsWanted: string[],
    
    // Progress & Gamification
    tier: "Stone Dropper" | "Wave Maker" | "Current Creator" | "Tide Turner",
    exchangesCompleted: number,
    averageRating: number,
    totalHoursTaught: number,
    
    // Availability
    availability: string[],
    timezone: string,
    
    // Metadata
    joinDate: ISO8601,
    lastLoginAt: ISO8601,
    isActive: boolean,
    preferences: object
  }
}
```

### Exchanges Collection
```javascript
exchanges: {
  [exchangeId]: {
    // Participants
    teacherId: string,
    learnerId: string,
    
    // Session Details
    skill: string,
    sessionTemplate: "creative" | "technical" | "practical" | "language",
    duration: number, // minutes
    
    // Scheduling
    dateScheduled: ISO8601,
    dateCompleted: ISO8601,
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",
    
    // Payment
    paymentAmount: number,
    paymentStatus: "pending" | "completed" | "refunded",
    stripePaymentId: string,
    
    // Feedback
    ratings: {
      teacherRating: number,
      learnerRating: number
    },
    feedback: {
      teacherFeedback: string,
      learnerFeedback: string
    },
    
    // AI Moderation
    aiModerationNotes: string,
    sessionQualityScore: number,
    
    // Metadata
    createdAt: ISO8601,
    updatedAt: ISO8601
  }
}
```

### Skills Collection (Cached/Aggregated)
```javascript
skills: {
  [skillId]: {
    name: string,
    category: string,
    description: string,
    difficultyLevel: "beginner" | "intermediate" | "advanced",
    
    // Statistics
    offeredBy: number,
    wantedBy: number,
    popularityScore: number,
    averageRating: number,
    
    // Session Templates
    recommendedDuration: number,
    sessionTemplate: string,
    
    // Metadata
    createdAt: ISO8601,
    updatedAt: ISO8601
  }
}
```

## API Design

### RESTful Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify` - Verify token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Users
- `GET /api/users` - List users with filters
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/search/skills` - Search users by skills

#### Skills
- `GET /api/skills` - List all skills
- `GET /api/skills/:skillName` - Get skill details
- `GET /api/skills/suggestions/autocomplete` - Skill suggestions

#### Exchanges (Future)
- `POST /api/exchanges` - Create exchange request
- `GET /api/exchanges` - List user exchanges
- `PUT /api/exchanges/:id` - Update exchange
- `POST /api/exchanges/:id/complete` - Mark exchange complete

#### Payments
- `GET /api/payments/config` - Get payment configuration
- `POST /api/payments/create-payment-intent` - Create payment intent (planned)
- `GET /api/payments/subscription/:userId` - Get subscription status (planned)

#### Connect & Instant Payouts
- `POST /api/connect/start` - Start Stripe Connect onboarding
- `GET /api/connect/status` - Get connected account status
- `GET /api/connect/balance` - Get account balance with instant available amounts
- `POST /api/connect/instant-payout` - Create instant payout to connected account

### Response Format
```javascript
{
  success: boolean,
  data?: any,
  error?: {
    message: string,
    details?: any
  }
}
```

## Security Considerations

### Authentication & Authorization
- Firebase ID tokens for authentication
- Role-based access control (RBAC)
- JWT token validation on all protected routes
- Session management with secure cookies

### Data Protection
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection with Content Security Policy
- Rate limiting to prevent abuse
- HTTPS encryption in production

### Privacy
- User data anonymization options
- GDPR compliance features
- Data retention policies
- User consent management

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image lazy loading
- Service worker for offline caching
- Bundle size optimization
- Critical CSS inlining

### Backend
- Response compression (gzip)
- Database query optimization
- Connection pooling
- Caching strategies
- CDN for static assets

### Database
- Efficient Firebase queries
- Denormalized data for read performance
- Offline-first with sync
- Indexed queries
- Pagination for large datasets

## Scalability Plan

### Horizontal Scaling
- Stateless backend design
- Load balancer ready
- Database sharding strategies
- Microservices migration path
- Container orchestration (Docker/K8s)

### Vertical Scaling
- Auto-scaling policies
- Performance monitoring
- Resource optimization
- Database connection limits
- Memory management

## Deployment Architecture

### Development
```
Developer Machine → GitHub → CI/CD Pipeline → Staging Environment
```

### Production
```
GitHub → CI/CD Pipeline → Production Environment → CDN → Users
```

### Infrastructure
- **Frontend**: Static hosting (Netlify/Vercel)
- **Backend**: Container platform (Railway/Heroku)
- **Database**: Firebase (managed)
- **CDN**: CloudFlare
- **Monitoring**: Application monitoring tools

## Future Enhancements

### Phase 2 Features
- Real-time messaging (Socket.io)
- Video calling integration (WebRTC)
- Advanced AI matching algorithms
- Mobile native apps (React Native)

### Phase 3 Features
- Microservices architecture
- Event-driven architecture
- Advanced analytics
- Machine learning recommendations

### Infrastructure Evolution
- Kubernetes deployment
- Redis caching layer
- Elasticsearch for search
- Message queues (RabbitMQ)
- API Gateway (Kong/AWS)

## Monitoring & Observability

### Logging
- Structured logging with Winston
- Log aggregation
- Error tracking (Sentry)
- Performance metrics

### Metrics
- Application performance monitoring
- User analytics
- Business metrics dashboard
- Real-time alerting

### Health Checks
- Service health endpoints
- Database connectivity checks
- External service monitoring
- Automated failover procedures

This architecture provides a solid foundation for yoohoo.guru while maintaining flexibility for future growth and feature additions.