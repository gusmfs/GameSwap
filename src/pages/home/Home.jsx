import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShieldAlt, FaBolt, FaCoins } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <main className="home">
      <div className="home-content">
        <div className="title-container">
          <h1 className="animated-title" data-text="GameSwap">GameSwap</h1>
          <p className="tagline">
            A maior plataforma de troca e venda de skins de Counter-Strike 2 do Brasil 
            com tecnologia de ponta e segurança garantida para suas transações.
          </p>
        </div>

        <div className="cta-buttons">
          <Link to="/marketplace" className="cta-button primary-cta">
            <FaStore />
            Explorar Marketplace
          </Link>
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
      </div>
    </main>
  );
};

export default Home; 