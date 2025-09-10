import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import Logo from './Logo';
import AuthStatusIndicator from './auth/AuthStatusIndicator';

const HeaderContainer = styled.header`
  position: sticky; 
  top: 0; 
  z-index: 50;
  backdrop-filter: saturate(140%) blur(10px);
  background: rgba(11,13,16,.55);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface);
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    /* FIX: Replaced invalid theme variable with a valid CSS box-shadow */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  padding: 0.5rem 0.75rem; 
  border-radius: var(--r-sm);
  color: var(--muted);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--t-fast) ${({ theme }) => theme.motion.in};

  &:hover { 
    color: var(--text); 
    background: rgba(255,255,255,.03); 
  }
  
  &.active { 
    color: var(--text); 
    background: rgba(124,140,255,.10); 
    border: 1px solid rgba(124,140,255,.35); 
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: var(--muted);
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--r-sm);
  transition: background var(--t-fast) ${({ theme }) => theme.motion.in};

  &:hover {
    background: rgba(255,255,255,.03);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  /* FIX: Replaced invalid theme variable with a valid CSS box-shadow */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition: background var(--t-fast) ${({ theme }) => theme.motion.in};

  &:hover {
    background: rgba(255,255,255,.03);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

function Header() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo 
          showImage={true} 
          showText={isHomePage} 
          showLettering={!isHomePage}
          size="normal" 
        />

        <Nav $isOpen={isMenuOpen}>
          <NavLink 
            to="/" 
            className={isActive('/') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/angels-list" 
            className={isActive('/angels-list') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Angel&apos;s List
          </NavLink>
          <NavLink 
            to="/skills" 
            className={isActive('/skills') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            SkillShare
          </NavLink>
          {currentUser && (
            <NavLink 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
        </Nav>

        <UserMenu>
          {/* Show auth status indicator on mobile for better UX */}
          <div style={{ display: 'none' }}>
            <AuthStatusIndicator compact={true} />
          </div>

          {currentUser ? (
            <>
              <UserButton 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={18} />
                {userProfile?.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
              </UserButton>
              
              {isUserMenuOpen && (
                <Dropdown>
                  <DropdownItem onClick={() => {
                    navigate('/profile');
                    setIsUserMenuOpen(false);
                  }}>
                    <Settings size={16} />
                    Profile
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </DropdownItem>
                </Dropdown>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AuthStatusIndicator showText={false} compact={true} />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </div>
          )}

          <MobileMenuButton 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </UserMenu>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
