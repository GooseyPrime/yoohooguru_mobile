import React from 'react';
import styled from 'styled-components';
import { User, AlertCircle, WifiOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--r-md);
  background: ${props => props.background || 'transparent'};
  font-size: var(--text-sm);
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.color || 'var(--muted)'};
`;

const StatusText = styled.span`
  color: ${props => props.color || 'var(--text)'};
  font-weight: var(--font-medium);
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

function AuthStatusIndicator({ showText = true, compact = false }) {
  const { currentUser, loading, isFirebaseConfigured } = useAuth();

  if (loading) {
    return (
      <StatusContainer>
        <StatusIcon color="var(--muted)">
          <User size={16} />
        </StatusIcon>
        {showText && !compact && <StatusText color="var(--muted)">Loading...</StatusText>}
      </StatusContainer>
    );
  }

  if (!isFirebaseConfigured) {
    return (
      <StatusContainer background="rgba(251, 146, 60, 0.1)">
        <StatusIcon color="var(--warn)">
          <WifiOff size={16} />
        </StatusIcon>
        {showText && !compact && (
          <StatusText color="var(--warn)">Offline Mode</StatusText>
        )}
      </StatusContainer>
    );
  }

  if (currentUser) {
    return (
      <StatusContainer background="rgba(39, 192, 147, 0.1)">
        <StatusIcon color="var(--succ)">
          {currentUser.photoURL ? (
            <UserAvatar src={currentUser.photoURL} alt="User" />
          ) : (
            <User size={16} />
          )}
        </StatusIcon>
        {showText && !compact && (
          <StatusText color="var(--succ)">
            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
          </StatusText>
        )}
      </StatusContainer>
    );
  }

  return (
    <StatusContainer>
      <StatusIcon color="var(--muted)">
        <AlertCircle size={16} />
      </StatusIcon>
      {showText && !compact && <StatusText color="var(--muted)">Not signed in</StatusText>}
    </StatusContainer>
  );
}

export default AuthStatusIndicator;