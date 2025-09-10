import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const StepCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: var(--text-xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  p {
    font-size: var(--text-base);
    line-height: 1.6;
    color: ${props => props.theme.colors.muted};
  }
`;

const StepNumber = styled.span`
  background: ${props => props.theme.colors.pri};
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: var(--text-sm);
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  
  h4 {
    font-size: var(--text-lg);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: var(--text-sm);
    color: ${props => props.theme.colors.muted};
    line-height: 1.5;
  }
`;

function HowItWorksPage() {
  return (
    <Container>
      <Content>
        <Title>How It Works</Title>
        
        <StepCard>
          <h3>
            <StepNumber>1</StepNumber>
            Create Your Profile
          </h3>
          <p>
            Sign up and tell us about the skills you have to offer and what you&apos;d like to learn. 
            Add your location, availability, and experience level to help others find you.
          </p>
        </StepCard>

        <StepCard>
          <h3>
            <StepNumber>2</StepNumber>
            Browse & Connect
          </h3>
          <p>
            Search for skills in your area or browse the Angel&apos;s List for local help. 
            Connect with neighbors who can teach you something new or help with odd jobs.
          </p>
        </StepCard>

        <StepCard>
          <h3>
            <StepNumber>3</StepNumber>
            Book Sessions
          </h3>
          <p>
            Schedule skill-sharing sessions or book help for tasks around your home. 
            Our AI coaching system helps match learning styles and ensures productive exchanges.
          </p>
        </StepCard>

        <StepCard>
          <h3>
            <StepNumber>4</StepNumber>
            Learn & Earn
          </h3>
          <p>
            Attend your sessions, learn new skills, and help others in return. 
            Build meaningful connections while improving yourself and your community.
          </p>
        </StepCard>

        <FeatureGrid>
          <FeatureCard>
            <h4>Skill Sharing</h4>
            <p>
              Exchange knowledge with neighbors. Teach what you know, learn what interests you.
            </p>
          </FeatureCard>
          
          <FeatureCard>
            <h4>Odd Jobs</h4>
            <p>
              Get help with tasks around your home or offer your services to earn extra income.
            </p>
          </FeatureCard>
          
          <FeatureCard>
            <h4>AI Coaching</h4>
            <p>
              Our AI system helps optimize learning sessions and matches compatible learning styles.
            </p>
          </FeatureCard>
          
          <FeatureCard>
            <h4>Community Building</h4>
            <p>
              Build stronger neighborhoods through meaningful skill exchanges and helping relationships.
            </p>
          </FeatureCard>
        </FeatureGrid>
      </Content>
    </Container>
  );
}

export default HowItWorksPage;