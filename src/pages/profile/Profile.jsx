import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import './Profile.css';
import TwoFactorSetup from '../../components/auth/TwoFactorSetup';
import twoFactorService from '../../services/twoFactorService';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [show2FA, setShow2FA] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(twoFactorService.is2FAEnabled());

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handle2FASuccess = () => {
    setIs2FAEnabled(true);
    setShow2FA(false);
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

            <div className="mt-6 mb-4">
              <div className="flex items-center gap-4">
                <span>Autenticação de Dois Fatores:</span>
                <span className={`px-2 py-1 rounded text-sm ${is2FAEnabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {is2FAEnabled ? 'Ativado' : 'Desativado'}
                </span>
                {!is2FAEnabled && (
                  <button
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => setShow2FA(true)}
                  >
                    Ativar 2FA
                  </button>
                )}
              </div>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              <span className="button-text">Sair</span>
              <div className="button-glow"></div>
            </button>
          </div>
        </div>
      </div>
      {show2FA && (
        <TwoFactorSetup onClose={() => setShow2FA(false)} onSuccess={handle2FASuccess} />
      )}
    </div>
  );
};

export default Profile; 