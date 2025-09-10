import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Protected Route component that requires authentication
 * Redirects to login page if user is not authenticated
 */
function ProtectedRoute({ children, requireProfile = false }) {
  const { currentUser, userProfile, loading, isFirebaseConfigured } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  // If Firebase is not configured, allow access but show warning
  if (!isFirebaseConfigured) {
    console.warn('⚠️ ProtectedRoute: Firebase not configured, allowing access in development');
    return children;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: 'Please sign in to access this page.'
        }} 
        replace 
      />
    );
  }

  // If route requires profile and user doesn't have one, redirect to profile setup
  if (requireProfile && !userProfile) {
    return (
      <Navigate 
        to="/profile" 
        state={{ 
          from: location,
          message: 'Please complete your profile to continue.'
        }} 
        replace 
      />
    );
  }

  // User is authenticated and meets requirements, render children
  return children;
}

export default ProtectedRoute;