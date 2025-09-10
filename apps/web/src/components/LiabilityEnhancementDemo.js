import React, { useState } from 'react';
import styled from 'styled-components';
import LiabilityWaiverModal from './LiabilityWaiverModal';

const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
`;

const DemoTitle = styled.h1`
  text-align: center;
  color: var(--primary);
  margin-bottom: 2rem;
`;

const SkillCard = styled.div`
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-sm);
  }

  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    h3 {
      color: var(--gray-900);
      margin: 0;
    }

    .risk-badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);

      &.risk-high {
        background: var(--danger-red);
        color: white;
      }

      &.risk-medium {
        background: var(--warning-yellow);
        color: var(--gray-900);
      }

      &.risk-low {
        background: var(--success-green);
        color: white;
      }
    }
  }

  .skill-description {
    color: var(--gray-700);
    margin-bottom: 1rem;
  }

  .skill-provider {
    color: var(--gray-600);
    font-size: var(--text-sm);
    margin-bottom: 1rem;
  }

  .action-button {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: var(--primary-dark);
    }

    &:disabled {
      background: var(--gray-400);
      cursor: not-allowed;
    }
  }
`;

const StatusMessage = styled.div`
  padding: 1rem;
  border-radius: var(--radius-md);
  margin: 1rem 0;
  font-weight: var(--font-medium);

  &.success {
    background: var(--success-light);
    color: var(--success-dark);
    border: 1px solid var(--success-green);
  }

  &.info {
    background: var(--info-light);
    color: var(--info-dark);
    border: 1px solid var(--info-blue);
  }
`;

const InfoPanel = styled.div`
  background: var(--light-gray);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;

  h2 {
    color: var(--primary);
    margin-bottom: 1rem;
  }

  ul {
    color: var(--gray-700);
    line-height: 1.6;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

function LiabilityEnhancementDemo() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showWaiver, setShowWaiver] = useState(false);
  const [waiverStatus, setWaiverStatus] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  const demoSkills = [
    {
      id: 1,
      skillName: 'Basic Cooking Techniques',
      skillCategory: 'cooking',
      description: 'Learn knife skills, sautéing, and kitchen safety fundamentals',
      provider: 'Chef Maria Rodriguez',
      riskLevel: 'medium'
    },
    {
      id: 2,
      skillName: 'Personal Fitness Training',
      skillCategory: 'physical-training',
      description: 'One-on-one fitness training with equipment and weights',
      provider: 'Trainer John Smith',
      riskLevel: 'high'
    },
    {
      id: 3,
      skillName: 'Web Development Basics',
      skillCategory: 'programming',
      description: 'Introduction to HTML, CSS, and JavaScript',
      provider: 'Developer Sarah Johnson',
      riskLevel: 'low'
    },
    {
      id: 4,
      skillName: 'Home Electrical Repair',
      skillCategory: 'home-repair',
      description: 'Basic electrical troubleshooting and outlet installation',
      provider: 'Electrician Mike Wilson',
      riskLevel: 'medium'
    },
    {
      id: 5,
      skillName: 'Rock Climbing Fundamentals',
      skillCategory: 'outdoor-activities',
      description: 'Learn basic rock climbing techniques and safety protocols',
      provider: 'Guide Lisa Thompson',
      riskLevel: 'high'
    }
  ];

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setShowWaiver(true);
    setStatusMessage('');
  };

  const handleWaiverAccepted = (waiverData) => {
    setWaiverStatus({
      ...waiverStatus,
      [selectedSkill.id]: {
        accepted: true,
        timestamp: waiverData.acceptedAt,
        waiverId: waiverData.waiverId
      }
    });
    setStatusMessage(`Liability waiver accepted! You can now participate in "${selectedSkill.skillName}". Exchange can proceed safely.`);
    setSelectedSkill(null);
  };

  const handleWaiverClosed = () => {
    setShowWaiver(false);
    setSelectedSkill(null);
    if (!waiverStatus[selectedSkill?.id]?.accepted) {
      setStatusMessage('Liability waiver is required to participate in skill exchanges. Please accept the waiver to continue.');
    }
  };

  return (
    <DemoContainer>
      <DemoTitle>🎯 {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} - Enhanced Liability Protection Demo</DemoTitle>
      
      <InfoPanel>
        <h2>🛡️ Enhanced Liability Protection Features</h2>
        <ul>
          <li><strong>Risk-Based Waivers:</strong> Different liability requirements based on activity risk levels</li>
          <li><strong>Comprehensive Coverage:</strong> Enhanced Terms and Conditions with assumption of risk, indemnification, and property damage disclaimers</li>
          <li><strong>Emergency Contacts:</strong> Required for high-risk activities like fitness training and outdoor activities</li>
          <li><strong>Activity-Specific Protection:</strong> Tailored liability language for different skill categories</li>
          <li><strong>Audit Trail:</strong> Complete tracking of waiver acceptance for legal compliance</li>
          <li><strong>Auto-Expiration:</strong> Waivers expire after 30 days (high-risk) or 90 days (medium/low-risk)</li>
        </ul>
      </InfoPanel>

      {statusMessage && (
        <StatusMessage className={statusMessage.includes('accepted!') ? 'success' : 'info'}>
          {statusMessage}
        </StatusMessage>
      )}

      <h2>Available Skill Exchanges</h2>
      <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
        Click &quot;Join Exchange&quot; to see the liability waiver process in action. Notice how different risk levels require different protections.
      </p>

      {demoSkills.map(skill => (
        <SkillCard key={skill.id}>
          <div className="skill-header">
            <h3>{skill.skillName}</h3>
            <span className={`risk-badge risk-${skill.riskLevel}`}>
              {skill.riskLevel.toUpperCase()} RISK
            </span>
          </div>
          <div className="skill-description">{skill.description}</div>
          <div className="skill-provider">Offered by: {skill.provider}</div>
          
          {waiverStatus[skill.id]?.accepted ? (
            <div style={{ 
              color: 'var(--success-green)', 
              fontWeight: 'var(--font-medium)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Liability waiver accepted
              <span style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--gray-600)' 
              }}>
                (ID: {waiverStatus[skill.id].waiverId})
              </span>
            </div>
          ) : (
            <button 
              className="action-button"
              onClick={() => handleSkillSelect(skill)}
            >
              Join Exchange (Waiver Required)
            </button>
          )}
        </SkillCard>
      ))}

      <LiabilityWaiverModal
        isOpen={showWaiver}
        onClose={handleWaiverClosed}
        skillExchange={selectedSkill}
        onWaiverAccepted={handleWaiverAccepted}
      />
    </DemoContainer>
  );
}

export default LiabilityEnhancementDemo;