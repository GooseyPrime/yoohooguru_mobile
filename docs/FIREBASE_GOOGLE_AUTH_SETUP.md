# Firebase Google Authentication Setup Guide

This guide explains how to set up Firebase for Google Authentication in the yoohoo.guru platform.

## Current Status

🚨 **Google Authentication is currently unavailable** because Firebase environment variables are not configured.

The application is designed to gracefully handle this situation by:
- Showing helpful console logs with setup instructions
- Disabling Google Auth buttons with clear warning indicators (⚠️)
- Providing detailed error messages to help developers configure Firebase

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

### 2. Enable Google Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Add your domain to **Authorized domains** (e.g., `localhost`, `yoohoo.guru`)

### 3. Get Firebase Configuration

1. Go to **Project settings** → **General**
2. Scroll down to "Your apps" and add a web app
3. Copy the Firebase configuration object

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Update the Firebase variables in `.env`:
   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_actual_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

### 5. Restart the Development Server

```bash
cd frontend
npm run dev
```

## Troubleshooting

### Common Issues

1. **"Google Sign-in is not enabled"**
   - Ensure Google is enabled in Firebase Console → Authentication → Sign-in method

2. **"This domain is not authorized"**
   - Add your domain to Authorized domains in Firebase Console

3. **"Popup blocked"**
   - Allow popups for the development domain in browser settings

4. **"Operation not allowed"**
   - Check Firebase project permissions and billing status

### Error Codes

The application provides specific error handling for common Google Auth errors:

- `auth/popup-closed-by-user` - User cancelled the sign-in
- `auth/popup-blocked` - Browser blocked the popup
- `auth/cancelled-popup-request` - Sign-in cancelled
- `auth/operation-not-allowed` - Google Auth not enabled
- `auth/unauthorized-domain` - Domain not authorized

## Development Mode

When Firebase is not configured, the application runs in "offline mode":
- ✅ Regular email/password auth uses mock functions
- ⚠️ Google Auth buttons are disabled with clear indicators
- 📝 Console shows helpful setup instructions
- 🔄 No crashes or broken functionality

## Testing Google Auth

Once Firebase is configured:

1. Click "Continue with Google" on login/signup pages
2. Complete the Google OAuth flow
3. User will be automatically signed in and redirected to dashboard
4. User profile will be created in the backend (if API is available)

## Backend Integration

The frontend sends the Google Auth token to the backend at:
- `POST /api/auth/register` - For new Google users
- User profile includes Google user data (email, name, photo)

For backend Firebase configuration, see `backend/src/config/firebase.js`.