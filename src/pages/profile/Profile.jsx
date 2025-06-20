import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="animated-background">
        <div className="blur-circle circle1"></div>
        <div className="blur-circle circle2"></div>
        <div className="blur-circle circle3"></div>
      </div>
      
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Perfil do Usuário</h1>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-info">
              <div className="info-group">
                <label>Nome</label>
                <p>{user?.name || 'N/A'}</p>
              </div>
              
              <div className="info-group">
                <label>Email</label>
                <p>{user?.email || 'N/A'}</p>
              </div>

              <div className="info-group">
                <label>Membro desde</label>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{user?.transactions?.length || 0}</span>
                <span className="stat-label">Transações</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user?.inventory?.length || 0}</span>
                <span className="stat-label">Itens no Inventário</span>
              </div>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              <span className="button-text">Sair</span>
              <div className="button-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 