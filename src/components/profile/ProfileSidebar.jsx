import React from 'react';
import { FaCommentDots, FaExternalLinkAlt } from 'react-icons/fa';

const ProfileSidebar = ({ onOpenPublicProfile, onOpenFeedback, trackingEnabled, onToggleTracking }) => {
  return (
    <aside className="profile-sidebar" aria-label="Ações e preferências do perfil">
      <div className="sidebar-card">
        <button className="feedback-btn" onClick={onOpenFeedback}>
          <FaCommentDots />
          Enviar Feedback
        </button>
        <button className="feedback-btn feedback-btn-secondary" onClick={onOpenPublicProfile}>
          <FaExternalLinkAlt />
          Ver perfil público
        </button>
      </div>

      <div className="sidebar-card">
        <h3 className="sidebar-title">Privacidade</h3>
        <p className="muted">Controle se visitas ao seu perfil são registradas.</p>
        <div className="toggle-row">
          <input id="profile-tracking-side" type="checkbox" checked={trackingEnabled} onChange={onToggleTracking} />
          <label htmlFor="profile-tracking-side">Permitir registrar visitas</label>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;


