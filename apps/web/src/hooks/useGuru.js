import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to detect and manage guru subdomain context
 * Provides guru configuration, loading states, and subdomain info
 */
export function useGuru() {
  const [guru, setGuru] = useState(null);
  const [posts, setPosts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  const location = useLocation();
  
  // Detect subdomain from current hostname
  const detectSubdomain = () => {
    const hostname = window.location.hostname;
    const hostParts = hostname.split('.');
    
    // Skip common non-guru subdomains
    const excludedSubdomains = ['www', 'api', 'admin', 'staging', 'dev', 'test'];
    
    if (hostParts.length >= 2) {
      const potentialSubdomain = hostParts[0];
      
      if (!excludedSubdomains.includes(potentialSubdomain) && 
          potentialSubdomain !== 'localhost' && 
          potentialSubdomain !== 'yoohoo') {
        return potentialSubdomain;
      }
    }
    
    return null;
  };
  
  const subdomain = detectSubdomain();
  const isGuruSite = subdomain !== null;
  
  // Fetch guru data from API
  const fetchGuruData = async (subdomainName) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/gurus/${subdomainName}/home`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch guru data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setGuru(data.guru);
        setPosts(data.featuredPosts || []);
        setStats(data.stats);
      } else {
        throw new Error(data.message || 'Failed to load guru data');
      }
    } catch (err) {
      console.error('Error fetching guru data:', err);
      setError(err.message);
      
      // Fallback guru data for development/offline mode
      setGuru(getFallbackGuruData(subdomainName));
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch guru posts with filters
  const fetchPosts = async (filters = {}) => {
    if (!subdomain) return;
    
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`/api/gurus/${subdomain}/posts?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts || []);
        return data;
      } else {
        throw new Error(data.message || 'Failed to load posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      return { posts: [], error: err.message };
    }
  };
  
  // Fetch guru services
  const fetchServices = async () => {
    if (!subdomain) return;
    
    try {
      const response = await fetch(`/api/gurus/${subdomain}/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setServices(data.services || []);
      } else {
        throw new Error(data.message || 'Failed to load services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices(getFallbackServices());
    }
  };
  
  // Submit lead form
  const submitLead = async (leadData) => {
    if (!subdomain) {
      throw new Error('No guru subdomain detected');
    }
    
    try {
      const response = await fetch(`/api/gurus/${subdomain}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit lead: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit lead');
      }
      
      return data;
    } catch (err) {
      console.error('Error submitting lead:', err);
      throw err;
    }
  };
  
  // Effect to load guru data on mount and location change
  useEffect(() => {
    if (isGuruSite && subdomain) {
      fetchGuruData(subdomain);
      fetchServices();
    } else {
      setLoading(false);
    }
  }, [subdomain, location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return {
    // State
    guru,
    posts,
    services,
    stats,
    loading,
    error,
    
    // Computed
    subdomain,
    isGuruSite,
    isMainSite: !isGuruSite,
    
    // Actions
    fetchPosts,
    fetchServices,
    submitLead,
    refetch: () => fetchGuruData(subdomain)
  };
}

// Fallback guru data for development/offline mode
function getFallbackGuruData(subdomain) {
  const fallbackConfigs = {
    cooking: {
      character: 'Chef Guru',
      category: 'culinary',
      primarySkills: ['cooking', 'baking', 'nutrition', 'meal-prep'],
      theme: {
        primaryColor: '#e74c3c',
        secondaryColor: '#f39c12',
        icon: '👨‍🍳',
        emoji: '🍳'
      }
    },
    music: {
      character: 'Music Guru',
      category: 'audio',
      primarySkills: ['guitar', 'piano', 'vocals', 'production'],
      theme: {
        primaryColor: '#9b59b6',
        secondaryColor: '#8e44ad',
        icon: '🎵',
        emoji: '🎹'
      }
    },
    tech: {
      character: 'Tech Guru',
      category: 'technology',
      primarySkills: ['programming', 'web-development', 'mobile-apps'],
      theme: {
        primaryColor: '#3498db',
        secondaryColor: '#2980b9',
        icon: '💻',
        emoji: '⚡'
      }
    }
  };
  
  return fallbackConfigs[subdomain] || {
    character: 'Guru',
    category: 'general',
    primarySkills: ['teaching', 'mentoring'],
    theme: {
      primaryColor: '#6c5ce7',
      secondaryColor: '#a29bfe',
      icon: '🎯',
      emoji: '✨'
    }
  };
}

// Fallback services for development/offline mode
function getFallbackServices() {
  return [
    {
      id: 'consultation',
      name: 'One-on-One Consultation',
      description: 'Personal guidance session tailored to your goals',
      price: 75,
      duration: '60 minutes',
      popular: true
    },
    {
      id: 'workshop',
      name: 'Group Workshop',
      description: 'Interactive workshop with hands-on learning',
      price: 45,
      duration: '90 minutes',
      popular: false
    },
    {
      id: 'mentorship',
      name: 'Monthly Mentorship',
      description: 'Ongoing support and guidance program',
      price: 200,
      duration: 'Monthly',
      popular: false
    }
  ];
}