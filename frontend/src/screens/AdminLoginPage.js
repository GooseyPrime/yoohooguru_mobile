import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: var(--text);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-size: var(--text-sm);
  margin: 0;
  padding: 0.5rem 0;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  margin-top: 1rem;
  text-align: center;
  width: 100%;
  
  &:hover {
    color: var(--primary);
  }
`;

function AdminLoginPage() {
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ key: adminKey }),
      });

      if (response.ok) {
        navigate('/admin', { replace: true });
      } else {
        const data = await response.json();
        setError(data.error?.message || 'Invalid admin key');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Container>
      <LoginCard>
        <Title>Admin Login</Title>
        <Subtitle>Enter the admin key to access the dashboard</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Enter admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            autoComplete="current-password"
            required
            disabled={loading}
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !adminKey.trim()}
            style={{ width: '100%' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>

        <BackLink onClick={handleBackToHome}>
          ← Back to Home
        </BackLink>
      </LoginCard>
    </Container>
  );
}

export default AdminLoginPage;