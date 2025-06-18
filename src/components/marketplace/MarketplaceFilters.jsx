import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { fetchRarities, fetchWeapons, fetchWears } from '../../services/skinsApi';
import './MarketplaceFilters.css';

const MarketplaceFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [rarities, setRarities] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [wears, setWears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [raritiesData, weaponsData, wearsData] = await Promise.all([
          fetchRarities(),
          fetchWeapons(),
          fetchWears()
        ]);
        
        setRarities(raritiesData);
        setWeapons(weaponsData);
        setWears(wearsData);
      } catch (error) {
        console.error('Erro ao carregar opções de filtro:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value === '' ? null : value
    });
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== null && value !== '');
  };

  return (
    <div className="marketplace-filters">
      <div className="filters-header">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar skins..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="clear-search"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        <div className="filter-actions">
          <button
            onClick={toggleFilters}
            className={`filter-toggle ${isFiltersOpen ? 'active' : ''}`}
          >
            <FaFilter />
            Filtros
            {hasActiveFilters() && <span className="filter-count">●</span>}
          </button>

          {hasActiveFilters() && (
            <button
              onClick={onClearFilters}
              className="clear-filters"
            >
              <FaTimes />
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className={`filters-panel ${isFiltersOpen ? 'open' : ''}`}>
        {loading ? (
          <div className="loading">Carregando filtros...</div>
        ) : (
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="sortBy">Ordenar por:</label>
              <select
                id="sortBy"
                value={filters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="">Padrão</option>
                <option value="price_asc">Preço: Menor para Maior</option>
                <option value="price_desc">Preço: Maior para Menor</option>
                <option value="name_asc">Nome: A-Z</option>
                <option value="name_desc">Nome: Z-A</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="rarity">Raridade:</label>
              <select
                id="rarity"
                value={filters.rarity || ''}
                onChange={(e) => handleFilterChange('rarity', e.target.value)}
                className="filter-select"
              >
                <option value="">Todas as Raridades</option>
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="weapon">Arma:</label>
              <select
                id="weapon"
                value={filters.weapon || ''}
                onChange={(e) => handleFilterChange('weapon', e.target.value)}
                className="filter-select"
              >
                <option value="">Todas as Armas</option>
                {weapons.map(weapon => (
                  <option key={weapon} value={weapon}>{weapon}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="wear">Desgaste:</label>
              <select
                id="wear"
                value={filters.wear || ''}
                onChange={(e) => handleFilterChange('wear', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos os Desgastes</option>
                {wears.map(wear => (
                  <option key={wear} value={wear}>{wear}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="type">Tipo:</label>
              <select
                id="type"
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos os Tipos</option>
                <option value="Normal">Normal</option>
                <option value="StatTrak">StatTrak™</option>
                <option value="Souvenir">Souvenir</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceFilters; 