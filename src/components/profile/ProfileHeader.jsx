import React from 'react';
import { FaEdit, FaExternalLinkAlt } from 'react-icons/fa';
import userProfileService from '../../services/userProfileService';

const ProfileHeader = ({ user, avatarUrl, selectedAgent, onSelectAgent, onOpenPublicProfile }) => {
  const profile = user?.id ? userProfileService.getProfileByUserId(user.id) : null;
  const displayName = profile?.name || user?.name || 'Usuário';
  const handle = profile?.slug ? `@${profile.slug}` : (user?.email ? `@${user.email.split('@')[0]}` : '@usuario');
  const bannerUrl = profile?.bannerUrl || '';
  const avatarSrc = selectedAgent?.image || avatarUrl || '';

  return (
    <header className="profile-hero" aria-label="Cabeçalho do perfil">
      <div className="profile-hero-cover" style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}} />
      <div className="profile-hero-content">
        <div className="profile-hero-left">
          <div className="hero-avatar" aria-hidden={!!avatarSrc}>
            {avatarSrc ? (
              <img src={avatarSrc} alt={displayName} />
            ) : (
              <div className="hero-avatar-fallback" />
            )}
          </div>
          <div className="hero-identity">
            <h1 className="hero-name">{displayName}</h1>
            <div className="hero-handle">{handle}</div>
          </div>
        </div>
        <div className="profile-hero-actions">
          <button className="select-agent-btn" onClick={onSelectAgent}>
            <FaEdit />
            Selecionar Agente CS2
          </button>
          <button className="select-agent-btn select-agent-btn-secondary" onClick={onOpenPublicProfile}>
            <FaExternalLinkAlt />
            Ver perfil público
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;


