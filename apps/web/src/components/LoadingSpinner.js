import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  border: 2px solid transparent;
  border-top: 2px solid ${props => props.color || 'var(--pri)'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.span`
  margin-left: 8px;
  color: ${props => props.theme?.colors?.muted || 'var(--muted)'};
  font-size: 14px;
`;

function LoadingSpinner({ size, color, text, className }) {
  return (
    <SpinnerWrapper className={className}>
      <Spinner size={size} color={color} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerWrapper>
  );
}

export default LoadingSpinner;