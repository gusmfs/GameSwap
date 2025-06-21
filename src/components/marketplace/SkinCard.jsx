import React, { useState, useCallback, memo } from 'react';
import { FaStar, FaExternalLinkAlt, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart.jsx';
import { useAuth } from '../../providers/AuthProvider';
import './SkinCard.css';

const SkinCard = memo(({ skin }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }, []);

  const getRarityColor = useCallback((rarity) => {
    const colors = {
      'Consumer Grade': '#b0c3d9',
      'Industrial Grade': '#5e98d9',
      'Mil-Spec Grade': '#4b69ff',
      'Restricted': '#8847ff',
      'Classified': '#d32ce6',
      'Covert': '#eb4b4b',
      'Contraband': '#e4ae39'
    };
    return colors[rarity] || '#5e98d9';
  }, []);

  const getWearIcon = useCallback((wear) => {
    if (!wear) return null;
    const wearIcons = {
      'Factory New': '🔥',
      'Minimal Wear': '✨',
      'Field-Tested': '⚡',
      'Well-Worn': '💎',
      'Battle-Scarred': '🛡️'
    };
    return wearIcons[wear] || '🎯';
  }, []);

  // Lógica binária para determinar se pode adicionar ao carrinho
  const canAddToCart = useCallback(() => {
    const validations = {
      isUserLoggedIn: !!user,
      isSkinValid: skin.isValid !== false,
      isSkinAvailable: skin.quantity !== 0,
      isPriceValid: skin.price > 0
    };

    return Object.values(validations).every(validation => validation);
  }, [user, skin.isValid, skin.quantity, skin.price]);

  // Lógica de decisão para botão de compra
  const getButtonState = useCallback(() => {
    if (!user) {
      return {
        text: 'Faça Login',
        className: 'buy-button disabled',
        disabled: true,
        action: () => window.location.href = '/login'
      };
    }

    if (!canAddToCart()) {
      return {
        text: 'Indisponível',
        className: 'buy-button disabled',
        disabled: true,
        action: () => {}
      };
    }

    if (isAddingToCart) {
      return {
        text: 'Adicionando...',
        className: 'buy-button loading',
        disabled: true,
        action: () => {}
      };
    }

    return {
      text: 'Adicionar ao Carrinho',
      className: 'buy-button',
      disabled: false,
      action: handleAddToCart
    };
  }, [user, canAddToCart, isAddingToCart]);

  const handleAddToCart = useCallback(async () => {
    if (!canAddToCart()) return;

    setIsAddingToCart(true);
    setError('');

    try {
      await addToCart(skin);
      // Feedback visual de sucesso
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setIsAddingToCart(false);
    }
  }, [canAddToCart, addToCart, skin]);

  const buttonState = getButtonState();

  return (
    <div className="skin-card transition-hover">
      <div className="skin-card-header">
        <div 
          className="rarity-bar" 
          style={{ backgroundColor: getRarityColor(skin.rarity?.name) }}
        ></div>
        {skin.stattrak && (
          <div className="stattrak-badge">
            <FaStar /> StatTrak™
          </div>
        )}
        {skin.souvenir && (
          <div className="souvenir-badge">
            🏆 Souvenir
          </div>
        )}
      </div>

      <div className="skin-image-container">
        <img 
          src={skin.image} 
          alt={skin.name}
          className="skin-image"
          loading="lazy"
        />
      </div>

      <div className="skin-info">
        <div className="skin-name-container">
          <h3 className="skin-name" title={skin.name}>
            {skin.name}
          </h3>
          <span 
            className="skin-rarity"
            style={{ color: getRarityColor(skin.rarity?.name) }}
          >
            {skin.rarity?.name}
          </span>
        </div>

        <div className="skin-details">
          <div className="wear-info">
            <span className="wear-icon">{getWearIcon(skin.wear?.name)}</span>
            <span className="wear-text">{skin.wear?.name || 'Factory New'}</span>
          </div>
          
          <div className="weapon-type">
            <span className="weapon-name">{skin.weapon?.name}</span>
          </div>
        </div>

        <div className="price-section">
          <div className="current-price">
            <span className="price-label">Preço:</span>
            <span className="price-value">{formatPrice(skin.price)}</span>
          </div>
          {skin.market_price && skin.market_price !== skin.price && (
            <div className="market-price">
              <span className="market-price-label">Steam:</span>
              <span className="market-price-value">{formatPrice(skin.market_price)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="card-actions">
          <button 
            className={buttonState.className}
            disabled={buttonState.disabled}
            onClick={buttonState.action}
          >
            {isAddingToCart ? (
              <div className="loading-spinner"></div>
            ) : buttonState.text === 'Adicionar ao Carrinho' ? (
              <>
                <FaShoppingCart />
                {buttonState.text}
              </>
            ) : (
              buttonState.text
            )}
          </button>
          <button className="inspect-button" title="Inspecionar in-game">
            <FaExternalLinkAlt />
          </button>
        </div>
      </div>
    </div>
  );
});

SkinCard.displayName = 'SkinCard';

export default SkinCard; 