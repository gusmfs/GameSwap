import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useCart } from '../../hooks/useCart.jsx';
import AuthModal from '../auth/AuthModal';
import { FaShoppingCart } from 'react-icons/fa';
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';
import logoImage from '../../assets/Images/LOGOTIPO(POSITIVO).png';
import logoLightMode from '../../assets/Images/LOGOTIPO GAMESWAP (NEGATIVO).png';
import { useTheme } from '../../providers/ThemeProvider.jsx';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, cartState } = useCart();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleAuthRequiredClick = (e, path) => {
    e.preventDefault();
    setIsMenuOpen(false); // Fecha o menu ao clicar
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Fecha o menu ao clicar em qualquer link
  };

  // Lógica binária para determinar se mostrar o carrinho
  const shouldShowCart = () => {
    return !cartState.isEmpty && isAuthenticated;
  };

  // Lógica de decisão para o estado do carrinho
  const getCartState = () => {
    if (cartState.isOverBudget) {
      return {
        className: 'cart-icon warning',
        title: 'Saldo insuficiente no carrinho'
      };
    }
    
    if (cartState.hasInvalidItems) {
      return {
        className: 'cart-icon error',
        title: 'Itens inválidos no carrinho'
      };
    }
    
    return {
      className: 'cart-icon ready',
      title: 'Ver carrinho'
    };
  };

  const cartStateInfo = getCartState();

  return (
    <>
      <header>
        <nav className="main-nav">
          <div className="logo">
            <Link to="/">
              <img src={theme === 'light' ? logoLightMode : logoImage} alt="GameSwap Logo" className="logo-image" />
            </Link>
          </div>
          <div className="nav-actions">
            <button
              className={`theme-switch ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
              onClick={toggleTheme}
              aria-label="Alternar modo noturno/diurno"
              role="switch"
              aria-checked={theme === 'dark'}
              title={theme === 'dark' ? '☀️ Diurno' : '🌙 Noturno'}
            >
              <span className="switch-track">
                <span className="switch-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span className="switch-thumb" />
              </span>
            </button>
            <button 
              className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Menu" 
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
            </button>
          </div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" className={isActive('/')} onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/marketplace" className={isActive('/marketplace')} onClick={handleLinkClick}>Marketplace</Link></li>
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
            {/* Ícone do Carrinho - Melhorado */}
            {shouldShowCart() && (
              <li className="cart-nav-item">
                <Link 
                  to="/cart" 
                  className={isActive('/cart')} 
                  title={cartStateInfo.title}
                  onClick={handleLinkClick}
                >
                  <FaShoppingCart className={cartStateInfo.className} />
                  {cart.length > 0 && (
                    <span className="cart-count">{cart.length}</span>
                  )}
                </Link>
              </li>
            )}
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
