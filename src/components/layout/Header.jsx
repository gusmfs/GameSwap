import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import AuthModal from '../auth/AuthModal';
import logoImage from '../../assets/Images/LOGOTIPO(POSITIVO).png';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleAuthRequiredClick = (e, path) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <header>
        <nav className="main-nav">
          <div className="logo">
            <Link to="/">
              <img src={logoImage} alt="GameSwap Logo" className="logo-image" />
            </Link>
          </div>
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Menu" 
            aria-expanded={isMenuOpen}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" className={isActive('/')}>Home</Link></li>
            <li><Link to="/marketplace" className={isActive('/marketplace')}>Marketplace</Link></li>
            <li>
              <a 
                href="/inventory" 
                className={isActive('/inventory')}
                onClick={(e) => handleAuthRequiredClick(e, '/inventory')}
              >
                Meu Inventário
              </a>
            </li>
            <li>
              <a 
                href="/profile" 
                className={isActive('/profile')}
                onClick={(e) => handleAuthRequiredClick(e, '/profile')}
              >
                Perfil
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header; 