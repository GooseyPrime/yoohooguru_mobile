import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 1rem;
  color: var(--gray-900);
`;

const Description = styled.p`
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const ComingSoon = styled.div`
  background: linear-gradient(135deg, var(--yoohoo-blue) 0%, var(--growth-green) 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: var(--radius-xl);
  margin: 2rem 0;

  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
  }

  p {
    opacity: 0.9;
    line-height: 1.6;
  }
`;

function ProfilePage() {
  return (
    <Container>
      <Content>
        <Title>Your Profile</Title>
        <Description>
          Manage your profile, skills, and preferences.
        </Description>
        
        <ComingSoon>
          <h2>🚧 Profile Management Coming Soon!</h2>
          <p>
            Your profile page is being developed with features to manage your skills,
            update your information, and customize your yoohoo.guru experience.
          </p>
        </ComingSoon>
      </Content>
    </Container>
  );
}

export default ProfilePage;