import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import Button from '../../components/Button';

// A simple styled component for displaying error messages
const ErrorMessage = ({ children }) => (
  <div style={{
    padding: '1rem',
    borderRadius: '6px',
    backgroundColor: '#fef2f2',
    border: '1px solid #ef4444',
    color: '#991b1b',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  }}>
    {children}
  </div>
);

export default function OnboardingProfile() {
  const [form, setForm] = useState({
    displayName: '',
    photoUrl: '',
    city: '',
    zip: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing profile data when the component mounts
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const existingProfile = await api('/onboarding/profile').then(r => r.json());
        if (existingProfile) {
          setForm(prev => ({ ...prev, ...existingProfile }));
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
        setError("Could not load your profile. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await api('/onboarding/profile', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      navigate('/onboarding/categories'); // Use navigate for navigation
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || 'An unknown error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  if (isLoading) {
    return (
      <div style={{maxWidth: '720px', margin: '2rem auto', textAlign: 'center'}}>
        <p>Loading Your Profile...</p>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Complete Your Profile</h2>
      <p>Tell your community about yourself and what makes you a great guru.</p>
      
      <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem', marginTop: '1.5rem'}}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <label>
          Display Name *
          <input 
            type="text" 
            value={form.displayName} 
            onChange={handleChange('displayName')}
            required
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        
        <label>
          Photo URL
          <input 
            type="url" 
            value={form.photoUrl} 
            onChange={handleChange('photoUrl')}
            placeholder="https://example.com/your-photo.jpg"
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        
        <label>
          City *
          <input 
            type="text" 
            value={form.city} 
            onChange={handleChange('city')}
            required
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        
        <label>
          ZIP Code *
          <input 
            type="text" 
            value={form.zip} 
            onChange={handleChange('zip')}
            required
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}
          />
        </label>
        
        <label>
          Bio *
          <textarea 
            value={form.bio} 
            onChange={handleChange('bio')}
            required
            rows={4}
            placeholder="Tell people about your experience and what you love to teach..."
            style={{width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px', resize: 'vertical'}}
          />
        </label>
        
        <Button type="submit" variant="primary" disabled={isSaving} style={{marginTop: '1rem'}}>
          {isSaving ? 'Saving...' : 'Continue to Categories'}
        </Button>
      </form>
    </div>
  );
}
