import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShieldAlt, FaBolt, FaCoins } from 'react-icons/fa';
import './Home.css';
import banner1 from '../../assets/Images/Banner1.png'
import banner2 from '../../assets/Images/Banner2.png'
import banner3 from '../../assets/Images/Banner3.png'
import gif from '../../assets/Images/IntelPannel.gif'


function Home() {
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
}

export default Home; 