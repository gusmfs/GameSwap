// Serviço de métricas de perfil (localStorage)
// Foco: robustez, privacidade (opt-in/opt-out), dados enxutos, sem dependências.

const VIEWS_KEY = 'gsw_profile_views'; // { [userId]: Array<{ ts:number, ref:string, sid:string }> }
const PREFS_KEY = 'gsw_profile_tracking_prefs'; // { [userId]: { enabled:boolean } }
const BIO_KEY = 'gsw_profile_bios'; // { [userId]: string }

// Utilitários de persistência seguros
const safeRead = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error(`[metrics] Erro ao ler ${key}`, e);
    return {};
  }
};

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[metrics] Erro ao gravar ${key}`, e);
  }
};

// Sessão do navegador (para deduplicação de eventos em curto intervalo)
const getSessionId = () => {
  try {
    if (typeof sessionStorage === 'undefined') return 'no-session-storage';
    const KEY = 'gsw_session_id';
    let sid = sessionStorage.getItem(KEY);
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(KEY, sid);
    }
    return sid;
  } catch {
    return 'session-fallback';
  }
};

// Preferências de rastreamento (por usuário). Padrão: habilitado
export const isTrackingEnabled = (userId) => {
  if (!userId) return false;
  const prefs = safeRead(PREFS_KEY);
  const enabled = prefs[userId]?.enabled;
  return enabled === undefined ? true : !!enabled;
};

export const setTrackingEnabled = (userId, enabled) => {
  if (!userId) return;
  const prefs = safeRead(PREFS_KEY);
  prefs[userId] = { enabled: !!enabled };
  safeWrite(PREFS_KEY, prefs);
};

// Normaliza origem/referrer
const parseRef = (explicitRef) => {
  if (explicitRef) return String(explicitRef).toLowerCase();
  try {
    const ref = document?.referrer || '';
    if (!ref) return 'direct';
    const url = new URL(ref);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'direct';
  }
};

// Retém apenas últimos N dias para manter storage enxuto
const pruneOldVisits = (userId, keepDays = 365) => {
  if (!userId) return;
  const all = safeRead(VIEWS_KEY);
  const list = all[userId] || [];
  if (!Array.isArray(list) || list.length === 0) return;
  const now = Date.now();
  const cutoff = now - keepDays * 24 * 60 * 60 * 1000;
  const pruned = list.filter((e) => e && typeof e.ts === 'number' && e.ts >= cutoff);
  all[userId] = pruned;
  safeWrite(VIEWS_KEY, all);
};

// Chave de dia local (YYYY-MM-DD na TZ local)
const getDateKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Registra uma visita ao perfil
// options: { ref?:string, ts?:number, minIntervalMs?:number }
export const recordProfileVisit = (userId, options = {}) => {
  if (!userId) return false;
  if (!isTrackingEnabled(userId)) return false;

  const { ts = Date.now(), ref, minIntervalMs = 60_000 } = options;
  const all = safeRead(VIEWS_KEY);
  const list = Array.isArray(all[userId]) ? all[userId] : [];

  // Deduplicação simples: evita múltiplas contagens na mesma sessão/intervalo curto
  const sid = getSessionId();
  const last = list[list.length - 1];
  if (last && last.sid === sid && typeof last.ts === 'number' && (ts - last.ts) < minIntervalMs) {
    return false;
  }

  const entry = { ts, ref: parseRef(ref), sid };
  list.push(entry);
  all[userId] = list;
  safeWrite(VIEWS_KEY, all);
  pruneOldVisits(userId);
  return true;
};

// Série diária dos últimos N dias: [{ date: 'YYYY-MM-DD', count: number }]
export const getProfileViewsSeries = (userId, days = 14) => {
  if (!userId || days <= 0) return [];
  const all = safeRead(VIEWS_KEY);
  const list = Array.isArray(all[userId]) ? all[userId] : [];

  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - (days - 1) * dayMs);

  const buckets = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * dayMs);
    buckets[getDateKey(d)] = 0;
  }

  for (const e of list) {
    if (!e || typeof e.ts !== 'number') continue;
    const d = new Date(e.ts);
    d.setHours(0, 0, 0, 0);
    const key = getDateKey(d);
    if (key in buckets) buckets[key] += 1;
  }

  return Object.entries(buckets).map(([date, count]) => ({ date, count }));
};

export const getTotalProfileViews = (userId) => {
  if (!userId) return 0;
  const all = safeRead(VIEWS_KEY);
  const list = Array.isArray(all[userId]) ? all[userId] : [];
  return list.length;
};

// Breakdown por origem (top N)
export const getReferrerBreakdown = (userId, top = 5) => {
  if (!userId) return [];
  const all = safeRead(VIEWS_KEY);
  const list = Array.isArray(all[userId]) ? all[userId] : [];
  const counts = {};
  for (const e of list) {
    const key = e?.ref || 'direct';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([ref, count]) => ({ ref, count }));
};

// Última visita (timestamp) – útil para exibir "visto por último"
export const getLastVisitTs = (userId) => {
  if (!userId) return null;
  const all = safeRead(VIEWS_KEY);
  const list = Array.isArray(all[userId]) ? all[userId] : [];
  const last = list[list.length - 1];
  return last?.ts ?? null;
};

// Limpa todos os dados do usuário (caso desative rastreamento)
export const clearUserMetrics = (userId) => {
  if (!userId) return;
  const all = safeRead(VIEWS_KEY);
  if (all[userId]) {
    delete all[userId];
    safeWrite(VIEWS_KEY, all);
  }
};

// Bio (texto curto por usuário)
export const getBio = (userId) => {
  if (!userId) return '';
  const all = safeRead(BIO_KEY);
  return all[userId] || '';
};

export const updateBio = (userId, bio) => {
  if (!userId) return '';
  const all = safeRead(BIO_KEY);
  all[userId] = bio || '';
  safeWrite(BIO_KEY, all);
  return all[userId];
};

// Export util para testes/depuração controlada (não usar na UI)
export const __debug = {
  _readAll: () => safeRead(VIEWS_KEY),
  _writeAll: (data) => safeWrite(VIEWS_KEY, data),
};

export default {
  recordProfileVisit,
  getProfileViewsSeries,
  getTotalProfileViews,
  getReferrerBreakdown,
  getLastVisitTs,
  isTrackingEnabled,
  setTrackingEnabled,
  clearUserMetrics,
  getBio,
  updateBio,
};


