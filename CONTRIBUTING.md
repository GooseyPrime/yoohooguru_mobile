# Contributing to yoohoo.guru

Thank you for your interest in contributing to yoohoo.guru! This document provides guidelines and instructions for contributing to our skill-sharing platform.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Firebase account (for full functionality)
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/yoohooguru.git
   cd yoohooguru
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- Use ESLint and Prettier configurations provided
- Follow React best practices and hooks patterns
- Use TypeScript where beneficial
- Write self-documenting code with clear variable names
- Add comments for complex business logic

### Commit Messages

Use conventional commit format:
```
type(scope): description

Examples:
feat(auth): add Google authentication
fix(api): resolve user profile update bug
docs(readme): update installation instructions
style(ui): improve button component styling
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, tested code
   - Update documentation as needed
   - Add tests for new functionality

3. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Submit Pull Request**
   - Clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Request review from maintainers

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# Watch mode
npm run test:watch
```

### Writing Tests

- Write unit tests for utility functions
- Add integration tests for API endpoints
- Include component tests for React components
- Mock external dependencies (Firebase, Stripe, etc.) **only in unit tests**

⚠️ **Important**: Follow our [Firebase Policy](./docs/FIREBASE_POLICY.md) for testing:
- **Unit tests**: Mocks and emulators are permitted
- **E2E/Integration tests**: Must use live Firebase for PR validation
- **Preview environments**: Must use live Firebase projects
- **Local development**: Emulators and mocks are allowed

## 🏗️ Project Structure

```
yoohooguru/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   └── tests/               # Backend tests
├── frontend/                # React Native Web
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── screens/         # Page components
│   │   ├── contexts/        # React contexts
│   │   └── hooks/           # Custom hooks
│   └── tests/               # Frontend tests
└── docs/                    # Documentation
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Complete user registration flow
- [ ] Skill matching algorithm
- [ ] Payment integration
- [ ] Real-time messaging
- [ ] Mobile responsiveness

### Medium Priority
- [ ] Advanced search and filters
- [ ] User rating system
- [ ] Community events feature
- [ ] Analytics dashboard
- [ ] Notification system

### Low Priority
- [ ] Dark mode theme
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Internationalization
- [ ] Advanced AI features

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node version)
- Screenshots or error messages
- Minimal code example if applicable

Use our bug report template in GitHub Issues.

## 💡 Feature Requests

For feature requests:

- Check existing issues first
- Provide clear use case and rationale
- Consider implementation complexity
- Be open to discussion and feedback

## 📚 Documentation

Help improve our documentation:

- Fix typos and grammar
- Add code examples
- Improve API documentation
- Create tutorials and guides
- Update screenshots

## 🔐 Security

- Do not commit sensitive data (API keys, passwords)
- Report security vulnerabilities privately
- Follow secure coding practices
- Keep dependencies updated

### Firebase Security Policy

**🚨 Critical**: This project enforces strict Firebase usage standards:

- **✅ Production/Staging/PR environments**: Must use live Firebase projects
- **❌ Prohibited**: Emulators, mocks, or demo configurations in deployed environments
- **🔍 Validation**: All PRs and deployments are automatically validated
- **📋 Documentation**: See [Firebase Policy Guide](./docs/FIREBASE_POLICY.md)

Before submitting PRs:
```bash
# Validate your Firebase configuration
./scripts/validate-firebase-production.sh

# Check for prohibited patterns in your code
git grep -l "FIREBASE_EMULATOR_HOST\|USE_MOCKS.*true" -- '*.js' '*.jsx' '*.ts' '*.tsx'
```

**Policy violations will block PR merges and deployments.**

## 📦 Dependencies

### Adding New Dependencies

- Justify the need for new dependencies
- Consider bundle size impact
- Prefer well-maintained packages
- Update package.json and documentation

### Backend Dependencies
- Express.js for API framework
- Firebase Admin SDK for authentication
- Winston for logging
- Jest for testing

### Frontend Dependencies
- React and React Native Web
- Styled Components for styling
- React Router for navigation
- React Hook Form for forms

## 🚀 Deployment

### Staging Environment

- All PRs are automatically deployed to staging
- Test thoroughly before requesting review
- Include deployment notes in PR description

### Production Deployment

- Only maintainers can deploy to production
- All tests must pass
- Requires code review approval
- Follow semantic versioning

## 📱 Mobile Development

- Test on various screen sizes
- Follow mobile-first design principles
- Ensure touch-friendly interactions
- Test on iOS and Android browsers

## 🎨 Design Guidelines

- Follow brand colors and typography
- Maintain consistent spacing and layouts
- Use provided component library
- Consider accessibility in design decisions

## 🤖 AI Integration

When working with AI features:

- Test with various inputs
- Handle API failures gracefully
- Consider rate limiting
- Protect user privacy

## 📊 Performance

- Monitor bundle size
- Optimize images and assets
- Use lazy loading where appropriate
- Profile and benchmark changes

## 🌐 Accessibility

- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Test with screen readers
- Follow WCAG 2.1 guidelines

## ❓ Getting Help

- Check existing documentation first
- Search GitHub issues
- Join our Discord community
- Ask questions in discussions
- Reach out to maintainers

## 📞 Contact

- **Project Lead**: [GitHub Issues](https://github.com/GooseyPrime/yoohooguru/issues)
- **Community**: Discord (coming soon)
- **Email**: support@yoohoo.guru

## 🙏 Recognition

Contributors will be:

- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Invited to contributor events
- Given community recognition

Thank you for helping make yoohoo.guru better! 🎯