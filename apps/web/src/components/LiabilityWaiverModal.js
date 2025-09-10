
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LiabilityWaiver from './LiabilityWaiver';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
  box-shadow: var(--shadow-lg);
`;

const ModalHeader = styled.div`
  background: var(--primary);
  color: white;
  padding: 1.5rem;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: var(--text-xl);
  }

  button {
    background: none;
    border: none;
    color: white;
    font-size: var(--text-2xl);
    cursor: pointer;
    padding: 0;
    margin-left: auto;
  }
`;

const ModalBody = styled.div`
  padding: 0;
`;

const PreWaiverInfo = styled.div`
  padding: 1.5rem;
  background: var(--light-blue);
  border-bottom: 1px solid var(--gray-200);

  h3 {
    color: var(--primary-dark);
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--gray-700);
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  .skill-info {
    background: white;
    padding: 1rem;
    border-radius: var(--radius-md);
    margin: 1rem 0;
    border-left: 4px solid var(--primary);

    .skill-name {
      font-weight: var(--font-semibold);
      color: var(--primary-dark);
    }

    .risk-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      margin-left: 0.5rem;
    }

    .risk-high {
      background: var(--danger-red);
      color: white;
    }

    .risk-medium {
      background: var(--warning-yellow);
      color: var(--gray-900);
    }

    .risk-low {
      background: var(--success-green);
      color: white;
    }
  }
`;

function LiabilityWaiverModal({ 
  isOpen, 
  onClose, 
  skillExchange, 
  onWaiverAccepted 
}) {
  const [waiverData, setWaiverData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && skillExchange) {
      // Determine risk level based on skill category
      const riskLevel = getRiskLevel(skillExchange.skillCategory);
      setWaiverData({
        skillCategory: skillExchange.skillCategory,
        riskLevel,
        activityDescription: skillExchange.description || skillExchange.skillName
      });
    }
  }, [isOpen, skillExchange]);

  const getRiskLevel = (category) => {
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    const highRisk = ['physical-training', 'construction', 'automotive', 'outdoor-activities', 'sports', 'fitness', 'martial-arts'];
    const mediumRisk = ['cooking', 'arts-crafts', 'home-repair', 'gardening', 'woodworking', 'electrical'];
    
    if (highRisk.some(risk => normalizedCategory.includes(risk))) return 'high';
    if (mediumRisk.some(risk => normalizedCategory.includes(risk))) return 'medium';
    return 'low';
  };

  const handleWaiverAccept = async (acceptanceData) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the API
      const response = await fetch('/api/liability/waiver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...acceptanceData,
          exchangeId: skillExchange.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        onWaiverAccepted(result.data);
        onClose();
      } else {
        throw new Error('Failed to submit waiver');
      }
    } catch (error) {
      console.error('Waiver submission error:', error);
      alert('Failed to submit liability waiver. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaiverDecline = () => {
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !waiverData) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <h2>Safety First: Liability Waiver Required</h2>
          <button onClick={onClose} aria-label="Close modal">×</button>
        </ModalHeader>
        
        <ModalBody>
          <PreWaiverInfo>
            <h3>Before We Begin</h3>
            <p>
              To ensure everyone&apos;s safety and set clear expectations, we require all participants 
              to acknowledge the risks involved in skill-sharing activities.
            </p>
            
            <div className="skill-info">
              <div className="skill-name">
                {skillExchange.skillName || skillExchange.title}
                <span className={`risk-badge risk-${waiverData.riskLevel}`}>
                  {waiverData.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                {waiverData.activityDescription}
              </p>
            </div>

            <p>
              <strong>Please read the waiver carefully and provide your consent to participate.</strong>
            </p>
          </PreWaiverInfo>

          <LiabilityWaiver
            skillCategory={waiverData.skillCategory}
            riskLevel={waiverData.riskLevel}
            activityDescription={waiverData.activityDescription}
            onAccept={handleWaiverAccept}
            onDecline={handleWaiverDecline}
            isVisible={true}
            isSubmitting={isSubmitting}
          />
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default LiabilityWaiverModal;