import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Images/LOGOTIPO(POSITIVO).png';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
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
          <li><Link to="/inventory" className={isActive('/inventory')}>Meu Inventário</Link></li>
          <li><Link to="/profile" className={isActive('/profile')}>Perfil</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 