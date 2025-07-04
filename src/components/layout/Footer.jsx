import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaLock, 
  FaCheckCircle, 
  FaHome, 
  FaStore, 
  FaShoppingCart, 
  FaUser, 
  FaBoxes,
  FaFileAlt,
  FaShieldAlt as FaPrivacy,
  FaEnvelope,
  FaPhone,
  FaQuestionCircle,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaDiscord,
  FaGithub
} from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Mapa do Site */}
        <div className="footer-sitemap">
          <div className="footer-section">
            <h3 className="footer-section-title">Navegação</h3>
            <ul className="footer-links">
              <li><Link to="/"><FaHome /> Início</Link></li>
              <li><Link to="/marketplace"><FaStore /> Marketplace</Link></li>
              <li><Link to="/cart"><FaShoppingCart /> Carrinho</Link></li>
              <li><Link to="/inventory"><FaBoxes /> Inventário</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-section-title">Conta</h3>
            <ul className="footer-links">
              <li><Link to="/login"><FaUser /> Login</Link></li>
              <li><Link to="/register"><FaUser /> Cadastro</Link></li>
              <li><Link to="/profile"><FaUser /> Perfil</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-section-title">Legal</h3>
            <ul className="footer-links">
              <li><Link to="/terms"><FaFileAlt /> Termos de Uso</Link></li>
              <li><Link to="/privacy"><FaPrivacy /> Política de Privacidade</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-section-title">Suporte</h3>
            <ul className="footer-links">
              <li><a href="mailto:suporte@gameswap.com"><FaEnvelope /> Email</a></li>
              <li><a href="tel:+5511999999999"><FaPhone /> Telefone</a></li>
              <li><a href="#faq"><FaQuestionCircle /> FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="social-media-section">
          <h3 className="social-media-title">Siga-nos</h3>
          <div className="social-media-links">
            <a href="https://facebook.com/gameswap" target="_blank" rel="noopener noreferrer" className="social-link facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com/gameswap" target="_blank" rel="noopener noreferrer" className="social-link twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/gameswap" target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <AiFillInstagram />
            </a>
            <a href="https://youtube.com/gameswap" target="_blank" rel="noopener noreferrer" className="social-link youtube">
              <FaYoutube />
            </a>
            <a href="https://discord.gg/gameswap" target="_blank" rel="noopener noreferrer" className="social-link discord">
              <FaDiscord />
            </a>
            <a href="https://github.com/gusmfs/GameSwap" target="_blank" rel="noopener noreferrer" className="social-link github">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Informações de Segurança */}
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

        {/* Copyright */}
        <p className="copyright">
          &copy; 2025 GameSwap - Desenvolvido por Gustavo Medeiros, Michael Marotto, Davi Grabalos, Lívia Scoralick
        </p>
      </div>
    </footer>
  );
};

export default Footer; 