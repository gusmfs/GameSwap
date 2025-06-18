import React from 'react';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import './SkinCard.css';

const SkinCard = ({ skin }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getRarityColor = (rarity) => {
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
  };

  const getWearIcon = (wear) => {
    if (!wear) return null;
    const wearIcons = {
      'Factory New': '🔥',
      'Minimal Wear': '✨',
      'Field-Tested': '⚡',
      'Well-Worn': '💎',
      'Battle-Scarred': '🛡️'
    };
    return wearIcons[wear] || '🎯';
  };

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

        <div className="card-actions">
          <button className="buy-button">
            Comprar Agora
          </button>
          <button className="inspect-button" title="Inspecionar in-game">
            <FaExternalLinkAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinCard; 