import React, { useMemo, useState } from 'react';
import { FaLeaf, FaBolt, FaHands } from 'react-icons/fa';
import '../home/Home.css';
import './Acessibilidade.css';
import { useTheme } from '../../providers/ThemeProvider.jsx';

const Acessibilidade = () => {
  const [usuarios, setUsuarios] = useState('100');
  const { theme, toggleTheme } = useTheme();
  const consumoKwh = useMemo(() => {
    const n = Number(usuarios);
    if (Number.isNaN(n) || n < 0) return 0;
    return Math.round(n * 0.05 * 100) / 100;
  }, [usuarios]);

  const celulares = useMemo(() => Math.round(consumoKwh * 50), [consumoKwh]);

  return (
    <main className="home">
      <div className="home-content">
        <div style={{ position: 'relative' }}>
          <button
            onClick={toggleTheme}
            className="cta-button"
            style={{ position: 'absolute', right: 0, top: -8, padding: '0.5rem 0.75rem' }}
            aria-label="Alternar modo noturno/diurno"
            title={theme === 'dark' ? '☀️ Diurno' : '🌙 Noturno'}
          >
            {theme === 'dark' ? '☀️ Diurno' : '🌙 Noturno'}
          </button>
        </div>
        <div className="title-container">
          <h1 className="animated-title" data-text="GameSwap">GameSwap</h1>
          <div className="cta-buttons" style={{ marginBottom: '2rem' }}>
            {/* mantém espaçamento como na home até o botão principal */}
          </div>
          <h2 className="section-title" style={{ marginTop: 0 }}>Acessibilidade e ESG</h2>
          <p className="tagline" style={{ marginTop: '1rem' }}>
            Compromisso com inclusão, transparência e sustentabilidade.
          </p>
        </div>

        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card transition-hover">
              <div className="feature-icon">
                {/* sem ícone no título, mas mantemos ícone decorativo na seção */}
                <FaHands />
              </div>
              <h3 className="feature-title">Integração com VLibras</h3>
              <p className="feature-description">
                Nosso site conta com o VLibras, garantindo que pessoas surdas possam navegar e
                interagir com o conteúdo em Libras. O VLibras é um plugin gratuito que traduz
                conteúdos digitais para a Língua Brasileira de Sinais, promovendo acessibilidade.
              </p>
            </div>

            <div className="feature-card transition-hover">
              <div className="feature-icon">
                <FaLeaf />
              </div>
              <h3 className="feature-title">Impacto Ambiental dos Servidores</h3>
              <p className="feature-description">
                Data centers que hospedam jogos e marketplaces digitais consomem grandes quantidades de energia elétrica.
                Esse consumo está diretamente ligado à emissão de CO₂ e ao impacto ambiental global. Segundo relatórios
                internacionais, data centers representam cerca de 1% a 1,5% do consumo mundial de energia elétrica.
                Projetos digitais sustentáveis devem considerar eficiência energética, fontes renováveis e otimizações.
              </p>
            </div>

            <div className="feature-card transition-hover">
              <div className="feature-icon">
                <FaBolt />
              </div>
              <h3 className="feature-title">Simulação de Consumo Energético</h3>
              <p className="feature-description">
                Estime o consumo com base em usuários simultâneos.
              </p>
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="usuarios-ativos" style={{ display: 'block', marginBottom: 8 }}>Quantos usuários ativos simultaneamente?</label>
                <input
                  id="usuarios-ativos"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={usuarios}
                  onChange={(e) => setUsuarios(e.target.value)}
                  placeholder="Ex: 100"
                  className="feedback-field-input"
                  style={{ padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                />
                <p className="feature-description" style={{ marginTop: 12 }}>
                  Com {Number(usuarios) || 0} usuários ativos, o consumo estimado seria de <strong>{consumoKwh} kWh</strong>,
                  equivalente a carregar aproximadamente <strong>{celulares} celulares</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Acessibilidade;


