
import React, { useState } from 'react';
import styled from 'styled-components';
import { MapPin, DollarSign, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: var(--muted);
  font-size: 1.125rem;
  margin-bottom: 2rem;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
  
  &::placeholder {
    color: var(--muted);
  }
  
  &:focus {
    outline: 2px solid var(--pri);
    outline-offset: 2px;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
  min-width: 120px;
  
  &:focus {
    outline: 2px solid var(--pri);
    outline-offset: 2px;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const CategoryCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 1.5rem;
  transition: all var(--t-med) ${({ theme }) => theme.motion.in};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    border-color: #2E3540;
    box-shadow: ${({ theme }) => theme.shadow.card};
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CategoryTitle = styled.h3`
  margin: 0;
  color: var(--text);
`;

const CategoryBadge = styled.span`
  background: rgba(124,140,255,.10);
  color: var(--pri);
  padding: 0.25rem 0.5rem;
  border-radius: var(--r-sm);
  font-size: 0.75rem;
  font-weight: 600;
`;

const CategoryDescription = styled.p`
  color: var(--muted);
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const CategoryMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

function AngelsListPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleViewAngels = (categoryTitle) => {
    // Filter the current view to show only this category
    // In a full implementation, this would filter the providers list
    const categoryLower = categoryTitle.toLowerCase();
    if (categoryLower.includes('handyman')) {
      setSelectedCategory('home');
    } else if (categoryLower.includes('lawn') || categoryLower.includes('garden')) {
      setSelectedCategory('outdoor');
    } else if (categoryLower.includes('clean')) {
      setSelectedCategory('cleaning');
    } else if (categoryLower.includes('tutoring') || categoryLower.includes('music')) {
      setSelectedCategory('education');
    } else if (categoryLower.includes('errand') || categoryLower.includes('grocery')) {
      setSelectedCategory('lifestyle');
    } else {
      setSelectedCategory('all');
    }
    
    // Scroll to the filtered results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNow = (categoryTitle) => {
    // Check if user is authenticated
    if (!currentUser) {
      // Redirect to login with return URL
      navigate('/login', { 
        state: { 
          returnTo: '/angels-list',
          message: `Please sign in to book ${categoryTitle}`
        }
      });
      return;
    }
    
    // For authenticated users, navigate to booking flow
    // In a full implementation, this would open a booking modal or navigate to booking page
    navigate('/dashboard', {
      state: {
        action: 'book-service',
        category: categoryTitle,
        message: `Ready to book ${categoryTitle}. Complete your profile to continue.`
      }
    });
  };

  const categories = [
    {
      id: 1,
      title: 'Handyman Services',
      description: 'Basic repairs, installations, and maintenance around your home.',
      avgPrice: '$25-45/hr',
      providers: 12,
      rating: 4.8,
      city: 'Denver',
      category: 'home'
    },
    {
      id: 2,
      title: 'Moving Help',
      description: 'Strong hands to help with packing, loading, and moving assistance.',
      avgPrice: '$20-35/hr',
      providers: 8,
      rating: 4.9,
      city: 'Denver',
      category: 'moving'
    },
    {
      id: 3,
      title: 'Cleaning Services',
      description: 'Professional home and office cleaning services.',
      avgPrice: '$30-50/hr',
      providers: 15,
      rating: 4.7,
      city: 'Boulder',
      category: 'cleaning'
    },
    {
      id: 4,
      title: 'Yard Work',
      description: 'Lawn mowing, weeding, and basic landscaping services.',
      avgPrice: '$25-40/hr',
      providers: 6,
      rating: 4.6,
      city: 'Denver',
      category: 'outdoor'
    },
    {
      id: 5,
      title: 'Pet Sitting',
      description: 'Caring for your pets while you\'re away.',
      avgPrice: '$15-25/hr',
      providers: 10,
      rating: 4.9,
      city: 'Boulder',
      category: 'pets'
    },
    {
      id: 6,
      title: 'Errands & Shopping',
      description: 'Personal assistance with shopping and daily errands.',
      avgPrice: '$18-30/hr',
      providers: 7,
      rating: 4.8,
      city: 'Denver',
      category: 'errands'
    }
  ];

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || category.city === selectedCity;
    const matchesCategoryFilter = selectedCategory === 'all' || category.category === selectedCategory;
    
    return matchesSearch && matchesCity && matchesCategoryFilter;
  });

  return (
    <PageContainer>
      <Header>
        <Title>Angel&apos;s List</Title>
        <Subtitle>
          Browse local help, rentals, and odd jobs. Booking will prompt sign‑in.
        </Subtitle>
      </Header>
      
      <FilterBar>
        <SearchInput 
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect 
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="all">All Cities</option>
          <option value="Denver">Denver</option>
          <option value="Boulder">Boulder</option>
        </FilterSelect>
        <FilterSelect 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="home">Home</option>
          <option value="moving">Moving</option>
          <option value="cleaning">Cleaning</option>
          <option value="outdoor">Outdoor</option>
          <option value="pets">Pets</option>
          <option value="errands">Errands</option>
        </FilterSelect>
      </FilterBar>
      
      <CategoriesGrid>
        {filteredCategories.map(category => (
          <CategoryCard key={category.id}>
            <CategoryHeader>
              <CategoryTitle>{category.title}</CategoryTitle>
              <CategoryBadge>{category.providers} angels</CategoryBadge>
            </CategoryHeader>
            <CategoryDescription>{category.description}</CategoryDescription>
            <CategoryMeta>
              <MetaItem>
                <DollarSign size={14} />
                {category.avgPrice}
              </MetaItem>
              <MetaItem>
                <MapPin size={14} />
                {category.city}
              </MetaItem>
              <MetaItem>
                <Star size={14} />
                {category.rating}
              </MetaItem>
            </CategoryMeta>
            <CategoryActions>
              <Button variant="ghost" size="sm" onClick={() => handleViewAngels(category.title)}>
                View Angels
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleBookNow(category.title)}>
                Book Now
              </Button>
            </CategoryActions>
          </CategoryCard>
        ))}
      </CategoriesGrid>
      
      {filteredCategories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <p>No services found matching your criteria.</p>
        </div>
      )}
    </PageContainer>
  );
}

export default AngelsListPage;
