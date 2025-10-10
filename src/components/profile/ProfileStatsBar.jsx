import React, { useMemo } from 'react';
import { getTotalProfileViews } from '../../services/profileMetrics';
import userProfileService from '../../services/userProfileService';

// Dados mockados temporários (até termos backend)
const MOCK_STATS = {
  transactions: 4,
  inventory: 4,
  views: 237,
  followers: 3,
};

const ProfileStatsBar = ({ userId, user }) => {
  const stats = useMemo(() => {
    // TEMPORÁRIO: Usa dados mockados até termos backend
    return [
      { key: 'transactions', label: 'Transações', value: MOCK_STATS.transactions },
      { key: 'inventory', label: 'Itens', value: MOCK_STATS.inventory },
      { key: 'views', label: 'Visualizações', value: MOCK_STATS.views },
      { key: 'followers', label: 'Seguidores', value: MOCK_STATS.followers },
    ];

    /* Lógica real (descomentará quando tiver backend):
    const transactions = Array.isArray(user?.transactions) ? user.transactions.length : 0;
    const inventory = Array.isArray(user?.inventory) ? user.inventory.length : 0;
    const views = getTotalProfileViews(userId);
    const followers = userProfileService.getFollowersCount?.(userId) || 0;
    return [
      { key: 'transactions', label: 'Transações', value: transactions },
      { key: 'inventory', label: 'Itens', value: inventory },
      { key: 'views', label: 'Visualizações', value: views },
      { key: 'followers', label: 'Seguidores', value: followers },
    ];
    */
  }, []);

  return (
    <div className="stats-bar" role="group" aria-label="Indicadores do perfil">
      {stats.map((s) => (
        <div key={s.key} className="stat-pill">
          <span className="stat-pill-value">{s.value}</span>
          <span className="stat-pill-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProfileStatsBar;


