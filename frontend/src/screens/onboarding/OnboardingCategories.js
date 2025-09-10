import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import ComingSoon from '../../components/ComingSoon';
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

export default function OnboardingCategories() {
  const [cats, setCats] = useState([]);
  const [picks, setPicks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch both the available categories and the user's current profile concurrently
        const [categoriesResp, profileResp] = await Promise.all([
          api('/skills/categories'),
          api('/onboarding/profile')
        ]);
        
        const categoriesData = await categoriesResp.json();
        const profileData = await profileResp.json();
        
        setCats(categoriesData);

        // Pre-populate selections from the user's profile
        if (profileData && profileData.categories) {
          const initialPicks = profileData.categories.reduce((acc, slug) => {
            acc[slug] = { selectedAt: Date.now() }; // or a simpler boolean `true`
            return acc;
          }, {});
          setPicks(initialPicks);
        }
      } catch (err) {
        console.error("Failed to load category data:", err);
        setError("Could not load categories. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggle = (slug) => setPicks(prev => ({ ...prev, [slug]: prev[slug] ? undefined : { selectedAt: Date.now() } }));

  const handleSubmit = async () => {
    setIsSaving(true);
    setError('');
    try {
      const chosen = Object.keys(picks).filter(k => !!picks[k]);
      await api('/onboarding/categories', { 
        method:'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: chosen })
      });
      navigate('/onboarding/requirements'); // Use navigate for navigation
    } catch (err) {
      console.error('Error saving categories:', err);
      setError(err.message || 'An unknown error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
        <div style={{maxWidth: '720px', margin: '2rem auto', textAlign: 'center'}}>
            <p>Loading Your Categories...</p>
        </div>
    );
  }

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Choose what you offer</h2>
      <p>Select all that apply. Items marked <ComingSoon /> are not yet open for booking.</p>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginTop: '1.5rem'}}>
        {cats.map(c => {
            const isSelected = !!picks[c.slug];
            return (
                <label 
                    key={c.slug} 
                    style={{
                        border: isSelected ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                        backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                        borderRadius: '12px', 
                        padding: '12px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        transition: 'border 0.2s, background-color 0.2s'
                    }}
                >
                    <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggle(c.slug)} 
                    />
                    <span style={{flex: 1}}>
                        {c.name} {c.comingSoon && <ComingSoon />}
                    </span>
                </label>
            );
        })}
      </div>
      <Button onClick={handleSubmit} variant="primary" style={{marginTop: '16px'}} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Continue'}
      </Button>
    </div>
  );
}
