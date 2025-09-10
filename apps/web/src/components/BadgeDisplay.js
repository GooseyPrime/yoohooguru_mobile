import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin: 1rem 0;
`;

const SectionTitle = styled.h3`
  color: var(--gray-900);
  font-size: var(--text-lg);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🏆';
    font-size: var(--text-xl);
  }
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const BadgeCard = styled.div`
  border: 2px solid ${props => props.earned ? props.badgeColor : 'var(--gray-300)'};
  border-radius: var(--radius-md);
  padding: 1rem;
  background: ${props => props.earned ? 
    `linear-gradient(135deg, ${props.badgeColor}10, ${props.badgeColor}05)` : 
    'var(--gray-50)'
  };
  position: relative;
  transition: all 0.2s ease;

  ${props => props.clickable && `
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  `}

  ${props => props.pending && `
    border-color: var(--warning-yellow);
    background: var(--warning-light);
  `}
`;

const BadgeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const BadgeIcon = styled.span`
  font-size: var(--text-2xl);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.badgeColor || 'var(--gray-200)'};
  border-radius: var(--radius-full);
  color: white;
`;

const BadgeName = styled.h4`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin: 0;
`;

const BadgeDescription = styled.p`
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 0.5rem 0;
  line-height: 1.4;
`;

const BadgeStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);

  .status-earned {
    color: var(--success-green);
  }

  .status-pending {
    color: var(--warning-dark);
  }

  .status-available {
    color: var(--primary);
  }

  .status-not-required {
    color: var(--gray-500);
  }
`;

const RequiredBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--danger-red);
  color: white;
  font-size: var(--text-xs);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-weight: var(--font-medium);
`;

const RequestButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  margin-top: 0.75rem;
  width: 100%;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }

  &:disabled {
    background: var(--gray-400);
    cursor: not-allowed;
  }
`;

const ComplianceScore = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white;
  padding: 1rem;
  border-radius: var(--radius-md);
  text-align: center;
  margin-bottom: 1.5rem;

  .score {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    margin-bottom: 0.25rem;
  }

  .label {
    font-size: var(--text-sm);
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);

  .icon {
    font-size: var(--text-4xl);
    margin-bottom: 1rem;
  }

  .message {
    font-size: var(--text-lg);
    margin-bottom: 0.5rem;
  }

  .description {
    font-size: var(--text-sm);
    line-height: 1.5;
  }
`;

function BadgeDisplay({ skillCategory, userId, showRequestOptions = false, onBadgeRequest }) {
  const { user } = useAuth();
  const [badgeRequirements, setBadgeRequirements] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);

  useEffect(() => {
    if (skillCategory) {
      fetchBadgeRequirements();
    }
    if (userId || user) {
      fetchUserBadges();
    }
  }, [skillCategory, userId, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBadgeRequirements = async () => {
    try {
      const targetUserId = userId || (user ? user.uid : null);
      const response = await fetch(
        `/api/badges/requirements/${skillCategory}${targetUserId ? `?userId=${targetUserId}` : ''}`,
        {
          headers: {
            'Authorization': user ? `Bearer ${await user.getIdToken()}` : ''
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setBadgeRequirements(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch badge requirements:', error);
    }
  };

  const fetchUserBadges = async () => {
    try {
      setLoading(true);
      const targetUserId = userId || (user ? user.uid : null);
      
      if (!targetUserId) return;

      const endpoint = userId ? `/api/badges/user/${userId}` : '/api/badges/my-badges';
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': user ? `Bearer ${await user.getIdToken()}` : ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserBadges(userId ? data.data.badges : data.data.approvedBadges);
      }
    } catch (error) {
      console.error('Failed to fetch user badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBadge = async (badgeType) => {
    if (!user || requesting) return;

    setRequesting(badgeType);
    try {
      if (onBadgeRequest) {
        await onBadgeRequest(badgeType);
      } else {
        // Default badge request flow - would open a modal or form
        alert(`Badge request for ${badgeType} would open here`);
      }
      await fetchBadgeRequirements();
      await fetchUserBadges();
    } catch (error) {
      console.error('Badge request failed:', error);
      alert('Failed to request badge. Please try again.');
    } finally {
      setRequesting(null);
    }
  };

  const getStatusInfo = (badgeType, badgeData) => {
    const userStatus = badgeRequirements?.userBadgeStatus?.[badgeType];
    
    if (userStatus?.status === 'earned') {
      return {
        status: 'earned',
        label: '✅ Earned',
        className: 'status-earned',
        date: userStatus.approvedAt
      };
    }
    
    if (userStatus?.status === 'pending') {
      return {
        status: 'pending',
        label: '⏳ Pending Review',
        className: 'status-pending',
        date: userStatus.submittedAt
      };
    }
    
    if (badgeData.required) {
      return {
        status: 'required',
        label: '📋 Required',
        className: 'status-available'
      };
    }
    
    return {
      status: 'available',
      label: '💡 Recommended',
      className: 'status-not-required'
    };
  };

  if (loading) {
    return (
      <Container>
        <SectionTitle>Badges & Certifications</SectionTitle>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: 'var(--text-lg)', color: 'var(--gray-600)' }}>
            Loading badges...
          </div>
        </div>
      </Container>
    );
  }

  if (!badgeRequirements && userBadges.length === 0) {
    return (
      <Container>
        <SectionTitle>Badges & Certifications</SectionTitle>
        <EmptyState>
          <div className="icon">🏆</div>
          <div className="message">No badges to display</div>
          <div className="description">
            Select a skill category to see relevant badges and certifications.
          </div>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <SectionTitle>Badges & Certifications</SectionTitle>
      
      {badgeRequirements && (
        <ComplianceScore>
          <div className="score">{badgeRequirements.complianceScore}%</div>
          <div className="label">Compliance Score</div>
        </ComplianceScore>
      )}
      
      <BadgeGrid>
        {badgeRequirements ? (
          badgeRequirements.requiredBadges.map((badge) => {
            const statusInfo = getStatusInfo(badge.badgeType, badge);
            return (
              <BadgeCard
                key={badge.badgeType}
                earned={statusInfo.status === 'earned'}
                pending={statusInfo.status === 'pending'}
                badgeColor={badge.color}
                clickable={showRequestOptions && statusInfo.status === 'available'}
                onClick={() => {
                  if (showRequestOptions && statusInfo.status === 'available') {
                    handleRequestBadge(badge.badgeType);
                  }
                }}
              >
                {badge.required && <RequiredBadge>REQUIRED</RequiredBadge>}
                
                <BadgeHeader>
                  <BadgeIcon badgeColor={badge.color}>
                    {badge.icon}
                  </BadgeIcon>
                  <BadgeName>{badge.name}</BadgeName>
                </BadgeHeader>
                
                <BadgeDescription>{badge.description}</BadgeDescription>
                
                <BadgeStatus>
                  <span className={statusInfo.className}>
                    {statusInfo.label}
                  </span>
                  {statusInfo.date && (
                    <span style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>
                      {new Date(statusInfo.date).toLocaleDateString()}
                    </span>
                  )}
                </BadgeStatus>
                
                {showRequestOptions && statusInfo.status === 'available' && (
                  <RequestButton
                    disabled={requesting === badge.badgeType}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestBadge(badge.badgeType);
                    }}
                  >
                    {requesting === badge.badgeType ? 'Requesting...' : 'Request Badge'}
                  </RequestButton>
                )}
              </BadgeCard>
            );
          })
        ) : (
          userBadges.map((badge) => (
            <BadgeCard
              key={badge.badgeType || badge.id}
              earned={true}
              badgeColor={badge.badgeInfo?.color || badge.color}
            >
              <BadgeHeader>
                <BadgeIcon badgeColor={badge.badgeInfo?.color || badge.color}>
                  {badge.badgeInfo?.icon || badge.icon || '🏆'}
                </BadgeIcon>
                <BadgeName>{badge.badgeInfo?.name || badge.name}</BadgeName>
              </BadgeHeader>
              
              <BadgeDescription>
                {badge.badgeInfo?.description || badge.description}
              </BadgeDescription>
              
              <BadgeStatus>
                <span className="status-earned">✅ Earned</span>
                <span style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>
                  {new Date(badge.approvedAt).toLocaleDateString()}
                </span>
              </BadgeStatus>
            </BadgeCard>
          ))
        )}
      </BadgeGrid>
    </Container>
  );
}

export default BadgeDisplay;