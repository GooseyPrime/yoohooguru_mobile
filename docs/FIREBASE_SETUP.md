# Firebase Setup Guide

This guide will help you set up Firebase authentication for the yoohoo.guru application.

## Prerequisites

- A Google account
- Basic knowledge of environment variables

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "yoohoo-guru-dev" for development)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google** (optional): Click on it, toggle "Enable", and configure OAuth

## Step 3: Get Your Firebase Configuration

1. Click on the gear icon (Project settings) in the left sidebar
2. Scroll down to "Your apps" section
3. Click on "Add app" and select the web icon `</>`
4. Register your app with a nickname (e.g., "yoohoo-guru-web")
5. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Configure Environment Variables

1. Create or update your `.env` file in the project root
2. Replace the placeholder values with your actual Firebase configuration:

```env
# Firebase Configuration
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# React App Firebase Variables (required for frontend)
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

## Step 5: Set Up Realtime Database (for Backend)

1. In Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Choose a location close to your users
4. Start in test mode (you can configure security rules later)

## Step 6: Generate Service Account Key (for Backend)

1. Go to Project Settings → Service Accounts tab
2. Click "Generate new private key"
3. Save the JSON file securely
4. Set the environment variable:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
   ```

## Step 7: Test Your Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Go to the signup page: http://localhost:3000/signup
3. Try creating an account with a valid email address
4. You should see a success message and be redirected to the dashboard

## Security Considerations

### For Development:
- Use a separate Firebase project for development
- Test mode database rules are fine for development

### For Production:
- Use environment-specific Firebase projects
- Configure proper database security rules
- Set up proper authentication rules
- Use Firebase security best practices

## Troubleshooting

### Common Issues:

1. **"Firebase not configured" error**:
   - Check that all REACT_APP_ prefixed variables are set
   - Ensure values are not placeholder values (demo-api-key, etc.)

2. **"Network request failed" error**:
   - Check that Firebase project is created and active
   - Verify API key is correct
   - Ensure authentication is enabled in Firebase Console

3. **"Project not found" error**:
   - Verify the project ID matches your Firebase project
   - Check that the project hasn't been deleted

4. **Permission denied errors**:
   - Check Firebase authentication rules
   - Verify the user is properly authenticated

### Getting Help:

- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the Firebase Console for any error messages
- Check browser developer tools for detailed error messages

## Example Working Configuration

Once properly configured, your signup process should:

1. ✅ Show the signup form with password visibility toggles
2. ✅ Validate form inputs client-side
3. ✅ Create the user in Firebase Authentication
4. ✅ Create a user profile in the Realtime Database
5. ✅ Show success message and redirect to dashboard

## Next Steps

After setting up Firebase:

1. Configure email verification (optional)
2. Set up password reset functionality
3. Configure social sign-in providers (Google, Facebook, etc.)
4. Set up proper Firebase security rules
5. Configure backup and monitoring for production

---

**Note**: Keep your Firebase configuration secure and never commit sensitive credentials to version control. Use environment variables for all configuration values.