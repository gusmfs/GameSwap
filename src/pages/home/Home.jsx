import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShieldAlt, FaBolt, FaCoins } from 'react-icons/fa';
import './Home.css';
import banner1 from '../../assets/Images/Banner1.png'
import banner2 from '../../assets/Images/Banner2.png'
import banner3 from '../../assets/Images/Banner3.png'
import gif from '../../assets/Images/IntelPannel.gif'
import { fetchSkins } from '../../services/skinsApi.js';
import SkinCard from '../../components/marketplace/SkinCard.jsx';


function Home() {
  const [featuredSkins, setFeaturedSkins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedSkins = async () => {
      try {
        setLoading(true);
        const skins = await fetchSkins();
        // Pegar as primeiras 12 skins para o slider
        const featured = skins.slice(0, 12);
        setFeaturedSkins(featured);
      } catch (error) {
        console.error('Erro ao carregar skins em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedSkins();
  }, []);

  return (
    <main className="home">

      <div className="home-content">

      <section className="container">
        <div className="slider-wrapper">
           <div className="slider">
            <div className="slide-item" style={{'--bg-image': `url(${banner1})`}}>
              <img id="slide1" src={banner1} alt="Banner 1" />
            </div>
            <div className="slide-item" style={{'--bg-image': `url(${banner2})`}}>
              <img id="slide2" src={banner2} alt="Banner 2" />
            </div>
            <div className="slide-item" style={{'--bg-image': `url(${banner3})`}}>
              <img id="slide3" src={banner3} alt="Banner 3" />
            </div>
          </div>
        </div>

        <div className="slider-nav">
          <a href="slide1"></a>
          <a href="slide2"></a>
          <a href="slide3/"></a>
        </div>
      </section>

      <div className="intelpannel">
        <div className="intelpannel-text">
        <h1 className="section-title">Compra e venda Skins Instantâneamente!</h1>
        <p>
        Compra, venda ou troque suas Skins de CS2 instantaneamente na GameSwap.
        <strong> Sem Taxas, Sem Estresse, Sem Perigo.</strong></p>
        <p>Ofertas imperdíveis, preços justos, e transações rápidas — Feito para jogadores que levam suas skins a outro nível.</p>
        <div className="cta-button">
          <Link to="/marketplace" className="cta-button primary-cta">
            <FaStore />
            Explorar Marketplace
          </Link>
        </div>
        </div>
        <div className="intelpannel-img">
          <img src={gif} alt="Intel Pannel Gif" />
        </div>

      </div>

      <div className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Junte-se à Maior Comunidade de Gamers!</h2>
            <p className="cta-description">
              Conecte-se com milhares de jogadores, descubra ofertas exclusivas e faça parte de uma comunidade que entende a paixão pelos games. 
              <strong> Sua próxima skin favorita está esperando por você!</strong>
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button secondary-cta">
                <FaCoins />
                Criar Conta Grátis
              </Link>
              <Link to="/marketplace" className="cta-button primary-cta">
                <FaStore />
                Ver Ofertas
              </Link>
            </div>
          </div>
        </div>
      </div>

        <section className="features-section">
          <h2 className="section-title">Por que escolher a GameSwap?</h2>
          <div className="features-grid">
            <div className="feature-card transition-hover">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3 className="feature-title">Segurança Garantida</h3>
              <p className="feature-description">
                Todas as transações são protegidas por criptografia avançada e sistema
                anti-fraude para garantir a segurança dos seus itens e pagamentos.
              </p>
            </div>

            <div className="feature-card transition-hover">
              <div className="feature-icon">
                <FaBolt />
              </div>
              <h3 className="feature-title">Transações Rápidas</h3>
              <p className="feature-description">
                Nossa plataforma permite trocas e vendas instantâneas, com entrega
                garantida e sistema de verificação em tempo real.
              </p>
            </div>

            <div className="feature-card transition-hover">
              <div className="feature-icon">
                <FaCoins />
              </div>
              <h3 className="feature-title">Melhores Preços</h3>
              <p className="feature-description">
                Compare preços entre milhares de vendedores verificados e garanta o
                melhor negócio para suas skins com taxas reduzidas.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Skins Section */}
        <section className="featured-section">
          <div className="featured-container">
            <h2 className="featured-title">Skins em Destaque</h2>
            <p className="featured-subtitle">Descubra as melhores ofertas do momento</p>
            
            {loading ? (
              <div className="featured-loading">
                <div className="loading-spinner"></div>
                <p>Carregando skins...</p>
              </div>
            ) : (
              <div className="featured-slider">
                <div className="featured-track">
                  {featuredSkins.map((skin, index) => (
                    <div key={`${skin.id || index}-${index}`} className="featured-card-wrapper">
                      <SkinCard skin={skin} />
                    </div>
                  ))}
                  {/* Duplicar as skins para loop infinito */}
                  {featuredSkins.map((skin, index) => (
                    <div key={`${skin.id || index}-duplicate-${index}`} className="featured-card-wrapper">
                      <SkinCard skin={skin} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="featured-cta">
              <Link to="/marketplace" className="featured-button">
                <FaStore />
                Ver Todas as Skins
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home; 