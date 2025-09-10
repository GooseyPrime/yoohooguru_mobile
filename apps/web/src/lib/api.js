/**
 * API utility for backend communication with Firebase auth integration
 */

import { auth } from '../contexts/AuthContext';

// Get Firebase auth token
async function getAuthToken() {
  if (!auth || !auth.currentUser) {
    return null;
  }
  
  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.warn('Failed to get Firebase auth token:', error);
    return null;
  }
}

// Enhanced error handling with specific auth error messages
function handleApiError(error, response) {
  // Handle authentication errors
  if (response?.status === 401) {
    return new Error('Authentication required. Please sign in and try again.');
  }
  
  if (response?.status === 403) {
    return new Error('Access denied. You don\'t have permission to perform this action.');
  }
  
  if (response?.status === 429) {
    return new Error('Too many requests. Please wait a moment and try again.');
  }
  
  if (response?.status >= 500) {
    return new Error('Server error. Please try again later.');
  }
  
  // Return specific error message from API or fallback
  return new Error(error?.message || 'Request failed. Please check your connection and try again.');
}

// Main API function with Firebase auth integration
export async function api(path, opts = {}) {
  const token = await getAuthToken();
  const apiUrl = process.env.REACT_APP_API_URL || '/api';
  
  try {
    const res = await fetch(`${apiUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers || {})
      },
      ...opts
    });
    
    let json = {};
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      json = await res.json();
    }
    
    if (!res.ok) {
      throw handleApiError(json?.error, res);
    }
    
    return json;
  } catch (error) {
    // Network errors, timeouts, etc.
    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
}

// Convenience functions for common HTTP methods
export const apiGet = (path, opts = {}) => api(path, { method: 'GET', ...opts });
export const apiPost = (path, data, opts = {}) => api(path, { 
  method: 'POST', 
  body: JSON.stringify(data), 
  ...opts 
});
export const apiPut = (path, data, opts = {}) => api(path, { 
  method: 'PUT', 
  body: JSON.stringify(data), 
  ...opts 
});
export const apiDelete = (path, opts = {}) => api(path, { method: 'DELETE', ...opts });

// Auth-aware API hook for React components
export function useAuthenticatedApi() {
  const makeApiCall = async (path, opts = {}) => {
    try {
      return await api(path, opts);
    } catch (error) {
      // Re-throw with better context
      throw new Error(`API call failed: ${error.message}`);
    }
  };
  
  return {
    api: makeApiCall,
    get: (path, opts) => apiGet(path, opts),
    post: (path, data, opts) => apiPost(path, data, opts),
    put: (path, data, opts) => apiPut(path, data, opts),
    delete: (path, opts) => apiDelete(path, opts)
  };
}
