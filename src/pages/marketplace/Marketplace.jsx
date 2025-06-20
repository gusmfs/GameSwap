import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import MarketplaceFilters from '../../components/marketplace/MarketplaceFilters';
import SkinCard from '../../components/marketplace/SkinCard';
import { fetchSkinsByFilter } from '../../services/skinsApi';
import './Marketplace.css';

const Marketplace = () => {
  //O estado skins é um array de skins, que é atualizado com os dados da API
  const [skins , setSkins] = useState([]);
  //O estado loading é um booleano que indica se a página está carregando para usar o FaSpinner (Animacao de carregamento)
  const [loading, setLoading] = useState(true);
  //O estado error é uma string que indica se houve um erro ao carregar os dados para usar o FaExclamationTriangle (Animacao de erro)
  const [error, setError] = useState(null);
  //O estado filters é um objeto que contém os filtros selecionados pelo usuário para usar o MarketplaceFilters
  const [filters, setFilters] = useState({
    search: null,
    rarity: null,
    weapon: null,
    wear: null,
    type: null,
    sortBy: null
  });
  //O estado currentPage é um número que indica a página atual para usar a paginação
  const [currentPage, setCurrentPage] = useState(1);
  //O estado itemsPerPage é um número que indica a quantidade de itens por página para usar a paginação
  const [itemsPerPage] = useState(12);

  //O useEffect é um hook que é executado quando o componente é montado ou quando o estado filters é alterado
  useEffect(() => {
    loadSkins();
  }, [filters]);

  //O loadSkins é uma função assíncrona que carrega as skins com base nos filtros selecionados
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
  //O handleFiltersChange é uma função que atualiza o estado filters com os novos filtros selecionados o newFilters é passado como parametro para atualizar o estado filters
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
      <div className="animated-background">
        <div className="blur-circle circle1"></div>
        <div className="blur-circle circle2"></div>
        <div className="blur-circle circle3"></div>
        <div className="blur-circle circle4"></div>
      </div>
      <div className="marketplace-container">
        <div className="marketplace-header">
          <h1 className="marketplace-title">
            Marketplace CS2
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