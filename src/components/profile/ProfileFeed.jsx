import React, { useMemo, useState } from 'react';
import { FaExchangeAlt, FaBoxOpen, FaUserPlus, FaTrophy } from 'react-icons/fa';
import FeedDetailModal from './FeedDetailModal';

// Dados mockados para demonstração
const MOCK_ACTIVITIES = [
  { type: 'tx', subtype: 'sale', ts: Date.now() - 1000 * 60 * 30, text: 'Concluiu uma transação: Venda de Skin AWP Dragon Lore' },
  { type: 'follower', ts: Date.now() - 1000 * 60 * 60, text: 'Nova conexão: @player_pro começou a seguir você' },
  { type: 'inv', ts: Date.now() - 1000 * 60 * 60 * 2, text: 'Adicionou um item ao inventário: M4A4 | Howl' },
  { type: 'achievement', ts: Date.now() - 1000 * 60 * 60 * 4, text: 'Conquista desbloqueada: Negociador Experiente 🏆' },
  { type: 'tx', subtype: 'purchase', ts: Date.now() - 1000 * 60 * 60 * 5, text: 'Concluiu uma transação: Compra de Knife Karambit Fade' },
  { type: 'follower', ts: Date.now() - 1000 * 60 * 60 * 12, text: 'Nova conexão: @skin_trader seguiu você' },
  { type: 'inv', ts: Date.now() - 1000 * 60 * 60 * 24, text: 'Adicionou um item ao inventário: AK-47 | Redline' },
  { type: 'achievement', ts: Date.now() - 1000 * 60 * 60 * 24 * 1.5, text: 'Conquista desbloqueada: Colecionador 📦' },
  { type: 'tx', subtype: 'trade', ts: Date.now() - 1000 * 60 * 60 * 24 * 2, text: 'Trocou skins com @skin_master', tradeWith: '@skin_master', tradedItem: 'M4A1-S | Hyper Beast', receivedItem: 'AWP | Asiimov' },
  { type: 'follower', ts: Date.now() - 1000 * 60 * 60 * 24 * 2.5, text: 'Nova conexão: @gamer_xp começou a seguir você' },
  { type: 'inv', ts: Date.now() - 1000 * 60 * 60 * 24 * 3, text: 'Adicionou um item ao inventário: Desert Eagle | Blaze' },
  { type: 'achievement', ts: Date.now() - 1000 * 60 * 60 * 24 * 4, text: 'Conquista desbloqueada: Primeira Venda 💰' },
  { type: 'tx', subtype: 'sale', ts: Date.now() - 1000 * 60 * 60 * 24 * 5, text: 'Concluiu uma transação: Venda de Glock-18 Fade' },
];

// Feed simples derivado de transações e inventário disponíveis no objeto user
// Em versões futuras, podemos unificar com métricas e eventos sociais persistidos
const ProfileFeed = ({ user }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const items = useMemo(() => {
    // TEMPORÁRIO: Usa sempre dados mockados até termos backend
    return MOCK_ACTIVITIES;
    
    /* Lógica real (descomentará quando tiver backend):
    const out = [];
    const txs = Array.isArray(user?.transactions) ? user.transactions : [];
    const inv = Array.isArray(user?.inventory) ? user.inventory : [];

    if (txs.length === 0 && inv.length === 0) {
      return MOCK_ACTIVITIES;
    }

    for (const t of txs.slice(-5).reverse()) {
      out.push({ type: 'tx', ts: t?.createdAt || Date.now(), text: `Concluiu uma transação: ${t?.id || '—'}` });
    }
    for (const i of inv.slice(-5).reverse()) {
      out.push({ type: 'inv', ts: i?.addedAt || Date.now(), text: `Adicionou um item ao inventário: ${i?.name || 'Item'}` });
    }
    return out.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    */
  }, []);

  if (items.length === 0) {
    return (
      <div className="feed-empty">
        <p className="muted">Sem atividades recentes. Assim que você realizar ações, elas aparecerão aqui.</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'tx':
        return <FaExchangeAlt className="feed-icon" />;
      case 'inv':
        return <FaBoxOpen className="feed-icon" />;
      case 'follower':
        return <FaUserPlus className="feed-icon" />;
      case 'achievement':
        return <FaTrophy className="feed-icon" />;
      default:
        return <FaBoxOpen className="feed-icon" />;
    }
  };

  return (
    <>
      <ul className="feed-list" aria-label="Atividades do usuário">
        {items.map((it, idx) => (
          <li 
            key={idx} 
            className={`feed-item feed-item-${it.type}`}
            onClick={() => setSelectedItem(it)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedItem(it);
              }
            }}
          >
            <div className={`feed-icon-wrapper feed-icon-${it.type}`}>
              {getIcon(it.type)}
            </div>
            <div className="feed-content">{it.text}</div>
          </li>
        ))}
      </ul>
      
      <FeedDetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </>
  );
};

export default ProfileFeed;


