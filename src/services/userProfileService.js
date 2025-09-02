// Serviço de Perfil Social (localStorage) – preparado para futura API

const PROFILE_KEY = 'gsw_user_profiles'; // { [userId]: Profile }
const SLUG_MAP_KEY = 'gsw_slug_to_user'; // { [slug]: userId }
const VERSION_KEY = 'gsw_user_profiles_version';
const SCHEMA_VERSION = 1;
const FOLLOW_KEY = 'gsw_follow_map'; // { [viewerId]: { [targetUserId]: ts } }

const safeRead = (key, fallback = {}) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const normalize = (str) => (str || '').toString().trim().toLowerCase();
const slugify = (name) => normalize(name).replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const ensureVersion = () => {
  const v = parseInt(localStorage.getItem(VERSION_KEY) || '0', 10);
  if (v !== SCHEMA_VERSION) {
    // migrações futuras
    localStorage.setItem(VERSION_KEY, String(SCHEMA_VERSION));
  }
};

export const getProfileByUserId = (userId) => {
  ensureVersion();
  const store = safeRead(PROFILE_KEY);
  return store[userId] || null;
};

export const getUserIdBySlug = (slug) => {
  ensureVersion();
  const map = safeRead(SLUG_MAP_KEY);
  return map[normalize(slug)] || null;
};

export const getProfileBySlug = (slug) => {
  const userId = getUserIdBySlug(slug);
  return userId ? getProfileByUserId(userId) : null;
};

const allocateUniqueSlug = (baseName, currentUserId = null) => {
  const base = slugify(baseName) || 'usuario';
  const map = safeRead(SLUG_MAP_KEY);
  // Se já existe mapeado para este user, mantenha
  if (currentUserId) {
    const existingSlug = Object.keys(map).find((s) => map[s] === currentUserId);
    if (existingSlug && existingSlug.startsWith(base)) return existingSlug;
  }
  let candidate = base;
  let counter = 1;
  while (map[candidate] && map[candidate] !== currentUserId) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }
  return candidate;
};

export const upsertProfile = (partial) => {
  ensureVersion();
  if (!partial || !partial.id) throw new Error('upsertProfile: id requerido');
  const profiles = safeRead(PROFILE_KEY);
  const slugs = safeRead(SLUG_MAP_KEY);

  const prev = profiles[partial.id] || {};
  const name = partial.name ?? prev.name ?? 'Usuário';
  let slug = prev.slug;
  if (!slug || (partial.name && slugify(partial.name) !== slugify(prev.name || ''))) {
    // mudou o nome → recalcula slug único
    const newSlug = allocateUniqueSlug(name, partial.id);
    // remover slug antigo do mapa
    if (slug && slugs[slug] === partial.id) delete slugs[slug];
    slugs[newSlug] = partial.id;
    slug = newSlug;
  }

  const next = {
    id: partial.id,
    name,
    slug,
    bio: partial.bio ?? prev.bio ?? '',
    avatarUrl: partial.avatarUrl ?? prev.avatarUrl ?? '',
    bannerUrl: partial.bannerUrl ?? prev.bannerUrl ?? '',
    social: partial.social ?? prev.social ?? {},
    privacy: partial.privacy ?? prev.privacy ?? { showViews: true },
    createdAt: prev.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  profiles[partial.id] = next;
  safeWrite(PROFILE_KEY, profiles);
  safeWrite(SLUG_MAP_KEY, slugs);
  return next;
};

export const setSocialLinks = (userId, social) => {
  ensureVersion();
  const profiles = safeRead(PROFILE_KEY);
  if (!profiles[userId]) throw new Error('Perfil inexistente');
  const normalized = normalizeSocialLinks({ ...(profiles[userId].social || {}), ...(social || {}) });
  profiles[userId].social = normalized;
  profiles[userId].updatedAt = new Date().toISOString();
  safeWrite(PROFILE_KEY, profiles);
  return profiles[userId];
};

export const setPrivacyPrefs = (userId, privacy) => {
  ensureVersion();
  const profiles = safeRead(PROFILE_KEY);
  if (!profiles[userId]) throw new Error('Perfil inexistente');
  profiles[userId].privacy = { ...(profiles[userId].privacy || {}), ...(privacy || {}) };
  profiles[userId].updatedAt = new Date().toISOString();
  safeWrite(PROFILE_KEY, profiles);
  return profiles[userId];
};

// FOLLOW / FAVORITE
export const isFollowing = (viewerId, targetUserId) => {
  if (!viewerId || !targetUserId || viewerId === targetUserId) return false;
  const map = safeRead(FOLLOW_KEY);
  return !!(map[viewerId] && map[viewerId][targetUserId]);
};

export const follow = (viewerId, targetUserId) => {
  if (!viewerId || !targetUserId || viewerId === targetUserId) return false;
  const map = safeRead(FOLLOW_KEY);
  if (!map[viewerId]) map[viewerId] = {};
  map[viewerId][targetUserId] = Date.now();
  safeWrite(FOLLOW_KEY, map);
  return true;
};

export const unfollow = (viewerId, targetUserId) => {
  if (!viewerId || !targetUserId || viewerId === targetUserId) return false;
  const map = safeRead(FOLLOW_KEY);
  if (map[viewerId] && map[viewerId][targetUserId]) {
    delete map[viewerId][targetUserId];
    if (Object.keys(map[viewerId]).length === 0) delete map[viewerId];
    safeWrite(FOLLOW_KEY, map);
    return true;
  }
  return false;
};

export const getFollowersCount = (targetUserId) => {
  if (!targetUserId) return 0;
  const map = safeRead(FOLLOW_KEY);
  let count = 0;
  for (const viewerId of Object.keys(map)) {
    if (map[viewerId] && map[viewerId][targetUserId]) count += 1;
  }
  return count;
};

export const getFollowingCount = (viewerId) => {
  if (!viewerId) return 0;
  const map = safeRead(FOLLOW_KEY);
  return map[viewerId] ? Object.keys(map[viewerId]).length : 0;
};

// SOCIAL NORMALIZATION
const ensureHttp = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

export const normalizeSocialLinks = (social = {}) => {
  const out = {};
  const s = social || {};
  // website
  if (s.website) out.website = ensureHttp(String(s.website).trim());
  // twitter/x
  if (s.twitter) {
    const handle = String(s.twitter).trim();
    if (handle.startsWith('http')) out.twitter = ensureHttp(handle);
    else if (handle.startsWith('@')) out.twitter = `https://twitter.com/${handle.slice(1)}`;
    else out.twitter = `https://twitter.com/${handle}`;
  }
  if (s.x) {
    const handle = String(s.x).trim();
    if (handle.startsWith('http')) out.x = ensureHttp(handle);
    else if (handle.startsWith('@')) out.x = `https://x.com/${handle.slice(1)}`;
    else out.x = `https://x.com/${handle}`;
  }
  // discord
  if (s.discord) {
    const v = String(s.discord).trim();
    if (v.startsWith('http')) out.discord = ensureHttp(v);
    else out.discord = `https://discord.gg/${v}`;
  }
  // steam
  if (s.steam) {
    const v = String(s.steam).trim();
    if (v.startsWith('http')) out.steam = ensureHttp(v);
    else out.steam = `https://steamcommunity.com/id/${v}`;
  }
  // youtube
  if (s.youtube) {
    const v = String(s.youtube).trim();
    if (v.startsWith('http')) out.youtube = ensureHttp(v);
    else if (v.startsWith('@')) out.youtube = `https://youtube.com/${v}`;
    else out.youtube = `https://youtube.com/@${v}`;
  }
  // twitch
  if (s.twitch) {
    const v = String(s.twitch).trim();
    if (v.startsWith('http')) out.twitch = ensureHttp(v);
    else out.twitch = `https://twitch.tv/${v}`;
  }
  return out;
};

export default {
  getProfileByUserId,
  getUserIdBySlug,
  getProfileBySlug,
  upsertProfile,
  setSocialLinks,
  setPrivacyPrefs,
  isFollowing,
  follow,
  unfollow,
  getFollowersCount,
  getFollowingCount,
  normalizeSocialLinks,
};


