import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import Button from '../../components/Button';

export default function OnboardingReview() {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(()=> {
    api('/onboarding/status')
      .then(r => setData(r.data))
      .catch((err) => {
        console.error('Failed to load onboarding status:', err);
        setError('Failed to load onboarding status. Please try again later.');
      });
  }, []);

  if (error) return <div style={{padding: '2rem', color: '#dc2626'}}>{error}</div>;
  if (!data) return <div style={{padding: '2rem'}}>Loading…</div>;

  const publish = async () => {
    try {
      // In production, this would update the profile to published/active status
      alert('Submitted. A badge appears after any required docs are approved.');
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Error publishing profile: ' + error.message);
    }
  };

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '2rem'}}>
      <h2>Review & Publish</h2>
      
      <div style={{marginBottom: '2rem'}}>
        <h3>Profile Summary</h3>
        <div style={{background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
          <p><strong>Name:</strong> {data.profile?.displayName || 'Not set'}</p>
          <p><strong>Location:</strong> {data.profile?.city || 'Not set'}, {data.profile?.zip || 'Not set'}</p>
          <p><strong>Bio:</strong> {data.profile?.bio || 'Not set'}</p>
        </div>
        
        <h3>Selected Categories</h3>
        <div style={{background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
          {Object.keys(data.picks || {}).length > 0 ? (
            <ul>
              {Object.keys(data.picks || {}).map(slug => (
                <li key={slug}>{slug}</li>
              ))}
            </ul>
          ) : (
            <p>No categories selected</p>
          )}
        </div>
        
        <h3>Documents Uploaded</h3>
        <div style={{background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
          {Object.keys(data.docs || {}).length > 0 ? (
            <ul>
              {Object.values(data.docs || {}).map(doc => (
                <li key={doc.id}>
                  {doc.type} - {doc.status}
                  {doc.category && ` (${doc.category})`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded</p>
          )}
        </div>
        
        <h3>Status Check</h3>
        <div style={{background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '2rem'}}>
          <p>✓ Profile: {data.step.profileComplete ? 'Complete' : 'Incomplete'}</p>
          <p>✓ Categories: {data.step.categoriesComplete ? 'Complete' : 'Incomplete'}</p>
          <p>✓ Requirements: {data.step.requirementsComplete ? 'Complete' : 'Incomplete'}</p>
          <p>✓ Payout: {data.step.payoutConnected ? 'Complete' : 'Incomplete'}</p>
        </div>
      </div>
      
      <Button 
        onClick={publish} 
        disabled={!data.step.reviewReady}
        variant="primary"
        size="lg"
      >
        Publish Profile
      </Button>
      {!data.step.reviewReady && (
        <p style={{color: '#dc2626', marginTop: '1rem'}}>
          Complete all steps first.
        </p>
      )}
    </div>
  );
}