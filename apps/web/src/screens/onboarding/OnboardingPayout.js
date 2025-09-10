
import React, { useEffect, useState } from 'react';

export default function OnboardingPayout() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/connect/status', { credentials: 'include' });
      const json = await res.json();
      setStatus(json);
    } catch {
      setStatus(null);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const start = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/connect/start', { method: 'POST', headers: { 'Content-Type':'application/json' }, credentials: 'include' });
      const json = await res.json();
      if (json?.url) window.location.href = json.url;
    } finally {
      setLoading(false);
    }
  };

  const ready = status?.connected && status?.charges_enabled && status?.payouts_enabled && status?.details_submitted;

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Setup Payout Method</h2>
      <p>Connect your bank account to receive payments for your services.</p>
      
      <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '2rem'}}>
        {ready ? (
          <div>
            <h3 style={{color: '#059669'}}>✅ Payouts Connected</h3>
            <p>Your payout method is ready to receive payments.</p>
            <button 
              onClick={fetchStatus}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Refresh Status
            </button>
          </div>
        ) : (
          <div>
            <h3>Connect Your Payout Method</h3>
            {status?.connected ? (
              <div>
                <p>Your Stripe account needs additional setup.</p>
                <p style={{fontSize: '0.875rem', color: '#6b7280'}}>
                  Charges: {status?.charges_enabled ? '✅' : '❌'} | 
                  Payouts: {status?.payouts_enabled ? '✅' : '❌'} | 
                  Details: {status?.details_submitted ? '✅' : '❌'}
                </p>
                {status?.currently_due?.length > 0 && (
                  <p style={{fontSize: '0.875rem', color: '#dc2626'}}>
                    Missing: {status.currently_due.join(', ')}
                  </p>
                )}
              </div>
            ) : (
              <p>Connect your bank account through Stripe to receive payments.</p>
            )}
            <button 
              onClick={start}
              disabled={loading}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginTop: '1rem'
              }}
            >
              {loading ? 'Connecting...' : 'Connect Payouts'}
            </button>
          </div>
        )}
      </div>

      <div style={{textAlign: 'center'}}>
        <button 
          onClick={() => window.location.href = '/onboarding/review'}
          disabled={!ready}
          style={{
            backgroundColor: ready ? '#059669' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: ready ? 'pointer' : 'not-allowed'
          }}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
