import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

/**
 * AdminGuard component to protect admin routes
 * Checks for admin authentication and redirects to login if needed
 */
function AdminGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('/api/admin/ping', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/admin/login', { replace: true });
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        setIsAuthenticated(false);
        navigate('/admin/login', { replace: true });
      }
    };

    checkAdminAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default AdminGuard;