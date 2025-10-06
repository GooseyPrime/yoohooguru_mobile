import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';

const FooterContainer = styled.footer`
  background: var(--surface);
  color: var(--muted);
  padding: 3rem 0 1.5rem;
  margin-top: auto;
  border-top: 1px solid var(--border);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: var(--text);
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: var(--muted);
  }

  a {
    color: var(--muted);
    text-decoration: none;
    transition: color var(--t-fast);

    &:hover {
      color: var(--pri);
      text-decoration: none;
    }
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.5rem;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--border);
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;

  a {
    color: var(--muted);
    font-size: 1.2rem;
    transition: color var(--t-fast);

    &:hover {
      color: var(--pri);
    }
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <Logo showImage={true} showText={true} size="normal" to="/" />
            <p>
              A neighborhood-based skill-sharing platform where users exchange skills,
              discover purpose, and create exponential community impact.
            </p>
            <p>
              Join thousands of learners and teachers creating waves of positive change
              in their communities.
            </p>
          </FooterSection>

          <FooterSection>
            <h3>Quick Links</h3>
            <FooterLinks>
              <li><a href="/skills">Browse Skills</a></li>
              <li><a href="/angels-list">Angel&apos;s List</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/how-it-works">How It Works</a></li>
              <li><a href="/pricing">Pricing</a></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Community</h3>
            <FooterLinks>
              <li><a href="/blog">Blog <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(Coming Soon)</span></a></li>
              <li><a href="/success-stories">Success Stories <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(Coming Soon)</span></a></li>
              <li><a href="/events">Community Events <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(Coming Soon)</span></a></li>
              <li><a href="/forum">Discussion Forum <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(Coming Soon)</span></a></li>
              <li><a href="/mentorship">Mentorship Program <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(Coming Soon)</span></a></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Support</h3>
            <FooterLinks>
              <li><a href="/help">Help Center <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(Coming Soon)</span></a></li>
              <li><a href="/contact">Contact Us <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(Coming Soon)</span></a></li>
              <li><a href="/safety">Safety & Trust <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(Coming Soon)</span></a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <p>&copy; 2024 {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}. All rights reserved.</p>
          <SocialLinks>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" aria-label="Discord">Discord</a>
          </SocialLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;