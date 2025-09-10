import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import SignupPage from './screens/SignupPage';

// Mock theme for styled-components
const mockTheme = {
  colors: {
    bg: '#040118',
    surface: '#0A0B1E',
    elev: '#111225',
    text: '#E8EDF2',
    muted: '#9AA7B2',
    border: '#1A1D35',
    pri: '#00c78c',
    succ: '#00c78c',
    warn: '#F5B950',
    err: '#F26D6D',
    accent: '#00c78c'
  },
  radius: { sm: 6, md: 8, lg: 12, xl: 16 },
  shadow: {
    card: '0 4px 20px rgba(0,0,0,.25)',
    lg: '0 8px 32px rgba(0,0,0,.3)',
    xl: '0 12px 48px rgba(0,0,0,.35)'
  },
  motion: {
    fast: '120ms', med: '180ms', slow: '240ms',
    in: 'cubic-bezier(.2,.7,.25,1)', out: 'cubic-bezier(.3,.1,.2,1)'
  },
  fonts: {
    sans: `'Inter var', Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
  }
};

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock AuthContext
const mockSignup = jest.fn();
const mockLoginWithGoogle = jest.fn();

jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    signup: mockSignup,
    loginWithGoogle: mockLoginWithGoogle,
    isFirebaseConfigured: false
  }),
  AuthProvider: ({ children }) => children
}));

const renderSignupPage = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={mockTheme}>
        <SignupPage />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form with basic elements', () => {
    renderSignupPage();
    
    expect(screen.getByText('Join yoohoo.guru')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('password visibility toggle works for password field', () => {
    renderSignupPage();
    
    const passwordInput = screen.getByLabelText('Password');
    const passwordToggle = passwordInput.nextElementSibling;
    
    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(passwordToggle);
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(passwordToggle);
    expect(passwordInput.type).toBe('password');
  });

  test('password visibility toggle works for confirm password field', () => {
    renderSignupPage();
    
    const confirmPasswordInputs = screen.getAllByPlaceholderText(/confirm your password/i);
    const confirmPasswordInput = confirmPasswordInputs[0];
    const confirmPasswordToggle = confirmPasswordInput.nextElementSibling;
    
    expect(confirmPasswordInput.type).toBe('password');
    
    fireEvent.click(confirmPasswordToggle);
    expect(confirmPasswordInput.type).toBe('text');
    
    fireEvent.click(confirmPasswordToggle);
    expect(confirmPasswordInput.type).toBe('password');
  });

  test('shows Google signup button with warning when Firebase not configured', () => {
    renderSignupPage();
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    expect(googleButton).toBeInTheDocument();
    expect(googleButton).toHaveAttribute('disabled');
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  test('contains password fields with proper placeholders', () => {
    renderSignupPage();
    
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });
});