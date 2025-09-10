/**
 * Shared Firebase Auth Client for web and mobile platforms
 */

import { 
  Auth, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
  UserCredential
} from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  displayName?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export type AuthStateListener = (state: AuthState) => void;

export class AuthClient {
  private auth: Auth;
  private listeners: Set<AuthStateListener> = new Set();
  private currentState: AuthState = {
    user: null,
    loading: true,
    error: null
  };

  constructor(auth: Auth) {
    this.auth = auth;
    this.initialize();
  }

  private initialize(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.updateState({
        user: user ? this.mapFirebaseUser(user) : null,
        loading: false,
        error: null
      });
    });
  }

  private mapFirebaseUser(firebaseUser: User): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified
    };
  }

  private updateState(newState: Partial<AuthState>): void {
    this.currentState = { ...this.currentState, ...newState };
    this.listeners.forEach(listener => listener(this.currentState));
  }

  public subscribe(listener: AuthStateListener): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current state
    listener(this.currentState);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentState.user;
  }

  public getState(): AuthState {
    return this.currentState;
  }

  public async getIdToken(): Promise<string | null> {
    if (!this.auth.currentUser) {
      return null;
    }

    try {
      return await getIdToken(this.auth.currentUser);
    } catch (error) {
      console.warn('Failed to get Firebase ID token:', error);
      return null;
    }
  }

  public async signIn(credentials: SignInCredentials): Promise<AuthUser> {
    try {
      this.updateState({ loading: true, error: null });
      
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth, 
        credentials.email, 
        credentials.password
      );
      
      const user = this.mapFirebaseUser(userCredential.user);
      this.updateState({ user, loading: false });
      
      return user;
    } catch (error: any) {
      const errorMessage = this.getAuthErrorMessage(error.code);
      this.updateState({ 
        user: null, 
        loading: false, 
        error: errorMessage 
      });
      throw new Error(errorMessage);
    }
  }

  public async signUp(credentials: SignUpCredentials): Promise<AuthUser> {
    try {
      this.updateState({ loading: true, error: null });
      
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        this.auth, 
        credentials.email, 
        credentials.password
      );
      
      const user = this.mapFirebaseUser(userCredential.user);
      this.updateState({ user, loading: false });
      
      return user;
    } catch (error: any) {
      const errorMessage = this.getAuthErrorMessage(error.code);
      this.updateState({ 
        user: null, 
        loading: false, 
        error: errorMessage 
      });
      throw new Error(errorMessage);
    }
  }

  public async signOut(): Promise<void> {
    try {
      this.updateState({ loading: true, error: null });
      await signOut(this.auth);
      this.updateState({ user: null, loading: false });
    } catch (error: any) {
      const errorMessage = 'Failed to sign out. Please try again.';
      this.updateState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }
}

// Global auth client instance
export let authClient: AuthClient;

export function createAuthClient(auth: Auth): AuthClient {
  authClient = new AuthClient(auth);
  return authClient;
}