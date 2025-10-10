// Dados mockados de usuários para demonstração
// Avatares de agentes CS2 (placeholder aleatórios enquanto não temos imagens reais)
const CS2_AGENTS = {
  1: 'https://ui-avatars.com/api/?name=Skin+Master&size=200&background=4a90e2&color=fff&bold=true',
  2: 'https://ui-avatars.com/api/?name=Player+Pro&size=200&background=0099ff&color=fff&bold=true',
  3: 'https://ui-avatars.com/api/?name=Skin+Trader&size=200&background=00d4ff&color=fff&bold=true',
  4: 'https://ui-avatars.com/api/?name=Gamer+XP&size=200&background=64c8ff&color=fff&bold=true',
  5: 'https://ui-avatars.com/api/?name=CS2+Agent&size=200&background=357abd&color=fff&bold=true',
};

export const MOCK_USERS = {
  '@skin_master': {
    id: 'user_001',
    username: '@skin_master',
    displayName: 'Skin Master',
    avatarUrl: CS2_AGENTS[1],
    bio: 'Colecionador de skins raras de CS2. Especialista em negociações justas e rápidas. Sempre busco trades equilibrados! 🎯',
    memberSince: '2023-03-15',
    stats: {
      transactions: 47,
      inventory: 23,
      followers: 156,
      following: 89,
      rating: 4.8,
    },
    recentActivity: [
      { type: 'tx', text: 'Vendeu AWP | Dragon Lore FN', ts: Date.now() - 1000 * 60 * 60 * 3 },
      { type: 'achievement', text: 'Conquista: Negociador Master 🏆', ts: Date.now() - 1000 * 60 * 60 * 24 },
      { type: 'tx', text: 'Trocou com @player_pro', ts: Date.now() - 1000 * 60 * 60 * 24 * 2 },
    ],
    topItems: [
      { name: 'Karambit | Fade', rarity: 'Covert', value: 2500 },
      { name: 'AWP | Dragon Lore', rarity: 'Covert', value: 3800 },
      { name: 'M4A4 | Howl', rarity: 'Contraband', value: 4200 },
    ],
  },
  '@player_pro': {
    id: 'user_002',
    username: '@player_pro',
    displayName: 'Player Pro',
    avatarUrl: CS2_AGENTS[2],
    bio: 'Pro player e trader. Sempre em busca das melhores skins para minha coleção. Trades justos e confiáveis! ⚡',
    memberSince: '2023-01-20',
    stats: {
      transactions: 89,
      inventory: 45,
      followers: 234,
      following: 67,
      rating: 4.9,
    },
    recentActivity: [
      { type: 'inv', text: 'Adicionou Butterfly Knife | Tiger Tooth', ts: Date.now() - 1000 * 60 * 45 },
      { type: 'tx', text: 'Comprou AK-47 | Fire Serpent', ts: Date.now() - 1000 * 60 * 60 * 12 },
      { type: 'achievement', text: 'Conquista: Colecionador Elite 📦', ts: Date.now() - 1000 * 60 * 60 * 24 * 3 },
    ],
    topItems: [
      { name: 'Butterfly Knife | Doppler', rarity: 'Covert', value: 1800 },
      { name: 'AK-47 | Fire Serpent', rarity: 'Classified', value: 2200 },
      { name: 'Glock-18 | Fade', rarity: 'Restricted', value: 800 },
    ],
  },
  '@skin_trader': {
    id: 'user_003',
    username: '@skin_trader',
    displayName: 'Skin Trader',
    avatarUrl: CS2_AGENTS[3],
    bio: 'Trader profissional há 3 anos. Especializado em facas e luvas. Negocie comigo! 🔪',
    memberSince: '2022-08-10',
    stats: {
      transactions: 132,
      inventory: 67,
      followers: 301,
      following: 112,
      rating: 4.7,
    },
    recentActivity: [
      { type: 'tx', text: 'Vendeu Sport Gloves | Pandora\'s Box', ts: Date.now() - 1000 * 60 * 60 * 6 },
      { type: 'tx', text: 'Trocou com @gamer_xp', ts: Date.now() - 1000 * 60 * 60 * 24 },
      { type: 'inv', text: 'Adicionou Talon Knife | Slaughter', ts: Date.now() - 1000 * 60 * 60 * 24 * 2 },
    ],
    topItems: [
      { name: 'Talon Knife | Gamma Doppler', rarity: 'Covert', value: 3100 },
      { name: 'Sport Gloves | Vice', rarity: 'Extraordinary', value: 2800 },
      { name: 'Karambit | Slaughter', rarity: 'Covert', value: 1900 },
    ],
  },
  '@gamer_xp': {
    id: 'user_004',
    username: '@gamer_xp',
    displayName: 'Gamer XP',
    avatarUrl: CS2_AGENTS[4],
    bio: 'Amante de skins coloridas e facas raras. Sempre disposto a fazer bons negócios! 🎮',
    memberSince: '2023-06-05',
    stats: {
      transactions: 34,
      inventory: 28,
      followers: 98,
      following: 145,
      rating: 4.6,
    },
    recentActivity: [
      { type: 'inv', text: 'Adicionou M4A1-S | Hyper Beast', ts: Date.now() - 1000 * 60 * 60 * 2 },
      { type: 'tx', text: 'Comprou Desert Eagle | Blaze', ts: Date.now() - 1000 * 60 * 60 * 18 },
      { type: 'achievement', text: 'Conquista: Primeira Venda 💰', ts: Date.now() - 1000 * 60 * 60 * 24 * 5 },
    ],
    topItems: [
      { name: 'Ursus Knife | Fade', rarity: 'Covert', value: 1400 },
      { name: 'M4A1-S | Hyper Beast', rarity: 'Classified', value: 450 },
      { name: 'Desert Eagle | Blaze', rarity: 'Restricted', value: 680 },
    ],
  },
};

export const getUserByUsername = (username) => {
  // Remove @ se vier com
  const cleanUsername = username.startsWith('@') ? username : `@${username}`;
  return MOCK_USERS[cleanUsername] || null;
};

export default MOCK_USERS;

