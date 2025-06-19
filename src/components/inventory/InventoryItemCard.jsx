import React from 'react';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import './InventoryItemCard.css';

const InventoryItemCard = ({ item, onEdit, onDelete, onMarkAsSold }) => {
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
    <div className={`inventory-card transition-hover ${item.status}`}>
      <div className="inventory-card-header">
        <div 
          className="rarity-bar" 
          style={{ backgroundColor: getRarityColor(item.rarity?.name) }}
        ></div>
        {item.stattrak && (
          <div className="stattrak-badge">
            <FaStar /> StatTrak™
          </div>
        )}
        {item.status === 'sold' && (
          <div className="sold-badge">
            Vendido
          </div>
        )}
      </div>

      <div className="skin-image-container">
        <img 
          src={item.image} 
          alt={item.name}
          className="skin-image"
          loading="lazy"
        />
      </div>

      <div className="skin-info">
        <div className="skin-name-container">
          <h3 className="skin-name" title={item.name}>
            {item.name}
          </h3>
          <span 
            className="skin-rarity"
            style={{ color: getRarityColor(item.rarity?.name) }}
          >
            {item.rarity?.name}
          </span>
        </div>

        <div className="skin-details">
          <div className="wear-info">
            <span className="wear-icon">{getWearIcon(item.wear?.name)}</span>
            <span className="wear-text">{item.wear?.name || 'Factory New'}</span>
          </div>
          
          <div className="weapon-type">
            <span className="weapon-name">{item.weapon?.name}</span>
          </div>
        </div>

        <div className="price-section">
          <div className="current-price">
            <span className="price-label">Preço:</span>
            <span className="price-value">{formatPrice(item.price)}</span>
          </div>
        </div>

        {item.status === 'active' && (
          <div className="card-actions">
            <button 
              className="edit-button" 
              onClick={() => onEdit(item)}
              title="Editar item"
            >
              <FaEdit />
            </button>
            <button 
              className="sell-button"
              onClick={() => onMarkAsSold(item.id)}
            >
              Marcar como Vendido
            </button>
            <button 
              className="delete-button" 
              onClick={() => onDelete(item.id)}
              title="Remover item"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryItemCard; 