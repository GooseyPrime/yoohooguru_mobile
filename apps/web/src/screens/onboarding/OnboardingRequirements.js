import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function OnboardingRequirements() {
  const [needed, setNeeded] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=> {
    api('/onboarding/requirements')
      .then(({data}) => setNeeded(data.needed || []))
      .catch((err) => {
        console.error('Failed to load onboarding requirements:', err);
        setError('Failed to load requirements. Please try again later.');
      });
  }, []);

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Requirements</h2>
      <p>Some categories need proof of license or insurance. Upload documents in the next step.</p>
      {error && (
        <div style={{color: 'red', marginBottom: '1rem'}}>
          {error}
        </div>
      )}
      <ul>
        {needed.map(n => (
          <li key={n.slug} style={{marginBottom: '10px'}}>
            <strong>{n.slug}</strong> — {[
              n.requirements?.requires_license && 'License',
              n.requirements?.requires_gl && 'General Liability ($1M/$2M)',
              n.requirements?.requires_auto_insurance && 'Auto Insurance'
            ].filter(Boolean).join(', ') || 'No special documents required'}
            {n.requirements?.notes && (
              <div style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '4px'}}>
                Note: {n.requirements.notes}
              </div>
            )}
          </li>
        ))}
      </ul>
      <a href="/onboarding/documents" style={{color: 'var(--primary)', textDecoration: 'none'}}>
        Upload documents →
      </a>
    </div>
  );
}