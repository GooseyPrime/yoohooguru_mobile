import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(124, 140, 255, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(124, 140, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(124, 140, 255, 0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--pri) 0%, var(--succ) 100%);
  color: white;
  font-family: ${({ theme }) => theme.fonts.sans};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const YoohooLogo = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  animation: ${pulse} 2s infinite;
`;

const LoadingText = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const LoadingSubtitle = styled.div`
  font-size: 14px;
  opacity: 0.8;
  font-weight: 400;
`;

function LoadingScreen({ message = 'Loading your skill-sharing platform...' }) {
  return (
    <LoadingContainer>
      <LoadingContent>
        <YoohooLogo>🎯</YoohooLogo>
        <LoadingText>{process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}</LoadingText>
        <LoadingSubtitle>{message}</LoadingSubtitle>
      </LoadingContent>
    </LoadingContainer>
  );
}

export default LoadingScreen;