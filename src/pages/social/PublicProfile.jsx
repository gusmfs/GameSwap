import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaCalendar, FaExchangeAlt, FaBoxOpen, FaTrophy } from 'react-icons/fa';
import { getUserByUsername } from '../../Data/mockUsers';
import './PublicProfile.css';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const user = getUserByUsername(username);

  if (!user) {
    return (
      <div className="public-profile-page">
        <div className="public-profile-container">
          <div className="not-found">
            <h2>Usuário não encontrado</h2>
            <p>O perfil que você está procurando não existe.</p>
            <button className="btn-back" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'tx':
        return <FaExchangeAlt />;
      case 'inv':
        return <FaBoxOpen />;
      case 'achievement':
        return <FaTrophy />;
      default:
        return <FaBoxOpen />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const formatTimestamp = (ts) => {
    const now = Date.now();
    const diff = now - ts;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Agora mesmo';
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return new Date(ts).toLocaleDateString('pt-BR');
  };

  return (
    <div className="public-profile-page">
      <div className="public-profile-container">
        {/* Header com botão voltar */}
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Voltar
        </button>

        {/* Hero Section */}
        <div className="public-hero">
          <div className="public-hero-cover" />
          <div className="public-hero-content">
            <div className="public-hero-left">
              <div className="public-hero-avatar">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName} />
                ) : (
                  <div className="public-hero-avatar-fallback" />
                )}
              </div>
              <div className="public-hero-identity">
                <h1 className="public-hero-name">{user.displayName}</h1>
                <div className="public-hero-username">{user.username}</div>
                <div className="public-hero-member">
                  <FaCalendar />
                  Membro desde {formatDate(user.memberSince)}
                </div>
              </div>
            </div>
            <div className="public-hero-actions">
              <button className="btn-follow">Seguir</button>
              <button className="btn-message">Mensagem</button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="public-stats-bar">
          <div className="public-stat-pill">
            <span className="public-stat-value">{user.stats.transactions}</span>
            <span className="public-stat-label">Transações</span>
          </div>
          <div className="public-stat-pill">
            <span className="public-stat-value">{user.stats.inventory}</span>
            <span className="public-stat-label">Itens</span>
          </div>
          <div className="public-stat-pill">
            <span className="public-stat-value">{user.stats.followers}</span>
            <span className="public-stat-label">Seguidores</span>
          </div>
          <div className="public-stat-pill">
            <span className="public-stat-value">
              <FaStar className="rating-icon" /> {user.stats.rating}
            </span>
            <span className="public-stat-label">Avaliação</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="public-main">
          <div className="public-main-content">
            {/* Bio */}
            <section className="public-section">
              <h3>Sobre</h3>
              <p className="public-bio">{user.bio}</p>
            </section>

            {/* Atividade Recente */}
            <section className="public-section">
              <h3>Atividade Recente</h3>
              <ul className="public-activity-list">
                {user.recentActivity.map((activity, idx) => (
                  <li key={idx} className={`public-activity-item activity-${activity.type}`}>
                    <div className={`public-activity-icon icon-${activity.type}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="public-activity-content">
                      <p>{activity.text}</p>
                      <span className="activity-time">{formatTimestamp(activity.ts)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="public-sidebar">
            {/* Top Items */}
            <div className="public-sidebar-card">
              <h3>Melhores Itens</h3>
              <div className="top-items-list">
                {user.topItems.map((item, idx) => (
                  <div key={idx} className="top-item">
                    <div className="top-item-info">
                      <p className="top-item-name">{item.name}</p>
                      <span className="top-item-rarity">{item.rarity}</span>
                    </div>
                    <span className="top-item-value">R$ {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="public-sidebar-card">
              <h3>Estatísticas</h3>
              <div className="stats-list">
                <div className="stat-row">
                  <span className="stat-row-label">Seguindo</span>
                  <span className="stat-row-value">{user.stats.following}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-row-label">Taxa de Sucesso</span>
                  <span className="stat-row-value">98%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-row-label">Tempo Médio</span>
                  <span className="stat-row-value">2h</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;

