
import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import ComingSoon from '../../components/ComingSoon';

export default function OnboardingStart() {
  const [status, setStatus] = useState();

  useEffect(() => {
    api('/onboarding/status').then(r => setStatus(r.data.step)).catch(()=>{});
  }, []);

  const row = (label, ok, href) => (
    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.5rem' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: ok ? '#10b981' : '#6b7280', fontSize: '1.25rem' }}>{ok ? '✓' : '○'}</span>
        {label}
      </span>
      <a href={href} style={{ textDecoration: 'none', color: 'var(--primary)' }}>
        {ok ? 'Review' : 'Complete'} →
      </a>
    </div>
  );

  if (!status) return <div style={{padding: '2rem'}}>Loading…</div>;

  return (
    <div style={{maxWidth: '680px', margin: '0 auto', padding: '2rem'}}>
      <h1>Become a Guru</h1>
      <p>Let&apos;s set up your YooHoo Guru profile and get you earning.</p>

      {row('Profile', status.profileComplete, '/onboarding/profile')}
      {row('Categories', status.categoriesComplete, '/onboarding/categories')}
      {row('Requirements', status.requirementsComplete, '/onboarding/requirements')}
      {row('Payout', status.payoutConnected, '/onboarding/payout')}
      <hr />
      {status.reviewReady ? <a href="/onboarding/review">Review & publish →</a> : <span>Complete previous steps</span>}
      <div style={{marginTop: '16px'}}>
        <small>Background checks <ComingSoon /></small>
      </div>
    </div>
  );
}
