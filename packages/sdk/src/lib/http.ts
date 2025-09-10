/**
 * HTTP Client for yoohoo.guru API with Firebase auth integration
 */

import { User as FirebaseUser } from 'firebase/auth';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiConfig {
  baseUrl: string;
  getAuthToken?: () => Promise<string | null>;
}

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class HttpClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.getAuthToken) {
      try {
        const token = await this.config.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
    }

    return headers;
  }

  private handleApiError(error: any, response?: Response): ApiError {
    const status = response?.status;

    if (status === 401) {
      return {
        message: 'Authentication required. Please sign in and try again.',
        status,
        code: 'UNAUTHORIZED'
      };
    }

    if (status === 403) {
      return {
        message: 'Access denied. You don\'t have permission to perform this action.',
        status,
        code: 'FORBIDDEN'
      };
    }

    if (status === 429) {
      return {
        message: 'Too many requests. Please wait a moment and try again.',
        status,
        code: 'RATE_LIMITED'
      };
    }

    if (status && status >= 500) {
      return {
        message: 'Server error. Please try again later.',
        status,
        code: 'SERVER_ERROR'
      };
    }

    return {
      message: error?.message || 'Request failed. Please check your connection and try again.',
      status,
      code: 'UNKNOWN_ERROR'
    };
  }

  public async request<T = any>(
    path: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    
    try {
      const response = await fetch(`${this.config.baseUrl}${path}`, {
        headers: {
          ...authHeaders,
          ...(options.headers || {})
        },
        ...options
      });

      let data: any = {};
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw this.handleApiError(data?.error || data, response);
      }

      return data as T;
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          message: 'Network error. Please check your internet connection.',
          code: 'NETWORK_ERROR'
        };
      }
      throw error;
    }
  }

  public async get<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  public async post<T = any>(
    path: string, 
    data?: any, 
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public async put<T = any>(
    path: string, 
    data?: any, 
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  public async delete<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

// Default HTTP client instance (will be configured by auth client)
export let httpClient: HttpClient;

export function createHttpClient(config: ApiConfig): HttpClient {
  httpClient = new HttpClient(config);
  return httpClient;
}