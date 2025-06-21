import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useCart } from '../../hooks/useCart.jsx';
import AuthModal from '../auth/AuthModal';
import { FaShoppingCart } from 'react-icons/fa';
import logoImage from '../../assets/Images/LOGOTIPO(POSITIVO).png';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, cartState } = useCart();

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
            {/* Ícone do Carrinho - Melhorado */}
            {shouldShowCart() && (
              <li className="cart-nav-item">
                <Link 
                  to="/cart" 
                  className={isActive('/cart')} 
                  title={cartStateInfo.title}
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