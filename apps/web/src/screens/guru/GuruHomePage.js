import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGuru } from '../../hooks/useGuru';
import GuruHeroSection from '../../components/guru/GuruHeroSection';
import GuruFeaturedPosts from '../../components/guru/GuruFeaturedPosts';
import LoadingSpinner from '../../components/LoadingSpinner';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const ServicesSection = styled.section`
  padding: 4rem 2rem;
  background: white;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    border-color: ${props => props.primaryColor}40;
  }

  ${props => props.popular && `
    border-color: ${props.primaryColor};
    
    &::before {
      content: 'Most Popular';
      position: absolute;
      top: 1rem;
      right: -2rem;
      background: ${props.primaryColor};
      color: white;
      padding: 0.25rem 3rem;
      font-size: 0.75rem;
      font-weight: 600;
      transform: rotate(45deg);
      letter-spacing: 0.5px;
    }
  `}
`;

const ServiceTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const ServiceDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ServicePrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.primaryColor};
  margin-bottom: 0.5rem;
  
  .currency {
    font-size: 1.2rem;
    vertical-align: super;
  }
  
  .period {
    font-size: 0.9rem;
    color: #666;
    font-weight: 400;
  }
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  
  li {
    padding: 0.25rem 0;
    color: #666;
    
    &::before {
      content: '✓';
      color: ${props => props.primaryColor};
      font-weight: bold;
      margin-right: 0.5rem;
    }
  }
`;

const ServiceButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.popular ? props.primaryColor : 'transparent'};
  color: ${props => props.popular ? 'white' : props.primaryColor};
  border: 2px solid ${props => props.primaryColor};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.primaryColor};
    color: white;
  }
`;

const CTASection = styled.section`
  padding: 4rem 2rem;
  background: linear-gradient(135deg, ${props => props.primaryColor}10, ${props => props.secondaryColor}10);
  text-align: center;
  
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, ${props => props.primaryColor}, ${props => props.secondaryColor});
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

function GuruHomePage() {
  const { guru, posts, services, stats, loading, error, isGuruSite, subdomain } = useGuru();

  // Set dynamic page title
  useEffect(() => {
    if (guru) {
      document.title = `${guru.character} - ${guru.seo?.title || `Learn ${guru.category} skills`}`;
      
      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && guru.seo?.description) {
        metaDescription.setAttribute('content', guru.seo.description);
      }
    }
  }, [guru]);

  // Redirect if not on a guru subdomain
  if (!isGuruSite) {
    window.location.href = process.env.REACT_APP_BASE_URL || 'https://yoohoo.guru';
    return null;
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (error || !guru) {
    return (
      <PageContainer>
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h2>Guru Not Found</h2>
          <p>The guru subdomain &quot;{subdomain}&quot; could not be loaded.</p>
          <button onClick={() => window.location.href = process.env.REACT_APP_BASE_URL || 'https://yoohoo.guru'}>
            Go to Main Site
          </button>
        </div>
      </PageContainer>
    );
  }

  const handleServiceClick = () => {
    window.open(`${process.env.REACT_APP_BASE_URL || 'https://yoohoo.guru'}/login`, '_blank');
  };

  const handleJoinCommunity = () => {
    window.open(`${process.env.REACT_APP_BASE_URL || 'https://yoohoo.guru'}/skills`, '_blank');
  };

  return (
    <PageContainer>
      <GuruHeroSection
        character={guru.character}
        theme={guru.theme}
        primarySkills={guru.primarySkills}
        stats={stats}
      />

      <GuruFeaturedPosts
        posts={posts}
        guru={guru}
        showViewAll={true}
      />

      {services && services.length > 0 && (
        <ServicesSection>
          <div className="container">
            <SectionTitle>Work With {guru.character}</SectionTitle>
            <SectionSubtitle>
              Choose the perfect learning experience that fits your goals and schedule. 
              Each session is designed to help you master {guru.category} skills effectively.
            </SectionSubtitle>
            
            <ServicesGrid>
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id || index}
                  popular={service.popular}
                  primaryColor={guru.theme.primaryColor}
                >
                  <ServiceTitle>{service.name}</ServiceTitle>
                  <ServiceDescription>{service.description}</ServiceDescription>
                  
                  <ServicePrice primaryColor={guru.theme.primaryColor}>
                    <span className="currency">$</span>
                    {service.price}
                    {service.duration && (
                      <span className="period"> / {service.duration}</span>
                    )}
                  </ServicePrice>
                  
                  {service.features && (
                    <ServiceFeatures primaryColor={guru.theme.primaryColor}>
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>{feature}</li>
                      ))}
                    </ServiceFeatures>
                  )}
                  
                  <ServiceButton
                    popular={service.popular}
                    primaryColor={guru.theme.primaryColor}
                    onClick={() => handleServiceClick()}
                  >
                    Book Now
                  </ServiceButton>
                </ServiceCard>
              ))}
            </ServicesGrid>
          </div>
        </ServicesSection>
      )}

      <CTASection
        primaryColor={guru.theme.primaryColor}
        secondaryColor={guru.theme.secondaryColor}
      >
        <div className="container">
          <CTATitle>Ready to Start Learning?</CTATitle>
          <CTAText>
            Join the YooHoo.guru community and connect with {guru.character} along with 
            thousands of other learners and experts. Your skill development journey starts here.
          </CTAText>
          <CTAButton
            primaryColor={guru.theme.primaryColor}
            secondaryColor={guru.theme.secondaryColor}
            onClick={handleJoinCommunity}
          >
            Join the Community
          </CTAButton>
        </div>
      </CTASection>
    </PageContainer>
  );
}

export default GuruHomePage;