import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import SkinCard from '../components/marketplace/SkinCard';
import { fetchSkinsByFilter } from '../services/skinsApi';
import './Marketplace.css';

const Marketplace = () => {
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: null,
    rarity: null,
    weapon: null,
    wear: null,
    type: null,
    sortBy: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    loadSkins();
  }, [filters]);

  const loadSkins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSkinsByFilter(filters);
      setSkins(data);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (err) {
      setError('Erro ao carregar skins. Tente novamente.');
      console.error('Erro ao carregar skins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: null,
      rarity: null,
      weapon: null,
      wear: null,
      type: null,
      sortBy: null
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSkins = skins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(skins.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <main className="marketplace">
      <div className="marketplace-container">
        <div className="marketplace-header">
          <h1 className="marketplace-title">
            Marketplace de Skins CS2
          </h1>
          <p className="marketplace-subtitle">
            Descubra e adquira as melhores skins do Counter-Strike 2
          </p>
        </div>

        <MarketplaceFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        <div className="marketplace-content">
          {loading ? (
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <p>Carregando skins...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <FaExclamationTriangle className="error-icon" />
              <h3>Ops! Algo deu errado</h3>
              <p>{error}</p>
              <button onClick={loadSkins} className="retry-button">
                Tentar Novamente
              </button>
            </div>
          ) : skins.length === 0 ? (
            <div className="no-results">
              <h3>Nenhuma skin encontrada</h3>
              <p>Tente ajustar os filtros para encontrar mais resultados.</p>
              <button onClick={handleClearFilters} className="clear-filters-button">
                Limpar Filtros
              </button>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>
                  Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, skins.length)} de {skins.length} skins
                </p>
              </div>

              <div className="skins-grid">
                {currentSkins.map((skin) => (
                  <SkinCard
                    key={`${skin.id}_${skin.wear?.name || 'default'}_${skin.stattrak ? 'st' : ''}${skin.souvenir ? 'sv' : ''}`}
                    skin={skin}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    Anterior
                  </button>

                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Marketplace; 