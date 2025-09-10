import React from 'react';
import styled from 'styled-components';

const HeroArtContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem;
  text-align: center;
  position: relative;
`;

const ArtImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: var(--r-lg);
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

const PlaceholderArt = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, var(--pri) 0%, var(--succ) 100%);
  border-radius: var(--r-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

const HeroArt = ({ src, alt, className }) => {
  return (
    <HeroArtContainer className={className}>
      {src ? (
        <ArtImage 
          src={src} 
          alt={alt || "Hero artwork for yoohoo.guru"} 
        />
      ) : (
        <PlaceholderArt>
          🎨 Hero Artwork Placeholder
          <br />
          <small style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Replace with community art piece
          </small>
        </PlaceholderArt>
      )}
    </HeroArtContainer>
  );
};

export default HeroArt;