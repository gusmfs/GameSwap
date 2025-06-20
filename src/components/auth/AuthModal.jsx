import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleRegister = () => {
    navigate('/register');
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="auth-modal-content">
          <h2>Área Restrita</h2>
          <p>Para acessar esta área, você precisa estar conectado à sua conta GameSwap</p>
          
          <div className="auth-buttons">
            <button className="auth-button login-button" onClick={handleLogin}>
              <span className="button-text">Entrar</span>
              <div className="button-glow"></div>
            </button>
            
            <button className="auth-button register-button" onClick={handleRegister}>
              <span className="button-text">Cadastrar</span>
              <div className="button-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 