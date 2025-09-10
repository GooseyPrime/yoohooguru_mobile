import React, { useState } from 'react';
import styled from 'styled-components';

const WaiverContainer = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--danger-red);
  margin: 1rem 0;
`;

const WaiverTitle = styled.h2`
  color: var(--danger-red);
  font-size: var(--text-2xl);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '!';
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff6b35;
  }
`;

const WaiverContent = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--gray-300);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: var(--radius-md);
  background: var(--light-gray);

  h3 {
    color: var(--danger-red);
    margin: 1rem 0 0.5rem 0;
    font-size: var(--text-lg);
  }

  p, li {
    color: var(--gray-700);
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  ul {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: var(--light-gray);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--danger-red);
`;

const CheckboxInput = styled.input`
  margin-top: 0.25rem;
  transform: scale(1.2);
  accent-color: var(--danger-red);
`;

const CheckboxLabel = styled.label`
  color: var(--gray-800);
  font-weight: var(--font-medium);
  line-height: 1.5;
  cursor: pointer;
`;

const RiskLevel = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: 1rem;

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

const EmergencyContact = styled.div`
  background: var(--warning-light);
  border: 1px solid var(--warning-yellow);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin: 1rem 0;

  h4 {
    color: var(--warning-dark);
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-sm);
    margin-bottom: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
    color: var(--danger-red);
    font-weight: var(--font-medium);
    text-align: center;
    margin-top: 1rem;
`;

function LiabilityWaiver({ 
  skillCategory = 'general', 
  onAccept, 
  onDecline, 
  isVisible = false,
  activityDescription = ''
}) {
  const [hasRead, setHasRead] = useState(false);
  const [acknowledgesRisk, setAcknowledgesRisk] = useState(false);
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  const getRiskLevel = (category) => {
    const highRisk = ['physical-training', 'construction', 'automotive', 'outdoor-activities', 'sports'];
    const mediumRisk = ['cooking', 'arts-crafts', 'home-repair', 'gardening'];
    
    if (highRisk.includes(category)) return 'high';
    if (mediumRisk.includes(category)) return 'medium';
    return 'low';
  };

  const riskLevel = getRiskLevel(skillCategory);

  const canAccept = hasRead && acknowledgesRisk && agreesToTerms && 
    (riskLevel === 'high' ? emergencyContact.name && emergencyContact.phone : true);

  const handleAccept = async () => {
    if (!canAccept || isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    try {
      await onAccept({
        riskLevel,
        emergencyContact: riskLevel === 'high' ? emergencyContact : null,
        timestamp: new Date().toISOString(),
        skillCategory,
        activityDescription
      });
    } catch (err) {
      console.error("Waiver acceptance failed:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <WaiverContainer>
      <WaiverTitle>
        Liability Waiver and Risk Acknowledgment
      </WaiverTitle>

      <RiskLevel level={riskLevel}>
        Risk Level: {riskLevel.toUpperCase()}
      </RiskLevel>

      {activityDescription && (
        <p><strong>Activity:</strong> {activityDescription}</p>
      )}

      <WaiverContent>
        <h3>1. Acknowledgment of Risk</h3>
        <p>
          I understand that participating in skill-sharing activities involves inherent risks including 
          but not limited to physical injury, property damage, and financial loss. These risks cannot 
          be eliminated regardless of the care taken to avoid injuries.
        </p>

        <h3>2. Voluntary Participation</h3>
        <p>
          I voluntarily choose to participate in this skill exchange activity. I understand that I am 
          not required to participate and that I may choose to discontinue participation at any time.
        </p>

        <h3>3. Assumption of Risk</h3>
        <p>I expressly assume all risks associated with this activity, including but not limited to:</p>
        <ul>
          <li>Personal injury or death</li>
          <li>Property damage or loss</li>
          <li>Equipment failure or malfunction</li>
          <li>Actions or negligence of other participants</li>
          <li>Environmental hazards or conditions</li>
        </ul>

        <h3>4. Release and Waiver</h3>
        <p>
          I hereby release, waive, discharge, and covenant not to sue {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}, its officers, 
          directors, employees, agents, and other participants from any and all liability, claims, 
          demands, actions, and causes of action arising out of or related to any loss, damage, or 
          injury that may be sustained by me during this activity.
        </p>

        <h3>5. Medical Condition Disclosure</h3>
        <p>
          I certify that I am physically fit and have no medical conditions that would prevent safe 
          participation in this activity. I agree to inform the skill provider of any relevant medical 
          conditions or limitations.
        </p>

        <h3>6. Insurance and Medical Expenses</h3>
        <p>
          I understand that {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} does not provide insurance coverage for participants. 
          I am responsible for my own medical expenses and maintaining adequate insurance coverage.
        </p>
      </WaiverContent>

      {riskLevel === 'high' && (
        <EmergencyContact>
          <h4>Emergency Contact Information (Required for High-Risk Activities)</h4>
          <input
            type="text"
            placeholder="Emergency contact name"
            value={emergencyContact.name}
            onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="tel"
            placeholder="Emergency contact phone"
            value={emergencyContact.phone}
            onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Relationship (spouse, parent, friend, etc.)"
            value={emergencyContact.relationship}
            onChange={(e) => setEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
          />
        </EmergencyContact>
      )}

      <CheckboxContainer>
        <CheckboxInput
          type="checkbox"
          id="hasRead"
          checked={hasRead}
          onChange={(e) => setHasRead(e.target.checked)}
        />
        <CheckboxLabel htmlFor="hasRead">
          I have read and understand the above waiver and risk acknowledgment in its entirety.
        </CheckboxLabel>
      </CheckboxContainer>

      <CheckboxContainer>
        <CheckboxInput
          type="checkbox"
          id="acknowledgesRisk"
          checked={acknowledgesRisk}
          onChange={(e) => setAcknowledgesRisk(e.target.checked)}
        />
        <CheckboxLabel htmlFor="acknowledgesRisk">
          I acknowledge the risks involved and voluntarily assume all responsibility for any injury, 
          damage, or loss that may occur during this activity.
        </CheckboxLabel>
      </CheckboxContainer>

      <CheckboxContainer>
        <CheckboxInput
          type="checkbox"
          id="agreesToTerms"
          checked={agreesToTerms}
          onChange={(e) => setAgreesToTerms(e.target.checked)}
        />
        <CheckboxLabel htmlFor="agreesToTerms">
          I agree to release and hold harmless {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} and all participants from any 
          liability arising from my participation in this skill exchange activity.
        </CheckboxLabel>
      </CheckboxContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          onClick={onDecline}
          style={{
            padding: '0.75rem 1.5rem',
            border: '2px solid var(--gray-400)',
            background: 'white',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 'var(--font-medium)'
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          disabled={!canAccept || isSubmitting}
          style={{
            padding: '0.75rem 1.5rem',
            border: '2px solid var(--danger-red)',
            background: canAccept ? 'var(--danger-red)' : 'var(--gray-300)',
            color: canAccept ? 'white' : 'var(--gray-500)',
            borderRadius: 'var(--radius-md)',
            cursor: canAccept && !isSubmitting ? 'pointer' : 'not-allowed',
            fontWeight: 'var(--font-medium)'
          }}
        >
          {isSubmitting ? 'Accepting...' : 'Accept Waiver and Proceed'}
        </button>
      </div>
    </WaiverContainer>
  );
}

export default LiabilityWaiver;
