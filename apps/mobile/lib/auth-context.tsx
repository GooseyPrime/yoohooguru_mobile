/**
 * Authentication context for mobile app using shared SDK
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

import { createSdk, AuthState, AuthUser, YooHooSdk } from '@yoohoo-guru/sdk';

// Firebase config (should be in environment variables)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize SDK
const sdk = createSdk({
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.yoohoo.guru',
  firebaseAuth: auth,
});

interface AuthContextValue extends AuthState {
  sdk: YooHooSdk;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = sdk.auth.subscribe((state) => {
      setAuthState(state);
      
      // Persist auth state
      if (state.user) {
        SecureStore.setItemAsync('user', JSON.stringify(state.user));
      } else {
        SecureStore.deleteItemAsync('user');
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    return sdk.auth.signIn({ email, password });
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthUser> => {
    return sdk.auth.signUp({ email, password, displayName });
  };

  const signOut = async (): Promise<void> => {
    return sdk.auth.signOut();
  };

  const value: AuthContextValue = {
    ...authState,
    sdk,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useSDK(): YooHooSdk {
  const { sdk } = useAuth();
  return sdk;
}