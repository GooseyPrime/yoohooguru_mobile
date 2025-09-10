import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ArrowRight, GraduationCap, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import HeroArt from '../components/HeroArt';

const HeroSection = styled.section`
  padding: 72px 0 24px; 
  text-align: center;
  background: ${props => props.backgroundImage 
    ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${props.backgroundImage})`
    : 'radial-gradient(1200px 600px at 50% -10%, rgba(124,140,255,.12), transparent), linear-gradient(180deg, rgba(255,255,255,.02), transparent)'
  };
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;

  h1 {
    font-size: clamp(2.625rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: var(--text);
  }

  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    margin-bottom: 2rem;
    color: var(--muted);
    line-height: 1.6;
  }
`;

const LocationDisplay = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: var(--r-md);
  font-size: 0.875rem;
  color: var(--text);
  backdrop-filter: blur(10px);
  
  .location-text {
    margin-bottom: 0.25rem;
  }
  
  .change-link {
    color: var(--pri);
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const LocationInput = styled.div`
  margin-top: 0.5rem;
  
  input {
    width: 200px;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
  
  button {
    padding: 0.25rem 0.5rem;
    background: var(--pri);
    color: white;
    border: none;
    border-radius: var(--r-sm);
    font-size: 0.875rem;
    cursor: pointer;
    
    &:hover {
      opacity: 0.9;
    }
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const WelcomeTiles = styled.div`
  max-width: 1100px; 
  margin: 24px auto; 
  padding: 0 16px;
  display: grid; 
  gap: 20px; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const Tile = styled.div`
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: var(--r-lg);
  padding: 20px; 
  box-shadow: ${({ theme }) => theme.shadow.card};
  transition: transform var(--t-med) ${({ theme }) => theme.motion.in}, 
              border-color var(--t-fast) ${({ theme }) => theme.motion.in};
  
  &:hover { 
    transform: translateY(-2px); 
    border-color: #2E3540; 
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: var(--r-md);
    background: rgba(124,140,255,.10);
    color: var(--pri);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text);
  }

  p {
    color: var(--muted);
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
`;


function HomePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  // Unsplash API - using demo/development key, should be moved to env var for production
  // const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // This would be in env vars

  const fetchCityImage = useCallback(async (cityName) => {
    try {
      // For demo purposes, we'll use a simple approach without requiring API key
      // In production, this would use the Unsplash API with proper authentication
      const mockImages = {
        'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200',
        'Los Angeles': 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=1200',
        'Chicago': 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=1200',
        'Houston': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
        'Phoenix': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        'Philadelphia': 'https://images.unsplash.com/photo-1486016006115-74a41448aea2?w=1200',
        'San Antonio': 'https://images.unsplash.com/photo-1469344804473-ce7d7a5b6086?w=1200',
        'San Diego': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200',
        'Dallas': 'https://images.unsplash.com/photo-1552659102-22faadfa16d7?w=1200',
        'Austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200'
      };
      
      const cityKey = Object.keys(mockImages).find(key => 
        cityName.toLowerCase().includes(key.toLowerCase())
      );
      
      if (cityKey) {
        setBackgroundImage(mockImages[cityKey]);
      }
    } catch (error) {
      console.log('Could not fetch city image:', error);
      // Graceful fallback - no background image
    }
  }, []);

  const getLocationFromCoords = useCallback(async (latitude, longitude) => {
    try {
      // Using a simple reverse geocoding approach
      // In production, you'd want to use a proper geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      const cityState = `${data.city || data.locality || ''}, ${data.principalSubdivision || ''}`.trim();
      
      if (cityState !== ',') {
        setLocation(cityState);
        fetchCityImage(data.city || data.locality || '');
      }
    } catch (error) {
      console.log('Could not get location details:', error);
    }
  }, [fetchCityImage]);

  const requestLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getLocationFromCoords(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // User denied or error occurred, graceful fallback
        }
      );
    }
  }, [getLocationFromCoords]);

  const handleManualLocation = useCallback(() => {
    if (locationInput.trim()) {
      setLocation(locationInput.trim());
      fetchCityImage(locationInput.trim());
      setShowLocationInput(false);
      setLocationInput('');
    }
  }, [locationInput, fetchCityImage]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <>
      <HeroSection backgroundImage={backgroundImage}>
        {location && (
          <LocationDisplay>
            <div className="location-text">{location}</div>
            <span 
              className="change-link" 
              onClick={() => setShowLocationInput(!showLocationInput)}
            >
              Change
            </span>
            {showLocationInput && (
              <LocationInput>
                <input
                  type="text"
                  placeholder="Enter city, state"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualLocation()}
                />
                <button onClick={handleManualLocation}>Set</button>
              </LocationInput>
            )}
          </LocationDisplay>
        )}
        <HeroContent>
          <HeroArt src={`${process.env.PUBLIC_URL || ''}/assets/images/yoohooguruyetiman.png`} alt="yoohoo.guru community skill-sharing platform" />
          <h1>A community where you can swap skills, share services, or find trusted local help.</h1>
          <p>
            Local connections, meaningful exchanges, and community impact through 
            our trusted skill-sharing platform.
          </p>
          <HeroButtons>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Start Your Journey
              <ArrowRight size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/angels-list')}
            >
              Browse Services
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <WelcomeTiles>
        <Tile>
          <div className="icon">
            <Wrench size={24} />
          </div>
          <h3>Angel&apos;s List</h3>
          <p>Find help and odd jobs near you.</p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/angels-list')}
          >
            Explore Angel&apos;s List →
          </Button>
        </Tile>
        
        <Tile>
          <div className="icon">
            <GraduationCap size={24} />
          </div>
          <h3>SkillShare</h3>
          <p>Learn or teach. Book a Guru or swap skills.</p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/skills')}
          >
            Explore Skills
          </Button>
        </Tile>
      </WelcomeTiles>
    </>
  );
}

export default HomePage;