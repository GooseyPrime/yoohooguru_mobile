import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadow.card};
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const Description = styled.p`
  font-size: var(--text-base);
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: var(--text-sm);
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasToggle'
})`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--r-md);
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: var(--text-base);
  transition: all var(--t-fast);
  padding-right: ${props => props.hasToggle ? '2.5rem' : '0.75rem'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
    box-shadow: 0 0 0 2px rgba(124, 140, 255, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.muted};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--t-fast);
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  
  &:focus {
    outline: none;
    color: ${props => props.theme.colors.pri};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.err};
  font-size: var(--text-sm);
  margin-top: 0.25rem;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.theme.colors.muted};
  
  a {
    color: ${props => props.theme.colors.pri};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, loginWithGoogle, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      
      toast.success('Account created successfully! Please check your email to verify your account.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Join {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}</Title>
        <Description>
          Create your account to start sharing skills and building meaningful connections.
        </Description>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              autoComplete="given-name"
              required
            />
            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              autoComplete="family-name"
              required
            />
            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                hasToggle={true}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWrapper>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                hasToggle={true}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </InputGroup>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '1.5rem 0',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
          <span style={{ padding: '0 1rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
        </div>

        <Button 
          variant="outline" 
          size="lg"
          disabled={!isFirebaseConfigured}
          loading={isGoogleLoading}
          onClick={handleGoogleSignup}
          title={!isFirebaseConfigured ? "Google Sign-up requires Firebase configuration" : "Sign up with Google"}
          style={{ width: '100%' }}
        >
          Continue with Google
          {!isFirebaseConfigured && <span style={{ fontSize: '0.8em', marginLeft: '0.5rem' }}>⚠️</span>}
        </Button>

        <LoginLink>
          Already have an account? <a href="/login">Sign in</a>
        </LoginLink>
      </Content>
    </Container>
  );
}

export default SignupPage;