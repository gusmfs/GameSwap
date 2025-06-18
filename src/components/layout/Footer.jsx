import React from 'react';
import { FaShieldAlt, FaLock, FaCheckCircle } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="security-info">
          <div className="ssl-badge">
            <FaLock />
            <span>SSL Seguro</span>
          </div>
          <div className="security-details">
            <p><FaShieldAlt /> Transações Criptografadas</p>
            <p><FaCheckCircle /> Verificação em Duas Etapas</p>
          </div>
        </div>
        <p className="copyright">
          &copy; 2025 GameSwap - Marketplace de Skins CS2 - Projeto Acadêmico
        </p>
      </div>
    </footer>
  );
};

export default Footer; 