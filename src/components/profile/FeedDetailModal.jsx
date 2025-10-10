import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExchangeAlt, FaBoxOpen, FaUserPlus, FaTrophy, FaTimes } from 'react-icons/fa';

const FeedDetailModal = ({ isOpen, onClose, item }) => {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.activeElement;
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      prev?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleViewProfile = (username) => {
    if (username) {
      const cleanUsername = username.replace('@', '');
      navigate(`/public/${cleanUsername}`);
      onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'tx':
        return <FaExchangeAlt />;
      case 'inv':
        return <FaBoxOpen />;
      case 'follower':
        return <FaUserPlus />;
      case 'achievement':
        return <FaTrophy />;
      default:
        return <FaBoxOpen />;
    }
  };

  const getDetailedContent = () => {
    const timestamp = new Date(item.ts);
    const formattedDate = timestamp.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    switch (item.type) {
      case 'tx':
        // Se for uma troca, mostra informações específicas
        if (item.subtype === 'trade') {
          return (
            <>
              <div className="feed-detail-header">
                <div className={`feed-detail-icon feed-icon-${item.type}`}>
                  {getIcon(item.type)}
                </div>
                <div>
                  <h3>Detalhes da Troca</h3>
                  <p className="muted">{formattedDate}</p>
                </div>
              </div>
              <div className="feed-detail-body">
                <p>{item.text}</p>
                <div className="feed-detail-info">
                  <div className="info-row">
                    <span className="info-label">Trocou com:</span>
                    <span className="info-value trade-user">{item.tradeWith || '@usuário'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID da Transação:</span>
                    <span className="info-value">#TX{Math.floor(Math.random() * 100000)}</span>
                  </div>
                </div>
                
                <div className="trade-items">
                  <div className="trade-item-box traded">
                    <h4>Você enviou</h4>
                    <p className="item-name">{item.tradedItem || 'Item'}</p>
                    <span className="item-value">R$ {(Math.random() * 500 + 100).toFixed(2)}</span>
                  </div>
                  <div className="trade-arrow">⇄</div>
                  <div className="trade-item-box received">
                    <h4>Você recebeu</h4>
                    <p className="item-name">{item.receivedItem || 'Item'}</p>
                    <span className="item-value">R$ {(Math.random() * 500 + 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="feed-detail-info">
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className="info-value status-success">Troca Concluída</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ação:</span>
                    <button 
                      className="btn-primary-small"
                      onClick={() => handleViewProfile(item.tradeWith)}
                    >
                      Ver Perfil de {item.tradeWith || 'usuário'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        }
        
        // Se for venda ou compra normal
        return (
          <>
            <div className="feed-detail-header">
              <div className={`feed-detail-icon feed-icon-${item.type}`}>
                {getIcon(item.type)}
              </div>
              <div>
                <h3>Detalhes da Transação</h3>
                <p className="muted">{formattedDate}</p>
              </div>
            </div>
            <div className="feed-detail-body">
              <p>{item.text}</p>
              <div className="feed-detail-info">
                <div className="info-row">
                  <span className="info-label">Tipo:</span>
                  <span className="info-value">{item.subtype === 'sale' ? 'Venda' : 'Compra'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">ID da Transação:</span>
                  <span className="info-value">#TX{Math.floor(Math.random() * 100000)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Valor:</span>
                  <span className="info-value">R$ {(Math.random() * 500 + 50).toFixed(2)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className="info-value status-success">Concluída</span>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'inv':
        return (
          <>
            <div className="feed-detail-header">
              <div className={`feed-detail-icon feed-icon-${item.type}`}>
                {getIcon(item.type)}
              </div>
              <div>
                <h3>Item do Inventário</h3>
                <p className="muted">{formattedDate}</p>
              </div>
            </div>
            <div className="feed-detail-body">
              <p>{item.text}</p>
              <div className="feed-detail-info">
                <div className="info-row">
                  <span className="info-label">Nome do Item:</span>
                  <span className="info-value">{item.text.split(': ')[1]}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Raridade:</span>
                  <span className="info-value">Legendary</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Valor Estimado:</span>
                  <span className="info-value">R$ {(Math.random() * 1000 + 100).toFixed(2)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Condição:</span>
                  <span className="info-value">Factory New</span>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'follower':
        return (
          <>
            <div className="feed-detail-header">
              <div className={`feed-detail-icon feed-icon-${item.type}`}>
                {getIcon(item.type)}
              </div>
              <div>
                <h3>Novo Seguidor</h3>
                <p className="muted">{formattedDate}</p>
              </div>
            </div>
            <div className="feed-detail-body">
              <p>{item.text}</p>
              <div className="feed-detail-info">
                <div className="info-row">
                  <span className="info-label">Usuário:</span>
                  <span className="info-value">{item.text.split(' ')[2]}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total de Seguidores:</span>
                  <span className="info-value">3 seguidores</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ação:</span>
                  <button 
                    className="btn-primary-small"
                    onClick={() => handleViewProfile(item.text.split(' ')[2])}
                  >
                    Ver Perfil
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'achievement':
        return (
          <>
            <div className="feed-detail-header">
              <div className={`feed-detail-icon feed-icon-${item.type}`}>
                {getIcon(item.type)}
              </div>
              <div>
                <h3>Conquista Desbloqueada!</h3>
                <p className="muted">{formattedDate}</p>
              </div>
            </div>
            <div className="feed-detail-body">
              <p>{item.text}</p>
              <div className="feed-detail-info">
                <div className="info-row">
                  <span className="info-label">Conquista:</span>
                  <span className="info-value">{item.text.split(': ')[1]}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Raridade:</span>
                  <span className="info-value">Épica</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Progresso:</span>
                  <span className="info-value">100%</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Recompensa:</span>
                  <span className="info-value">+50 XP</span>
                </div>
              </div>
            </div>
          </>
        );
      
      default:
        return <p>{item.text}</p>;
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal feed-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-detail-title"
        onClick={stop}
        ref={dialogRef}
      >
        <button 
          ref={closeBtnRef} 
          className="modal-close-icon" 
          onClick={onClose} 
          aria-label="Fechar"
        >
          <FaTimes />
        </button>
        <div className="feed-detail-content">
          {getDetailedContent()}
        </div>
      </div>
    </div>
  );
};

export default FeedDetailModal;

