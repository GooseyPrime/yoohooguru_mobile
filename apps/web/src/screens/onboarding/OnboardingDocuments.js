import React, { useState } from 'react';
import { api } from '../../lib/api';
import Button from '../../components/Button';

export default function OnboardingDocuments() {
  const [form, setForm] = useState({ 
    type:'license', 
    category:'', 
    provider:'', 
    number:'', 
    issued_on:'', 
    expires_on:'', 
    file_url:'' 
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/onboarding/documents', { method:'POST', body: JSON.stringify(form) });
      alert('Uploaded for review. You can add more or continue.');
      setForm({ type:'license', category:'', provider:'', number:'', issued_on:'', expires_on:'', file_url:'' });
    } catch (error) {
      alert('Error uploading document: ' + error.message);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({...form, [field]: e.target.value});
  };

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Upload Documents</h2>
      <p>For now, paste a document link (Google Drive/Dropbox). Storage integration is Coming Soon.</p>
      <form onSubmit={submit} style={{display: 'grid', gap: '12px'}}>
        <label>
          Type
          <select value={form.type} onChange={handleChange('type')} style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}>
            <option value="license">License</option>
            <option value="insurance">Insurance (GL)</option>
            <option value="auto">Auto Insurance</option>
            <option value="cert">Certification</option>
            <option value="id">Government ID</option>
          </select>
        </label>
        <label>
          Category (if specific)
          <input 
            value={form.category} 
            onChange={handleChange('category')} 
            placeholder="e.g., electrical" 
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        <label>
          Provider
          <input 
            value={form.provider} 
            onChange={handleChange('provider')} 
            placeholder="Issuer / Insurer" 
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        <label>
          Number
          <input 
            value={form.number} 
            onChange={handleChange('number')} 
            placeholder="Policy or license #" 
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        <label>
          Issued on
          <input 
            type="date" 
            value={form.issued_on} 
            onChange={handleChange('issued_on')}
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        <label>
          Expires on
          <input 
            type="date" 
            value={form.expires_on} 
            onChange={handleChange('expires_on')}
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        <label>
          File URL
          <input 
            value={form.file_url} 
            onChange={handleChange('file_url')} 
            placeholder="https://link.to/document.pdf" 
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        <Button type="submit" variant="primary">Add document</Button>
      </form>

      <div style={{marginTop: '16px'}}>
        <a href="/onboarding/payout" style={{color: 'var(--primary)', textDecoration: 'none'}}>
          Continue to Payout →
        </a>
      </div>
    </div>
  );
}