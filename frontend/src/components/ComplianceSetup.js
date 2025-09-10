import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import BadgeDisplay from './BadgeDisplay';
import LiabilityWaiverModal from './LiabilityWaiverModal';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  color: var(--gray-900);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--gray-600);
  line-height: 1.6;
`;

const ComplianceFlow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StepCard = styled.div`
  background: white;
  border: 2px solid ${props => 
    props.completed ? 'var(--success-green)' : 
    props.active ? 'var(--primary)' : 
    'var(--gray-300)'
  };
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  transition: all 0.3s ease;

  ${props => props.active && `
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  `}
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => 
    props.completed ? 'var(--success-green)' : 
    props.active ? 'var(--primary)' : 
    'var(--gray-400)'
  };
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  flex-shrink: 0;
`;

const StepInfo = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--gray-900);
  margin-bottom: 0.25rem;
`;

const StepDescription = styled.p`
  font-size: var(--text-base);
  color: var(--gray-600);
  line-height: 1.5;
`;

const StepStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-left: auto;

  .status-completed {
    color: var(--success-green);
  }

  .status-active {
    color: var(--primary);
  }

  .status-pending {
    color: var(--gray-500);
  }
`;

const StepContent = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
`;

const RequirementsList = styled.div`
  margin-bottom: 1.5rem;
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.completed ? 'var(--success-light)' : 'var(--gray-50)'};
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
  font-size: var(--text-sm);

  .icon {
    font-size: var(--text-lg);
    flex-shrink: 0;
  }

  .text {
    flex: 1;
    color: ${props => props.completed ? 'var(--success-dark)' : 'var(--gray-700)'};
  }

  .action {
    color: var(--primary);
    text-decoration: underline;
    cursor: pointer;
    font-weight: var(--font-medium);
  }
`;

const ActionButton = styled.button`
  background: ${props => 
    props.variant === 'success' ? 'var(--success-green)' :
    props.variant === 'danger' ? 'var(--danger-red)' :
    'var(--primary)'
  };
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 1rem;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background: var(--gray-400);
    cursor: not-allowed;
    transform: none;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--success-green) 100%);
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
  width: ${props => props.percentage}%;
`;

const AlertBox = styled.div`
  background: ${props => 
    props.type === 'error' ? 'var(--danger-light)' :
    props.type === 'warning' ? 'var(--warning-light)' :
    props.type === 'success' ? 'var(--success-light)' :
    'var(--primary-light)'
  };
  border: 1px solid ${props => 
    props.type === 'error' ? 'var(--danger-red)' :
    props.type === 'warning' ? 'var(--warning-yellow)' :
    props.type === 'success' ? 'var(--success-green)' :
    'var(--primary)'
  };
  color: ${props => 
    props.type === 'error' ? 'var(--danger-red)' :
    props.type === 'warning' ? 'var(--warning-dark)' :
    props.type === 'success' ? 'var(--success-dark)' :
    'var(--primary-dark)'
  };
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  font-size: var(--text-sm);
  line-height: 1.5;
`;

function ComplianceSetup({ skillCategory, onComplete }) {
  const { user } = useAuth();
  const [complianceData, setComplianceData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Ensure all required profile information is provided',
      checkCompliance: (data) => data?.complianceStatus?.profile?.compliant || false
    },
    {
      id: 'documents',
      title: 'Submit Documents',
      description: 'Upload and verify required documentation',
      checkCompliance: (data) => data?.complianceStatus?.documents?.compliant || false
    },
    {
      id: 'badges',
      title: 'Earn Badges',
      description: 'Complete required certifications and badges',
      checkCompliance: (data) => data?.complianceStatus?.badges?.compliant || false
    },
    {
      id: 'insurance',
      title: 'Verify Insurance',
      description: 'Submit proof of required insurance coverage',
      checkCompliance: (data) => data?.complianceStatus?.insurance?.compliant || false
    },
    {
      id: 'waiver',
      title: 'Accept Waiver',
      description: 'Read and accept liability waiver for this activity',
      checkCompliance: () => false // Always show waiver step
    }
  ];

  useEffect(() => {
    if (skillCategory && user) {
      fetchComplianceData();
    }
  }, [skillCategory, user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (complianceData) {
      // Find the first incomplete step
      const firstIncomplete = steps.findIndex(step => !step.checkCompliance(complianceData));
      setCurrentStep(firstIncomplete === -1 ? steps.length - 1 : firstIncomplete);
    }
  }, [complianceData, steps]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/compliance/status/${skillCategory}`, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComplianceData(data.data);
      } else {
        throw new Error('Failed to load compliance data');
      }
    } catch (err) {
      console.error('Compliance data error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStepAction = async (stepId) => {
    switch (stepId) {
      case 'profile':
        window.location.href = '/profile/edit';
        break;
      case 'documents':
        window.location.href = '/documents/upload';
        break;
      case 'badges':
        window.location.href = '/badges/request';
        break;
      case 'insurance':
        window.location.href = '/insurance/submit';
        break;
      case 'waiver':
        setShowWaiverModal(true);
        break;
      default:
        break;
    }
  };

  const handleWaiverAccepted = async (waiverData) => {
    try {
      setSubmitting(true);
      await fetchComplianceData(); // Refresh compliance data
      setShowWaiverModal(false);
      
      if (onComplete) {
        onComplete(waiverData);
      }
    } catch (error) {
      console.error('Post-waiver refresh failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateProgress = () => {
    if (!complianceData) return 0;
    const completedSteps = steps.filter(step => step.checkCompliance(complianceData)).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const renderRequirementsList = (stepId) => {
    if (!complianceData) return null;

    const statusMap = {
      profile: complianceData.complianceStatus.profile,
      documents: complianceData.complianceStatus.documents,
      badges: complianceData.complianceStatus.badges,
      insurance: complianceData.complianceStatus.insurance
    };

    const status = statusMap[stepId];
    if (!status) return null;

    const missingItems = status.missingFields || status.missingDocuments || 
                        status.missingBadges || status.missingInsurance || [];
    const completedItems = status.completedFields || status.approvedDocuments || 
                          status.earnedBadges || status.approvedInsurance || [];

    return (
      <RequirementsList>
        {completedItems.map((item, index) => (
          <RequirementItem key={`completed-${index}`} completed>
            <span className="icon">✅</span>
            <span className="text">{formatRequirementName(item)}</span>
          </RequirementItem>
        ))}
        {missingItems.map((item, index) => (
          <RequirementItem key={`missing-${index}`}>
            <span className="icon">⭕</span>
            <span className="text">{formatRequirementName(item)}</span>
            <span className="action" onClick={() => handleStepAction(stepId)}>
              Complete
            </span>
          </RequirementItem>
        ))}
      </RequirementsList>
    );
  };

  const formatRequirementName = (requirement) => {
    const formatMap = {
      displayName: 'Display Name',
      bio: 'Biography',
      location: 'Location',
      photo: 'Profile Photo',
      liability_insurance: 'Liability Insurance',
      background_check: 'Background Check',
      'safety-certified': 'Safety Certification Badge',
      'insured-provider': 'Insured Provider Badge',
      general_liability: 'General Liability Insurance'
    };

    return formatMap[requirement] || requirement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading compliance setup...
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <AlertBox type="error">
          Error loading compliance data: {error}
        </AlertBox>
      </Container>
    );
  }

  const overallCompliant = complianceData?.complianceStatus?.overall?.compliant;
  const progress = calculateProgress();

  return (
    <Container>
      <Header>
        <Title>Compliance Setup</Title>
        <Subtitle>
          Complete these requirements to participate in {skillCategory} activities safely and legally.
        </Subtitle>
      </Header>

      {overallCompliant ? (
        <AlertBox type="success">
          🎉 Congratulations! Your profile meets all compliance requirements for {skillCategory} activities.
        </AlertBox>
      ) : (
        <AlertBox type="info">
          📋 Please complete the following steps to meet compliance requirements.
        </AlertBox>
      )}

      <ProgressBar>
        <ProgressFill percentage={progress} />
      </ProgressBar>

      <ComplianceFlow>
        {steps.map((step, index) => {
          const isCompleted = step.checkCompliance(complianceData);
          const isActive = index === currentStep;

          return (
            <StepCard key={step.id} completed={isCompleted} active={isActive}>
              <StepHeader>
                <StepNumber completed={isCompleted} active={isActive}>
                  {isCompleted ? '✓' : index + 1}
                </StepNumber>
                <StepInfo>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </StepInfo>
                <StepStatus>
                  <span className={
                    isCompleted ? 'status-completed' : 
                    isActive ? 'status-active' : 
                    'status-pending'
                  }>
                    {isCompleted ? '✅ Complete' : 
                     isActive ? '⏳ In Progress' : 
                     '⭕ Pending'}
                  </span>
                </StepStatus>
              </StepHeader>

              {(isActive || isCompleted) && (
                <StepContent>
                  {step.id !== 'waiver' && renderRequirementsList(step.id)}
                  
                  {step.id === 'badges' && (
                    <BadgeDisplay 
                      skillCategory={skillCategory}
                      userId={user?.uid}
                      showRequestOptions={true}
                      onBadgeRequest={(badgeType) => {
                        // Handle badge request
                        console.log('Badge request:', badgeType);
                      }}
                    />
                  )}

                  {isActive && !isCompleted && (
                    <div>
                      <ActionButton 
                        onClick={() => handleStepAction(step.id)}
                        disabled={submitting}
                      >
                        {step.id === 'waiver' ? 'Review & Accept Waiver' : 
                         `Complete ${step.title}`}
                      </ActionButton>
                    </div>
                  )}
                </StepContent>
              )}
            </StepCard>
          );
        })}
      </ComplianceFlow>

      {showWaiverModal && (
        <LiabilityWaiverModal
          isOpen={showWaiverModal}
          onClose={() => setShowWaiverModal(false)}
          skillExchange={{
            skillCategory,
            skillName: skillCategory,
            description: `${skillCategory} activity`
          }}
          onWaiverAccepted={handleWaiverAccepted}
        />
      )}
    </Container>
  );
}

export default ComplianceSetup;