import React, { useEffect, useState } from 'react';
import { getBio, updateBio } from '../../services/profileMetrics';
import userProfileService from '../../services/userProfileService';
import { useAuth } from '../../providers/AuthProvider';

const MAX = 240;

const ProfileBio = () => {
  const { user, updateProfile } = useAuth();
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.id) setBio(getBio(user.id));
  }, [user?.id]);

  const onSave = () => {
    setSaving(true);
    const next = updateBio(user.id, bio.trim());
    updateProfile({ bio: next });
    try {
      userProfileService.upsertProfile({ id: user.id, name: user.name, bio: next });
    } catch {}
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 300);
  };

  return (
    <section aria-label="Biografia do perfil" className="bio-card">
      <h3>Bio</h3>
      <p className="muted">Conte quem você é, jogos favoritos, horários e regras de negociação.</p>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value.slice(0, MAX))}
        rows={5}
        placeholder="Escreva uma breve bio (máx. 240 caracteres)"
        aria-label="Editar bio"
      />
      <div className="bio-actions">
        <span className="counter" aria-live="polite">{bio.length}/{MAX}</span>
        <button onClick={onSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Bio'}</button>
        {saved && <span role="status" aria-live="polite" className="saved">Salvo!</span>}
      </div>
    </section>
  );
};

export default ProfileBio;


