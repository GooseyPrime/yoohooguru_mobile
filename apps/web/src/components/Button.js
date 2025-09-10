import React from 'react';
import styled from 'styled-components';

const Base = styled.button`
  display: inline-flex; 
  align-items: center; 
  gap: 0.5rem;
  padding: 0.625rem 0.95rem; 
  border-radius: var(--r-md);
  border: 1px solid transparent; 
  background: transparent; 
  color: var(--text);
  cursor: pointer; 
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: 500;
  font-size: 1rem;
  transition: transform var(--t-fast) ${({ theme }) => theme.motion.in},
    background var(--t-fast) ${({ theme }) => theme.motion.in}, 
    border-color var(--t-fast) ${({ theme }) => theme.motion.in},
    color var(--t-fast) ${({ theme }) => theme.motion.in};
  will-change: transform;
  
  &:active { 
    transform: translateY(1px); 
  }
  
  &:focus-visible { 
    outline: 2px solid var(--pri); 
    outline-offset: 2px; 
    border-radius: calc(var(--r-md) + 2px); 
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  /* Size variants */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          min-height: 32px;
        `;
      case 'lg':
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
          min-height: 48px;
        `;
      case 'xl':
        return `
          padding: 1rem 2rem;
          font-size: 1.25rem;
          min-height: 56px;
        `;
      default: // md
        return `
          padding: 0.625rem 0.95rem;
          font-size: 1rem;
          min-height: 40px;
        `;
    }
  }}

  /* Full width */
  ${props => props.$fullWidth && `width: 100%;`}
`;

export const Primary = styled(Base)`
  background: linear-gradient(180deg, rgba(124,140,255,.16), rgba(124,140,255,.06));
  border-color: rgba(124,140,255,.45);
  color: #DDE2FF;
  
  &:hover:not(:disabled) { 
    background: linear-gradient(180deg, rgba(124,140,255,.24), rgba(124,140,255,.10)); 
  }
`;

export const Ghost = styled(Base)`
  border-color: var(--border);
  background: var(--surface);
  
  &:hover:not(:disabled) { 
    border-color: #2E3540; 
  }
`;

export const Secondary = styled(Base)`
  background: var(--succ);
  color: var(--bg);
  border-color: var(--succ);
  
  &:hover:not(:disabled) {
    background: #1FA876;
    border-color: #1FA876;
  }
`;

export const Outline = styled(Base)`
  background: transparent;
  color: var(--pri);
  border-color: var(--pri);
  
  &:hover:not(:disabled) {
    background: rgba(124,140,255,.10);
    color: #DDE2FF;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function Button({
  children,
  variant = 'ghost',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props
}) {
  
  const ButtonComponent = {
    primary: Primary,
    secondary: Secondary,
    outline: Outline,
    ghost: Ghost,
  }[variant] || Ghost;
  
  return (
    <ButtonComponent
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </ButtonComponent>
  );
}

export default Button;