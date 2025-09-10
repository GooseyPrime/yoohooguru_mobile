import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import BadgeDisplay from './BadgeDisplay';

const Container = styled.div`
  max-width: 1200px;
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

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: linear-gradient(135deg, ${props => props.bgColor || 'var(--primary)'} 0%, ${props => props.bgColor || 'var(--primary)'}80 100%);
  color: white;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-sm);
`;

const MetricValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: var(--text-sm);
  opacity: 0.9;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CategoryCard = styled.div`
  background: white;
  border: 2px solid ${props => 
    props.compliant ? 'var(--success-green)' : 
    props.riskLevel === 'high' ? 'var(--danger-red)' : 
    'var(--warning-yellow)'
  };
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  position: relative;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-bottom: 0.25rem;
`;

const RiskBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  
  ${props => props.level === 'high' && `
    background: var(--danger-red);
    color: white;
  `}
  
  ${props => props.level === 'medium' && `
    background: var(--warning-yellow);
    color: var(--gray-900);
  `}
  
  ${props => props.level === 'low' && `
    background: var(--success-green);
    color: white;
  `}
`;

const ComplianceScore = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const ScoreCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => 
    props.score >= 80 ? 'var(--success-green)' :
    props.score >= 60 ? 'var(--warning-yellow)' :
    'var(--danger-red)'
  };
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  margin-left: auto;
`;

const RequirementsList = styled.div`
  margin-top: 1rem;
`;

const RequirementGroup = styled.div`
  margin-bottom: 1rem;
`;

const RequirementGroupTitle = styled.h4`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--gray-700);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: var(--text-sm);
  
  .status-icon {
    font-size: var(--text-lg);
  }
  
  .item-text {
    color: var(--gray-700);
  }
  
  .missing {
    color: var(--danger-red);
  }
  
  .completed {
    color: var(--success-green);
  }
`;

const ActionButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }

  &:disabled {
    background: var(--gray-400);
    cursor: not-allowed;
  }

  ${props => props.variant === 'success' && `
    background: var(--success-green);
    &:hover {
      background: var(--success-dark);
    }
  `}
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  font-size: var(--text-lg);
  color: var(--gray-600);
`;

const ErrorMessage = styled.div`
  background: var(--danger-light);
  border: 1px solid var(--danger-red);
  color: var(--danger-red);
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  text-align: center;
`;

function ComplianceDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/compliance/dashboard', {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      } else {
        throw new Error('Failed to load compliance dashboard');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRequirementItem = (requirement, status) => {
    const isCompleted = status.compliant || 
      (status.completedFields && status.completedFields.includes(requirement)) ||
      (status.approvedDocuments && status.approvedDocuments.includes(requirement)) ||
      (status.earnedBadges && status.earnedBadges.includes(requirement)) ||
      (status.completedVerifications && status.completedVerifications.includes(requirement)) ||
      (status.approvedInsurance && status.approvedInsurance.includes(requirement));

    return (
      <RequirementItem key={requirement}>
        <span className="status-icon">
          {isCompleted ? '✅' : '⭕'}
        </span>
        <span className={`item-text ${isCompleted ? 'completed' : 'missing'}`}>
          {formatRequirementName(requirement)}
        </span>
      </RequirementItem>
    );
  };

  const formatRequirementName = (requirement) => {
    const formatMap = {
      displayName: 'Display Name',
      bio: 'Biography',
      location: 'Location',
      photo: 'Profile Photo',
      references: 'References',
      credentials: 'Credentials',
      education: 'Education History',
      liability_insurance: 'Liability Insurance',
      first_aid_cert: 'First Aid Certification',
      background_check: 'Background Check',
      child_protection_training: 'Child Protection Training',
      professional_license: 'Professional License',
      malpractice_insurance: 'Malpractice Insurance',
      contractors_license: 'Contractor License',
      workers_comp: 'Workers Compensation',
      auto_insurance: 'Auto Insurance',
      mechanic_certification: 'Mechanic Certification',
      food_handlers_permit: 'Food Handler Permit',
      kitchen_insurance: 'Kitchen Insurance',
      'safety-certified': 'Safety Certified Badge',
      'licensed-professional': 'Licensed Professional Badge',
      'insured-provider': 'Insured Provider Badge',
      'background-verified': 'Background Verified Badge',
      criminal_background_check: 'Criminal Background Check',
      child_abuse_clearance: 'Child Abuse Clearance',
      license_verification: 'License Verification',
      education_verification: 'Education Verification',
      certification_verification: 'Certification Verification',
      food_safety_certification: 'Food Safety Certification'
    };

    return formatMap[requirement] || requirement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleCategoryAction = (category) => {
    // Navigate to category-specific compliance setup
    window.location.href = `/compliance/setup/${category}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          Loading compliance dashboard...
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          {error}
        </ErrorMessage>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container>
        <Header>
          <Title>Compliance Dashboard</Title>
          <Subtitle>No compliance data available</Subtitle>
        </Header>
      </Container>
    );
  }

  const { overview, categories } = dashboardData;

  return (
    <Container>
      <Header>
        <Title>Compliance Dashboard</Title>
        <Subtitle>
          Monitor your compliance status across all skill categories to ensure safe and legal skill sharing.
        </Subtitle>
      </Header>

      <OverviewGrid>
        <MetricCard bgColor="var(--primary)">
          <MetricValue>{overview.complianceRate}%</MetricValue>
          <MetricLabel>Overall Compliance</MetricLabel>
        </MetricCard>
        
        <MetricCard bgColor="var(--success-green)">
          <MetricValue>{overview.compliantCategories}/{overview.totalCategories}</MetricValue>
          <MetricLabel>Compliant Categories</MetricLabel>
        </MetricCard>
        
        <MetricCard bgColor="var(--warning-yellow)">
          <MetricValue>{overview.averageScore}%</MetricValue>
          <MetricLabel>Average Score</MetricLabel>
        </MetricCard>
        
        <MetricCard bgColor="var(--danger-red)">
          <MetricValue>{overview.highRiskCompliant}/{overview.highRiskCategories}</MetricValue>
          <MetricLabel>High-Risk Compliant</MetricLabel>
        </MetricCard>
      </OverviewGrid>

      <CategoryGrid>
        {categories.map((category) => (
          <CategoryCard
            key={category.category}
            compliant={category.compliant}
            riskLevel={category.riskLevel}
          >
            <CategoryHeader>
              <CategoryInfo>
                <CategoryName>{category.name}</CategoryName>
                <RiskBadge level={category.riskLevel}>
                  {category.riskLevel} risk
                </RiskBadge>
              </CategoryInfo>
              <ComplianceScore>
                <ScoreCircle score={category.score}>
                  {category.score}%
                </ScoreCircle>
              </ComplianceScore>
            </CategoryHeader>

            <RequirementsList>
              {category.status?.profile && (
                <RequirementGroup>
                  <RequirementGroupTitle>Profile Requirements</RequirementGroupTitle>
                  {category.status.profile.missingFields?.map(field => 
                    renderRequirementItem(field, category.status.profile)
                  )}
                  {category.status.profile.completedFields?.map(field => 
                    renderRequirementItem(field, category.status.profile)
                  )}
                </RequirementGroup>
              )}

              {category.status?.documents && (
                <RequirementGroup>
                  <RequirementGroupTitle>Documents</RequirementGroupTitle>
                  {category.status.documents.missingDocuments?.map(doc => 
                    renderRequirementItem(doc, category.status.documents)
                  )}
                  {category.status.documents.approvedDocuments?.map(doc => 
                    renderRequirementItem(doc, category.status.documents)
                  )}
                </RequirementGroup>
              )}

              {category.status?.badges && (
                <RequirementGroup>
                  <RequirementGroupTitle>Badges</RequirementGroupTitle>
                  {category.status.badges.missingBadges?.map(badge => 
                    renderRequirementItem(badge, category.status.badges)
                  )}
                  {category.status.badges.earnedBadges?.map(badge => 
                    renderRequirementItem(badge, category.status.badges)
                  )}
                </RequirementGroup>
              )}

              {category.status?.verification && (
                <RequirementGroup>
                  <RequirementGroupTitle>Verifications</RequirementGroupTitle>
                  {category.status.verification.missingVerifications?.map(verification => 
                    renderRequirementItem(verification, category.status.verification)
                  )}
                  {category.status.verification.completedVerifications?.map(verification => 
                    renderRequirementItem(verification, category.status.verification)
                  )}
                </RequirementGroup>
              )}

              {category.status?.insurance && (category.status.insurance.missingInsurance?.length > 0 || category.status.insurance.approvedInsurance?.length > 0) && (
                <RequirementGroup>
                  <RequirementGroupTitle>Insurance</RequirementGroupTitle>
                  {category.status.insurance.missingInsurance?.map(insurance => 
                    renderRequirementItem(insurance, category.status.insurance)
                  )}
                  {category.status.insurance.approvedInsurance?.map(insurance => 
                    renderRequirementItem(insurance, category.status.insurance)
                  )}
                </RequirementGroup>
              )}
            </RequirementsList>

            <ActionButton
              variant={category.compliant ? 'success' : 'primary'}
              onClick={() => handleCategoryAction(category.category)}
              disabled={category.error}
            >
              {category.compliant ? 
                '✅ Fully Compliant' : 
                category.error ? 
                  'Error Loading' : 
                  '📋 Complete Requirements'
              }
            </ActionButton>
          </CategoryCard>
        ))}
      </CategoryGrid>

      {/* Add badge display for overall user badges */}
      <BadgeDisplay 
        userId={user?.uid} 
        showRequestOptions={false}
      />
    </Container>
  );
}

export default ComplianceDashboard;