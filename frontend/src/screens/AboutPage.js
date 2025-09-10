import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  
  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: var(--text-base);
    line-height: 1.6;
    color: ${props => props.theme.colors.muted};
    margin-bottom: 1rem;
  }
`;

const FounderSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const FounderImage = styled.div`
  width: 200px;
  height: 200px;
  background: ${props => props.theme.colors.elev};
  border-radius: var(--r-lg);
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.muted};
  font-size: var(--text-sm);
  text-align: center;
`;

const ContactInfo = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    font-size: var(--text-lg);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    margin-bottom: 0.5rem;
  }
`;

function AboutPage() {
  return (
    <Container>
      <Content>
        <Title>About yoohoo.guru</Title>
        
        <Section>
          <h2>About InTellMe</h2>
          <p>
            InTellMe is an independent, founder-led studio building human-centered tools that make everyday life simpler, fairer, and more connected. We&apos;re the team behind YooHoo Guru—a friendly skill-swap and odd-jobs marketplace where neighbors teach, learn, and lend a hand. Our approach is practical: design clear systems, reward real effort, and keep trust at the center of every exchange.
          </p>
        </Section>

        <Section>
          <h2>What we value</h2>
          <p><strong>Trust & safety:</strong> real people, transparent terms, honest reviews</p>
          <p><strong>Learn by doing:</strong> swap skills, not just messages</p>
          <p><strong>Local first:</strong> strong communities start on your street</p>
        </Section>

        <FounderSection>
          <h2>Meet the Founder: Michael Brandon Lane</h2>
          <FounderImage>
            Founder Photo
            <br />
            (Image will be added)
          </FounderImage>
          <p>
            Hi—I&apos;m Michael Brandon Lane, but most folks call me Brandon (or &quot;Goosey&quot;). I&apos;m a hands-on builder with roots in science and engineering, focused on turning useful ideas into everyday tools. After a hard-won health journey, I doubled down on projects that help people help each other—like YooHoo Guru, where a little know-how can make a big difference for your neighbor.
          </p>
          <p>
            I cook, code, research, and obsess over how systems work. InTellMe is how I channel that curiosity into products that create real-world value.
          </p>
          <p>
            Fun note: our yeti mascot rides a motorcycle—but never cuts corners on safety or service.
          </p>
        </FounderSection>

        <ContactInfo>
          <h3>Contact Information</h3>
          <p><strong>InTellMe - Yoohoo.Guru</strong></p>
          <p>326 Delaware Street</p>
          <p>Johnson City, TN 37604</p>
          <p>Phone: (747) 322-1977</p>
          <p>Email: support@yoohoo.guru</p>
        </ContactInfo>
      </Content>
    </Container>
  );
}

export default AboutPage;