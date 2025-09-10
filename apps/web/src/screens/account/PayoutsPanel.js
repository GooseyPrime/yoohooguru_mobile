import React, { useEffect, useState } from 'react';
import featureFlags from '../../lib/featureFlags';

export default function PayoutsPanel() {
  const [status, setStatus] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [flagsLoaded, setFlagsLoaded] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fmt = c => `$${(c/100).toFixed(2)}`;

  const fetchStatus = async () => {
    try {
      const s = await fetch('/api/connect/status', { credentials: 'include' }).then(r=>r.json());
      setStatus(s);
    } catch (error) {
      console.error("Failed to fetch Stripe status:", error);
      setMsg("⚠️ Could not load your Stripe connection status. Please check your network and try again.");
    }
  };
  const fetchBalance = async () => {
    try {
      const b = await fetch('/api/payouts/balance', { credentials: 'include' }).then(r=>r.json());
      setBalance(b);
    } catch (error) {
      console.error("Failed to fetch Stripe balance:", error);
      setMsg("⚠️ Could not load your Stripe balance. Please check your network and try again.");
    }
  };

  useEffect(()=> {
    const loadData = async () => {
      setInitialLoading(true);
      setMsg('');
      try {
        await featureFlags.loadFlags();
        setFlagsLoaded(true);
        await Promise.all([fetchStatus(), fetchBalance()]);
      } catch (error) {
        console.error("Failed to load payout data:", error);
        setMsg("⚠️ An unexpected error occurred while loading page data. Please refresh.");
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, []);

  const openExpress = async () => {
    try {
      const r = await fetch('/api/connect/express-login', { method:'POST', credentials:'include' }).then(r=>r.json());
      if (r?.url) {
        window.open(r.url, '_blank');
      } else {
        throw new Error('No URL returned from server.');
      }
    } catch(error) {
      console.error("Failed to open Stripe Express dashboard:", error);
      setMsg("⚠️ Could not open the Stripe dashboard. Please try again.");
    }
  };

  const instantPayout = async () => {
    setBusy(true); setMsg('');
    try {
      const body = {};
      if (amount) body.amountCents = Math.round(parseFloat(amount) * 100);
      const r = await fetch('/api/payouts/instant', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      }).then(r=>r.json());
      if (r.ok) {
        setMsg(`✅ Instant payout submitted (${fmt(r.data.amountCents)}). Status: ${r.data.status}`);
        fetchBalance();
      } else {
        setMsg(`⚠️ ${r.error || 'Payout failed'}`);
      }
    } catch(error) {
      console.error("Instant payout failed:", error);
      setMsg("⚠️ An unexpected error occurred during the payout process.");
    } finally {
      setBusy(false);
    }
  };

  const instantAvail = (balance?.balance?.instant_available || []).find(a => a.currency === 'usd')?.amount || 0;
  const isInstantPayoutsEnabled = flagsLoaded && featureFlags.isEnabled('instantPayouts');

  if (initialLoading && !msg) {
    return (
      <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem', textAlign: 'center'}}>
        <p>Loading Payouts Information...</p>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Payouts</h2>
      
      {/* Messages */}
      {msg && (
        <div style={{
          padding: '1rem',
          borderRadius: '6px',
          backgroundColor: msg.includes('✅') ? '#d1fae5' : '#fef2f2',
          border: '1px solid ' + (msg.includes('✅') ? '#10b981' : '#ef4444'),
          marginBottom: '1.5rem'
        }}>
          <p style={{margin: '0', fontSize: '0.875rem'}}>{msg}</p>
        </div>
      )}

      {/* Connection Status */}
      <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem'}}>
        {status?.connected ? (
          <div>
            <h3 style={{color: '#059669', margin: '0 0 0.5rem 0'}}>✅ Connected to Stripe</h3>
            <p style={{margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280'}}>
              Charges: {status?.charges_enabled ? '✅' : '❌'} | 
              Payouts: {status?.payouts_enabled ? '✅' : '❌'} | 
              Details: {status?.details_submitted ? '✅' : '❌'}
            </p>
            <button 
              onClick={openExpress}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Open Stripe Dashboard
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{color: '#dc2626', margin: '0 0 0.5rem 0'}}>❌ Not Connected</h3>
            <p style={{margin: '0', fontSize: '0.875rem', color: '#6b7280'}}>
              You need to connect your Stripe account first to receive payouts.
            </p>
          </div>
        )}
      </div>

      {/* Balance Information */}
      {balance?.connected && (
        <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem'}}>
          <h3 style={{margin: '0 0 1rem 0'}}>Balance Information</h3>
          <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
            <p style={{margin: '0.25rem 0'}}>
              <strong>Available:</strong> {balance.balance.available.map(a => fmt(a.amount) + ' ' + a.currency.toUpperCase()).join(', ') || '$0.00'}
            </p>
            {isInstantPayoutsEnabled && (
              <p style={{margin: '0.25rem 0'}}>
                <strong>Instant Available:</strong> {balance.balance.instant_available?.map(a => fmt(a.amount) + ' ' + a.currency.toUpperCase()).join(', ') || '$0.00'}
              </p>
            )}
            <p style={{margin: '0.25rem 0'}}>
              <strong>Pending:</strong> {balance.balance.pending.map(a => fmt(a.amount) + ' ' + a.currency.toUpperCase()).join(', ') || '$0.00'}
            </p>
          </div>
        </div>
      )}

      {/* Instant Payout */}
      {balance?.connected && isInstantPayoutsEnabled && instantAvail > 0 && (
        <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem'}}>
          <h3 style={{margin: '0 0 1rem 0'}}>Instant Payout</h3>
          <p style={{fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem 0'}}>
            Available for instant payout: <strong>{fmt(instantAvail)}</strong>
          </p>
          
          <div style={{marginBottom: '1rem'}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder={`Max: ${fmt(instantAvail)}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '200px',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            />
            <p style={{fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0'}}>
              Leave empty to payout full amount
            </p>
          </div>

          <button
            onClick={instantPayout}
            disabled={busy}
            style={{
              backgroundColor: busy ? '#9ca3af' : '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: busy ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {busy ? 'Processing...' : 'Submit Instant Payout'}
          </button>
        </div>
      )}
    </div>
  );
}
