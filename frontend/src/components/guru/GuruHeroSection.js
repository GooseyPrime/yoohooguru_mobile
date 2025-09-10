import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Button';

const HeroContainer = styled.section`
  background: linear-gradient(135deg, ${props => props.primaryColor}22, ${props => props.secondaryColor}22);
  padding: 4rem 2rem;
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, ${props => props.primaryColor}15, transparent 50%),
                radial-gradient(circle at 70% 80%, ${props => props.secondaryColor}15, transparent 50%);
    z-index: -1;
  }
`;

const CharacterIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.primaryColor};
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const SkillTag = styled.span`
  background: ${props => props.primaryColor}20;
  color: ${props => props.primaryColor};
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid ${props => props.primaryColor}30;
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.primaryColor};
    display: block;
  }
  
  .label {
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

function GuruHeroSection({ character, theme, primarySkills, stats }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleBookSession = () => {
    if (currentUser) {
      navigate('/dashboard', { 
        state: { 
          action: 'book-session', 
          guru: character,
          message: `I'd like to book a session with ${character}` 
        }
      });
    } else {
      navigate('/login', { 
        state: { 
          returnTo: '/dashboard',
          action: 'book-session',
          guru: character,
          message: `Sign up to book a session with ${character}` 
        }
      });
    }
  };

  const handleViewContent = () => {
    navigate('/blog');
  };

  const handleJoinCommunity = () => {
    window.open(`${process.env.REACT_APP_BASE_URL || 'https://yoohoo.guru'}/skills`, '_blank');
  };

  return (
    <HeroContainer primaryColor={theme.primaryColor} secondaryColor={theme.secondaryColor}>
      <CharacterIcon>{theme.icon}</CharacterIcon>
      
      <Title primaryColor={theme.primaryColor}>
        Welcome to {character}
      </Title>
      
      <Subtitle>
        Master {primarySkills.slice(0, 3).join(', ')} and more with expert guidance. 
        Learn from a professional with years of experience and join thousands of successful students.
      </Subtitle>
      
      <SkillsContainer>
        {primarySkills.slice(0, 5).map((skill, index) => (
          <SkillTag key={index} primaryColor={theme.primaryColor}>
            {skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </SkillTag>
        ))}
      </SkillsContainer>
      
      <CTAContainer>
        <Button 
          variant="primary" 
          size="large"
          onClick={handleBookSession}
          style={{ 
            backgroundColor: theme.primaryColor,
            borderColor: theme.primaryColor 
          }}
        >
          {currentUser ? 'Book a Session' : 'Get Started'}
        </Button>
        
        <Button 
          variant="outline" 
          size="large"
          onClick={handleViewContent}
          style={{ 
            borderColor: theme.primaryColor,
            color: theme.primaryColor 
          }}
        >
          View Learning Content
        </Button>
        
        <Button 
          variant="ghost" 
          size="large"
          onClick={handleJoinCommunity}
          style={{ color: theme.secondaryColor }}
        >
          Join Community
        </Button>
      </CTAContainer>
      
      {stats && (
        <StatsContainer>
          {stats.totalPosts > 0 && (
            <StatItem primaryColor={theme.primaryColor}>
              <span className="number">{stats.totalPosts}</span>
              <span className="label">Learning Resources</span>
            </StatItem>
          )}
          
          {stats.totalViews > 0 && (
            <StatItem primaryColor={theme.primaryColor}>
              <span className="number">{Math.floor(stats.totalViews / 1000)}K+</span>
              <span className="label">Views</span>
            </StatItem>
          )}
          
          {stats.monthlyVisitors > 0 && (
            <StatItem primaryColor={theme.primaryColor}>
              <span className="number">{stats.monthlyVisitors}</span>
              <span className="label">Monthly Visitors</span>
            </StatItem>
          )}
          
          {stats.totalLeads > 0 && (
            <StatItem primaryColor={theme.primaryColor}>
              <span className="number">{stats.totalLeads}</span>
              <span className="label">Students Helped</span>
            </StatItem>
          )}
        </StatsContainer>
      )}
    </HeroContainer>
  );
}

export default GuruHeroSection;