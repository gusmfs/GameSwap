import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userProfileService from '../../services/userProfileService';
import { useAuth } from '../../providers/AuthProvider';
import { fetchInventoryItems } from '../../services/inventoryApi';
import { recordProfileVisit, isTrackingEnabled } from '../../services/profileMetrics';
import '../../pages/profile/Profile.css';

const currency = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);

const SocialProfile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user: viewer } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    let userId = null;
    if (params.slug) {
      const bySlug = userProfileService.getUserIdBySlug(params.slug);
      userId = bySlug;
    }
    if (!userId && params.userId) {
      userId = params.userId;
    }
    if (!userId) { setNotFound(true); return; }
    const p = userProfileService.getProfileByUserId(userId);
    if (!p) { setNotFound(true); return; }
    setProfile(p);
    if (isTrackingEnabled(userId)) recordProfileVisit(userId, { ref: 'social-profile' });
    setFollowers(userProfileService.getFollowersCount(userId));
    setIsFollowing(userProfileService.isFollowing(viewer?.id, userId));
  }, [params.slug, params.userId, viewer?.id]);

  const allItems = useMemo(() => fetchInventoryItems(), []);
  const activeItems = useMemo(() => allItems.filter(i => i.status === 'active'), [allItems]);
  const soldItems = useMemo(() => allItems.filter(i => i.status === 'sold'), [allItems]);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      alert('Link copiado!');
    } catch {
      // fallback simples
    }
  };

  const handleFollowToggle = () => {
    if (!viewer?.id) {
      // redireciona para login com retorno
      navigate(`/login`, { state: { from: { pathname: `/u/${params.slug || `id/${profile.id}`}` } } });
      return;
    }
    if (viewer.id === profile.id) return; // não segue a si mesmo
    const wasFollowing = userProfileService.isFollowing(viewer.id, profile.id);
    if (wasFollowing) {
      userProfileService.unfollow(viewer.id, profile.id);
      setIsFollowing(false);
      setFollowers((v) => Math.max(0, v - 1));
    } else {
      userProfileService.follow(viewer.id, profile.id);
      setIsFollowing(true);
      setFollowers((v) => v + 1);
    }
  };

  if (notFound) return <main id="conteudo" className="profile-page"><div className="profile-container"><h1 className="profile-title">Perfil não encontrado</h1></div></main>;
  if (!profile) return null;

  return (
    <main id="conteudo" className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">{profile.name}</h1>
        </div>

        <div className="profile-content">
          <div className="profile-card" style={{ width: '100%' }}>
            <div className="profile-avatar-section">
              <h3>Perfil Público</h3>
              <div className="avatar-container">
                <div className="current-avatar">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={`Avatar de ${profile.name}`} />
                  ) : (
                    <div className="default-avatar">{profile.name?.[0] || 'U'}</div>
                  )}
                </div>
                <button className="select-agent-btn" onClick={handleShare}>Compartilhar Perfil</button>
                {viewer?.id && viewer.id === profile.id ? null : (
                  <button
                    className="select-agent-btn"
                    aria-pressed={isFollowing}
                    onClick={handleFollowToggle}
                    title={isFollowing ? 'Deixar de seguir' : 'Seguir'}
                  >
                    {isFollowing ? `Seguindo (${followers})` : `Seguir (${followers})`}
                  </button>
                )}
              </div>
            </div>

            <section className="bio-card" aria-label="Biografia do perfil">
              <h3>Bio</h3>
              <p className="muted">{profile.bio || 'Este usuário ainda não escreveu uma bio.'}</p>
            </section>

            <section className="profile-section" aria-label="Anúncios ativos">
              <h3>Anúncios Ativos</h3>
              {activeItems.length === 0 ? (
                <p className="muted">Nenhum anúncio ativo.</p>
              ) : (
                <div className="public-items-grid">
                  {activeItems.map(item => (
                    <div key={item.id} className="public-item-card">
                      <div className="pic">
                        <img src={item.image} alt={item.name} loading="lazy" />
                      </div>
                      <div className="info">
                        <div className="name" title={item.name}>{item.name}</div>
                        <div className="meta">
                          <span className="weapon">{item.weapon?.name}</span>
                          {item.wear?.name && <span className="dot">•</span>}
                          <span className="wear">{item.wear?.name}</span>
                        </div>
                        <div className="price">{currency(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="profile-section" aria-label="Itens vendidos">
              <h3>Itens Vendidos</h3>
              {soldItems.length === 0 ? (
                <p className="muted">Nenhuma venda registrada.</p>
              ) : (
                <div className="public-items-grid">
                  {soldItems.map(item => (
                    <div key={item.id} className="public-item-card sold">
                      <div className="pic">
                        <img src={item.image} alt={item.name} loading="lazy" />
                      </div>
                      <div className="info">
                        <div className="name" title={item.name}>{item.name}</div>
                        <div className="meta">
                          <span className="weapon">{item.weapon?.name}</span>
                          {item.wear?.name && <span className="dot">•</span>}
                          <span className="wear">{item.wear?.name}</span>
                        </div>
                        <div className="price">{currency(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SocialProfile;


