import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import AgentSelector from '../../components/profile/AgentSelector';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ProfileDashboardModal from '../../components/profile/ProfileDashboardModal';
import ProfileBio from '../../components/profile/ProfileBio';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStatsBar from '../../components/profile/ProfileStatsBar';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileFeed from '../../components/profile/ProfileFeed';
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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
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

  const handleFeedbackSubmit = (feedbackData) => {
    console.log('Feedback enviado:', feedbackData);
    // Aqui você pode implementar a lógica para salvar o feedback
    // Por exemplo, enviar para uma API ou salvar no localStorage
  };

  const handleOpenFeedbackPage = () => {
    navigate('/feedback');
  };

  return (
    <div className="profile-page">
      <ProfileHeader
        user={user}
        avatarUrl={avatarUrl}
        selectedAgent={selectedAgent}
        onSelectAgent={() => setShowAgentSelector(true)}
        onOpenPublicProfile={handleOpenPublicProfile}
      />

      <div className="profile-container">
        <ProfileStatsBar userId={user?.id} user={user} />

        <div className="profile-main">
          <main className="profile-main-content">
            <ProfileTabs
              tabs={[
                {
                  id: 'feed',
                  label: 'Feed',
                  content: (
                    <section className="profile-section" aria-label="Atividades recentes">
                      <ProfileFeed user={user} />
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
              ]}
              onTabClick={(index, tab) => {
                if (tab.id === 'overview') {
                  setIsDashboardOpen(true);
                  return true; // impedir troca de aba (fica apenas como acionador)
                }
                return false;
              }}
            />

            <button className="logout-button" onClick={handleLogout}>
              <span className="button-text">Sair</span>
              <div className="button-glow"></div>
            </button>
          </main>

          <ProfileSidebar
            onOpenPublicProfile={handleOpenPublicProfile}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            trackingEnabled={trackingEnabled}
            onToggleTracking={handleToggleTracking}
          />
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
      
      {/* Modal de Feedback */}
      <FeedbackForm
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Profile;
