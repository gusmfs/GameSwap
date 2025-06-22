import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../providers/AuthProvider';
import AgentSelector from '../../components/profile/AgentSelector';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    // Aqui você pode salvar o agente selecionado no perfil do usuário
    console.log('Agente selecionado:', agent);
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
            {/* Seção de Avatar */}
            <div className="profile-avatar-section">
              <h3>Avatar do Perfil</h3>
              <div className="avatar-container">
                <div className="current-avatar">
                  {selectedAgent ? (
                    <img src={selectedAgent.image} alt={selectedAgent.name} />
                  ) : (
                    <div className="default-avatar">
                      <FaUser />
                    </div>
                  )}
                </div>
                <button 
                  className="select-agent-btn"
                  onClick={() => setShowAgentSelector(true)}
                >
                  <FaEdit />
                  Selecionar Agente CS2
                </button>
              </div>
            </div>

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

      {/* Modal de Seleção de Agentes */}
      {showAgentSelector && (
        <AgentSelector
          onAgentSelect={handleAgentSelect}
          selectedAgent={selectedAgent}
          onClose={() => setShowAgentSelector(false)}
        />
      )}
    </div>
  );
};

export default Profile; 