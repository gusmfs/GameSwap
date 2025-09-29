import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const ResetPassword = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Redefinir senha</h1>
          <p className="auth-subtitle">Informe seu email para receber um link de redefinição.</p>
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="rp-email">Email</label>
              <input id="rp-email" type="email" placeholder="Seu email" />
            </div>
            <button type="submit" className="submit-button">Enviar link</button>
          </form>
          <div className="auth-links" style={{ marginTop: '1rem' }}>
            <Link to="/login" className="auth-link">Voltar ao login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


