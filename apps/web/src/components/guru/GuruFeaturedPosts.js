import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FeaturedContainer = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
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

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PostCard = styled.article`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const PostImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${props => props.primaryColor}20, ${props => props.secondaryColor}20);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.primaryColor}, ${props => props.secondaryColor});
  }
`;

const PostContent = styled.div`
  padding: 1.5rem;
`;

const PostTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  line-height: 1.4;
`;

const PostExcerpt = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #999;
`;

const PostTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: ${props => props.primaryColor}15;
  color: ${props => props.primaryColor};
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ViewsCount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &::before {
    content: '👁️';
    font-size: 0.8rem;
  }
`;

const ReadTime = styled.span`
  &::before {
    content: '📖';
    margin-right: 0.25rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  .message {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .submessage {
    font-size: 0.9rem;
    opacity: 0.7;
  }
`;

const ViewAllButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, ${props => props.primaryColor}, ${props => props.secondaryColor});
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

function GuruFeaturedPosts({ posts, guru, showViewAll = true }) {
  const navigate = useNavigate();

  const handlePostClick = (post) => {
    navigate(`/blog/${post.slug}`);
  };

  const handleViewAll = () => {
    navigate('/blog');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const estimateReadTime = (content) => {
    if (!content) return '3 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (!posts || posts.length === 0) {
    return (
      <FeaturedContainer>
        <SectionTitle>Learning Resources</SectionTitle>
        <EmptyState>
          <span className="icon">📚</span>
          <div className="message">Content Coming Soon!</div>
          <div className="submessage">
            {guru?.character} is preparing amazing learning resources for you.
          </div>
        </EmptyState>
      </FeaturedContainer>
    );
  }

  return (
    <FeaturedContainer>
      <SectionTitle>Featured Learning Resources</SectionTitle>
      <SectionSubtitle>
        Discover expert insights, tutorials, and guides from {guru?.character} to accelerate your learning journey.
      </SectionSubtitle>
      
      <PostsGrid>
        {posts.map((post, index) => (
          <PostCard key={post.id || index} onClick={() => handlePostClick(post)}>
            <PostImage 
              primaryColor={guru?.theme?.primaryColor || '#6c5ce7'} 
              secondaryColor={guru?.theme?.secondaryColor || '#a29bfe'}
            >
              {guru?.theme?.emoji || '📝'}
            </PostImage>
            
            <PostContent>
              <PostTitle>{post.title}</PostTitle>
              
              {post.tags && post.tags.length > 0 && (
                <PostTags>
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Tag 
                      key={tagIndex} 
                      primaryColor={guru?.theme?.primaryColor || '#6c5ce7'}
                    >
                      {tag}
                    </Tag>
                  ))}
                </PostTags>
              )}
              
              <PostExcerpt>
                {post.excerpt || post.content?.substring(0, 150) + '...' || 'A comprehensive guide that will help you master new skills and techniques.'}
              </PostExcerpt>
              
              <PostMeta>
                <span>{formatDate(post.publishedAt)}</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {post.views && (
                    <ViewsCount>{post.views}</ViewsCount>
                  )}
                  <ReadTime>{estimateReadTime(post.content)}</ReadTime>
                </div>
              </PostMeta>
            </PostContent>
          </PostCard>
        ))}
      </PostsGrid>
      
      {showViewAll && posts.length >= 3 && (
        <ViewAllButton
          onClick={handleViewAll}
          primaryColor={guru?.theme?.primaryColor || '#6c5ce7'}
          secondaryColor={guru?.theme?.secondaryColor || '#a29bfe'}
        >
          View All Resources
        </ViewAllButton>
      )}
    </FeaturedContainer>
  );
}

export default GuruFeaturedPosts;