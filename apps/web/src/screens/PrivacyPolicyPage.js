import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: ${props => props.theme.colors.surface};
  padding: 3rem;
  border-radius: var(--r-xl);
  box-shadow: ${props => props.theme.shadow.card};
  border: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
  border-bottom: 3px solid ${props => props.theme.colors.pri};
  padding-bottom: 1rem;
`;

const LastUpdated = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.muted};
  font-style: italic;
  margin-bottom: 3rem;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;

  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
    border-left: 4px solid ${props => props.theme.colors.pri};
    padding-left: 1rem;
  }

  h3 {
    font-size: var(--text-xl);
    margin-bottom: 0.75rem;
    color: ${props => props.theme.colors.text};
    margin-top: 1.5rem;
  }

  p {
    color: ${props => props.theme.colors.muted};
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  ul {
    color: ${props => props.theme.colors.muted};
    line-height: 1.7;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const ContactInfo = styled.div`
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  margin-top: 2rem;
  text-align: center;

  h3 {
    color: var(--primary);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
  }
`;

function PrivacyPolicyPage() {
  return (
    <Container>
      <Content>
        <Title>Privacy Policy</Title>
        <LastUpdated>Last updated: December 2024</LastUpdated>

        <Section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our neighborhood-based skill-sharing platform.
          </p>
          <p>
            At {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}, we believe in creating positive community impact through skill sharing while respecting your 
            privacy and maintaining the security of your personal information.
          </p>
        </Section>

        <Section>
          <h2>2. Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>When you create an account or use our services, we may collect:</p>
          <ul>
            <li>Name, email address, and contact information</li>
            <li>Profile information, including skills, interests, and bio</li>
            <li>Geographic location (neighborhood/city level)</li>
            <li>Profile photos and other content you choose to share</li>
          </ul>

          <h3>Usage Information</h3>
          <p>We automatically collect certain information about your interaction with our platform:</p>
          <ul>
            <li>Log data, including IP address, browser type, and device information</li>
            <li>Usage patterns, including pages visited and features used</li>
            <li>Communication data from skill exchanges and platform interactions</li>
          </ul>
        </Section>

        <Section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our skill-sharing platform</li>
            <li>Connect you with other community members for skill exchanges</li>
            <li>Improve our services and develop new features</li>
            <li>Send you updates, notifications, and community news</li>
            <li>Ensure platform safety and prevent fraud or abuse</li>
            <li>Comply with legal obligations and resolve disputes</li>
          </ul>
        </Section>

        <Section>
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>With Other Users:</strong> Your profile information and skills are visible to other community members</li>
            <li><strong>Service Providers:</strong> We may share information with trusted third-party services that help us operate our platform</li>
            <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </Section>

        <Section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
            internet is 100% secure.
          </p>
        </Section>

        <Section>
          <h2>6. Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal information</li>
            <li>Control your profile visibility and communication preferences</li>
            <li>Opt out of promotional communications</li>
            <li>Request a copy of your data or account deletion</li>
            <li>Withdraw consent where applicable</li>
          </ul>
        </Section>

        <Section>
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide 
            personalized content. You can control cookie settings through your browser preferences.
          </p>
        </Section>

        <Section>
          <h2>8. Children&rsquo;s Privacy</h2>
          <p>
            Our platform is not intended for children under 13. We do not knowingly collect personal information from 
            children under 13. If we become aware of such collection, we will take steps to delete the information.
          </p>
        </Section>

        <Section>
          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be processed in countries other than your own. We ensure appropriate safeguards are 
            in place when transferring personal information internationally.
          </p>
        </Section>

        <Section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of any material changes by posting the 
            new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </Section>

        <ContactInfo>
          <h3>Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <p><strong>Email:</strong> {process.env.REACT_APP_PRIVACY_EMAIL || 'privacy@yoohoo.guru'}</p>
          <p><strong>Address:</strong> {process.env.REACT_APP_CONTACT_ADDRESS || 'yoohoo.guru, Privacy Department'}</p>
        </ContactInfo>
      </Content>
    </Container>
  );
}

export default PrivacyPolicyPage;