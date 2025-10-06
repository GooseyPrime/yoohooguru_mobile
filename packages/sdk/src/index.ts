/**
 * yoohoo.guru SDK - Shared API client, types, and validators
 */

// Re-export all types
export * from './types';
export * from './validators';

// Re-export HTTP client
export * from './lib/http';

// Re-export auth client
export * from './lib/auth';

// Re-export API services
export * from './lib/skills';
export * from './lib/users';

// SDK configuration and initialization
import { Auth } from 'firebase/auth';
import { createHttpClient, HttpClient } from './lib/http';
import { createAuthClient, AuthClient } from './lib/auth';

export interface SdkConfig {
  apiBaseUrl: string;
  firebaseAuth: Auth;
}

export interface YooHooSdk {
  http: HttpClient;
  auth: AuthClient;
}

/**
 * Initialize the yoohoo.guru SDK
 */
export function createSdk(config: SdkConfig): YooHooSdk {
  // Create auth client
  const auth = createAuthClient(config.firebaseAuth);
  
  // Create HTTP client with auth token provider
  const http = createHttpClient({
    baseUrl: config.apiBaseUrl,
    getAuthToken: () => auth.getIdToken()
  });

  return {
    http,
    auth
  };
}

// Version
export const VERSION = '1.0.0';