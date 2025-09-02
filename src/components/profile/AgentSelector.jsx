  import React, { useState, useEffect } from 'react';
import { FaSpinner, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { fetchAgentsByFilter, fetchFactions, fetchAgentRarities } from '../../services/skinsApi';
import './AgentSelector.css';

const AgentSelector = ({ onAgentSelect, selectedAgent = null, onClose }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    faction: '',
    rarity: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [factions, setFactions] = useState([]);
  const [rarities, setRarities] = useState([]);

  useEffect(() => {
    loadAgents();
    loadFilterOptions();
  }, [filters]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const agentsData = await fetchAgentsByFilter(filters);
      setAgents(agentsData);
    } catch (err) {
      setError('Erro ao carregar agentes. Tente novamente.');
      console.error('Erro ao carregar agentes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const [factionsData, raritiesData] = await Promise.all([
        fetchFactions(),
        fetchAgentRarities()
      ]);
      setFactions(factionsData);
      setRarities(raritiesData);
    } catch (err) {
      console.error('Erro ao carregar opções de filtro:', err);
    }
  };

  const handleAgentClick = (agent) => {
    onAgentSelect(agent);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      faction: '',
      rarity: ''
    });
  };

  const hasActiveFilters = filters.search || filters.faction || filters.rarity;

  return (
    <div className="agent-selector-overlay">
      <div className="agent-selector-modal">
        <div className="agent-selector-header">
          <h2>Selecionar Agente CS2</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="agent-selector-search">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar agentes..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="search-input"
            />
          </div>
          
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="agent-filters">
            <div className="filter-group">
              <label>Facção:</label>
              <select
                value={filters.faction}
                onChange={(e) => setFilters(prev => ({ ...prev, faction: e.target.value }))}
              >
                <option value="">Todas</option>
                {factions.map(faction => (
                  <option key={faction} value={faction}>{faction}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Raridade:</label>
              <select
                value={filters.rarity}
                onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
              >
                <option value="">Todas</option>
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                <FaTimes />
                Limpar Filtros
              </button>
            )}
          </div>
        )}

        <div className="agent-selector-content">
          {loading ? (
            <div className="loading-container">
              <FaSpinner className="spinner" />
              <p>Carregando agentes...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={loadAgents}>Tentar Novamente</button>
            </div>
          ) : agents.length === 0 ? (
            <div className="empty-container">
              <p>Nenhum agente encontrado.</p>
            </div>
          ) : (
            <div className="agents-grid">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={`agent-card ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                  onClick={() => handleAgentClick(agent)}
                >
                  <div className="agent-image">
                    <img src={agent.image} alt={agent.name} />
                    <div className="agent-rarity" data-rarity={agent.rarity?.name?.toLowerCase()}>
                      {agent.rarity?.name}
                    </div>
                  </div>
                  <div className="agent-info">
                    <h3>{agent.name}</h3>
                    <p className="agent-faction">{agent.faction}</p>
                    <p className="agent-price">R$ {agent.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentSelector; 