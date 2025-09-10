import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Logo from '../components/Logo';

const LoginContainer = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const LoginCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-xl);
  box-shadow: ${props => props.theme.shadow.card};
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-weight: var(--font-medium);
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--r-md);
  font-size: var(--text-base);
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  transition: border-color var(--t-fast);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
    box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.1);
  }

  &.error {
    border-color: ${props => props.theme.colors.err};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: ${props => props.theme.colors.muted};
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.muted};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.err};
  font-size: var(--text-sm);
  margin-top: 0.25rem;
  display: block;
`;

const ForgotPassword = styled(Link)`
  color: ${props => props.theme.colors.pri};
  font-size: var(--text-sm);
  text-decoration: none;
  display: block;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
  
  span {
    margin: 0 1rem;
    color: ${props => props.theme.colors.muted};
    font-size: var(--text-sm);
  }
`;

const SignupLink = styled.p`
  margin-top: 2rem;
  color: ${props => props.theme.colors.muted};
  
  a {
    color: ${props => props.theme.colors.pri};
    text-decoration: none;
    font-weight: var(--font-medium);
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function LoginPage() {
  const { login, loginWithGoogle, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Get redirect destination from location state
  const from = location.state?.from?.pathname || '/dashboard';
  const redirectMessage = location.state?.message;

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoWrapper>
          <Logo showImage={true} size="small" />
        </LogoWrapper>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} account</Subtitle>
        
        {redirectMessage && (
          <div style={{ 
            background: 'rgba(124, 140, 255, 0.1)', 
            border: '1px solid rgba(124, 140, 255, 0.3)',
            borderRadius: 'var(--r-md)',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: 'var(--text-sm)',
            color: 'var(--pri)',
            textAlign: 'center'
          }}>
            {redirectMessage}
          </div>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={16} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className={errors.email ? 'error' : ''}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </InputWrapper>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={16} />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={errors.password ? 'error' : ''}
                {...register('password', {
                  required: 'Password is required'
                })}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </InputGroup>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={isLoading}
          >
            Sign In
          </Button>
        </Form>

        <ForgotPassword to="/forgot-password">
          Forgot your password?
        </ForgotPassword>

        <Divider>
          <span>OR</span>
        </Divider>

        <Button 
          variant="outline" 
          fullWidth
          loading={isGoogleLoading}
          disabled={!isFirebaseConfigured}
          onClick={handleGoogleLogin}
          title={!isFirebaseConfigured ? "Google Sign-in requires Firebase configuration" : "Sign in with Google"}
        >
          Continue with Google
          {!isFirebaseConfigured && <span style={{ fontSize: '0.8em', marginLeft: '0.5rem' }}>⚠️</span>}
        </Button>

        <SignupLink>
          Don&apos;t have an account?{' '}
          <Link to="/signup">Sign up for free</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
}

export default LoginPage;