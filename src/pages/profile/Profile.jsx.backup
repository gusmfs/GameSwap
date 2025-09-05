import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../providers/AuthProvider';
import AgentSelector from '../../components/profile/AgentSelector';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ProfileDashboard from '../../components/profile/ProfileDashboard';
import ProfileDashboardModal from '../../components/profile/ProfileDashboardModal';
import ProfileBio from '../../components/profile/ProfileBio';
import userProfileService from '../../services/userProfileService';
import { 
  recordProfileVisit, 
  isTrackingEnabled as getTrackingEnabled,
  setTrackingEnabled as setTrackingPref,
  clearUserMetrics
} from '../../services/profileMetrics';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Carrega preferência de rastreamento
  useEffect(() => {
    if (user?.id) {
      setTrackingEnabled(getTrackingEnabled(user.id));
    }
  }, [user?.id]);

  // Hidrata avatar persistido do perfil social
  useEffect(() => {
    if (!user?.id) return;
    try {
      const p = userProfileService.getProfileByUserId(user.id);
      if (p?.avatarUrl) setAvatarUrl(p.avatarUrl);
    } catch {}
  }, [user?.id]);

  // Registra visita respeitando preferências
  useEffect(() => {
    if (user?.id && trackingEnabled) {
      recordProfileVisit(user.id);
    }
  }, [user?.id, trackingEnabled]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setAvatarUrl(agent?.image || '');
    // Aqui você pode salvar o agente selecionado no perfil do usuário
    console.log('Agente selecionado:', agent);
    if (user?.id) {
      try {
        userProfileService.upsertProfile({ id: user.id, name: user.name, avatarUrl: agent?.image || '' });
      } catch (e) {
        console.warn('Falha ao atualizar avatar no perfil social:', e);
      }
    }
  };

  const getPublicProfilePath = () => {
    if (!user?.id) return '/u/id/unknown';
    try {
      const p = userProfileService.getProfileByUserId(user.id);
      if (p?.slug) return `/u/${p.slug}`;
    } catch {}
    return `/u/id/${user.id}`;
  };

  const handleOpenPublicProfile = () => {
    navigate(getPublicProfilePath());
  };

  const handleToggleTracking = (e) => {
    const enabled = e.target.checked;
    setTrackingPref(user?.id, enabled);
    setTrackingEnabled(enabled);
    if (!enabled && user?.id) {
      clearUserMetrics(user.id);
    }
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
                  {(selectedAgent?.image || avatarUrl) ? (
                    <img src={selectedAgent?.image || avatarUrl} alt={selectedAgent?.name || 'Avatar do perfil'} />
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
                <button 
                  className="select-agent-btn"
                  onClick={handleOpenPublicProfile}
                >
                  Ver perfil público
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

            {/* Abas do perfil */}
            <ProfileTabs
              tabs={[
                {
                  id: 'overview',
                  label: 'Visão Geral',
                  content: (
                    <section className="profile-section" aria-label="Abrir visão geral">
                      <button className="select-agent-btn" onClick={() => setIsDashboardOpen(true)}>
                        Abrir Visão Geral
                      </button>
                    </section>
                  ),
                },
                {
                  id: 'bio',
                  label: 'Bio',
                  content: (
                    <ProfileBio />
                  ),
                },
              ]}
              onTabClick={(index, tab) => {
                if (tab.id === 'overview') {
                  setIsDashboardOpen(true);
                  return true; // impedir troca de aba (fica apenas como acionador)
                }
                return false;
              }}
            />

            {/* Privacidade e rastreamento */}
            <section className="profile-section" aria-labelledby="privacy-title">
              <h3 id="privacy-title">Privacidade</h3>
              <p className="muted">Controle se visitas ao seu perfil são registradas para estatísticas pessoais.</p>
              <div className="toggle-row">
                <input
                  id="profile-tracking"
                  type="checkbox"
                  checked={trackingEnabled}
                  onChange={handleToggleTracking}
                />
                <label htmlFor="profile-tracking">Permitir registrar visitas ao meu perfil</label>
              </div>
            </section>

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
      <ProfileDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        userId={user?.id}
      />
    </div>
  );
};

export default Profile; 