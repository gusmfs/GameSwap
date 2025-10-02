import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import authService from '../../services/authService';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [ageValidation, setAgeValidation] = useState({ isValid: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validação de idade em tempo real
    if (name === 'birthDate' && value) {
      const age = calculateAge(value);
      if (age < 18) {
        setAgeValidation({ isValid: false, message: `Idade: ${age} anos - Você deve ter pelo menos 18 anos` });
      } else if (age > 120) {
        setAgeValidation({ isValid: false, message: 'Data de nascimento inválida' });
      } else {
        setAgeValidation({ isValid: true, message: `Idade: ${age} anos` });
      }
    } else if (name === 'birthDate' && !value) {
      setAgeValidation({ isValid: null, message: '' });
    }
  };

  // Função para calcular idade baseada na data de nascimento
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Função para validar nome
  const validateName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return 'Nome deve ter pelo menos 2 caracteres';
    }
    if (trimmedName.length > 50) {
      return 'Nome deve ter no máximo 50 caracteres';
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
      return 'Nome deve conter apenas letras e espaços';
    }
    return null;
  };

  // Função para validar data de nascimento
  const validateBirthDate = (birthDate) => {
    if (!birthDate) {
      return 'Data de nascimento é obrigatória';
    }
    
    const age = calculateAge(birthDate);
    if (age < 18) {
      return 'Você deve ter pelo menos 18 anos para se cadastrar';
    }
    if (age > 120) {
      return 'Data de nascimento inválida';
    }
    
    return null;
  };

  const validateForm = () => {
    // Validação de campos obrigatórios
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.birthDate) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    // Validação de aceite dos termos
    if (!formData.acceptTerms) {
      setError('Você deve aceitar os termos de uso para continuar');
      return false;
    }

    // Validação de nome
    const nameError = validateName(formData.name);
    if (nameError) {
      setError(nameError);
      return false;
    }

    // Validação de email
    if (!authService.validateEmail(formData.email)) {
      setError('Por favor, insira um email válido');
      return false;
    }

    // Validação de senha
    if (!authService.validatePassword(formData.password)) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    // Validação de confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    // Validação de data de nascimento
    const birthDateError = validateBirthDate(formData.birthDate);
    if (birthDateError) {
      setError(birthDateError);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const user = await authService.register(formData);
      login(user);
      navigate('/profile');
    } catch (err) {
      setError('Erro ao criar conta. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular data máxima (18 anos atrás)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="auth-page">

      <div className="auth-container">
        <div className="auth-card">
          <h1>Cadastro</h1>
          <p className="auth-subtitle">Crie sua conta GameSwap</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Nome Completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                disabled={isLoading}
                maxLength={50}
              />
              <small className="input-hint">Apenas letras e espaços (2-50 caracteres)</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Seu email"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Data de Nascimento *</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                max={getMaxDate()}
                disabled={isLoading}
                className={ageValidation.isValid === null ? '' : ageValidation.isValid ? 'valid' : 'invalid'}
              />
              {ageValidation.message && (
                <small className={`age-validation ${ageValidation.isValid ? 'valid' : 'invalid'}`}>
                  {ageValidation.message}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                disabled={isLoading}
                minLength={6}
              />
              <small className="input-hint">Mínimo de 6 caracteres</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                disabled={isLoading}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  Li e aceito os <Link to="/terms" className="terms-link" target="_blank">Termos de Uso</Link> e 
                  <Link to="/privacy" className="terms-link" target="_blank"> Política de Privacidade</Link> *
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" className="auth-link">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 