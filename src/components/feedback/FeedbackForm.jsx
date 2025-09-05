import React, { useState } from 'react';
import { FaStar, FaTimes, FaCheck } from 'react-icons/fa';
import './FeedbackForm.css';

const FeedbackForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    category: '',
    subject: '',
    message: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const categories = [
    { value: 'bug', label: 'Reportar Bug' },
    { value: 'feature', label: 'Sugestão de Funcionalidade' },
    { value: 'ui', label: 'Interface/Design' },
    { value: 'performance', label: 'Performance' },
    { value: 'general', label: 'Feedback Geral' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simular envio do feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({
          rating: 0,
          category: '',
          subject: '',
          message: '',
          email: ''
        });
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setFormData({
        rating: 0,
        category: '',
        subject: '',
        message: '',
        email: ''
      });
      setSubmitStatus(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="feedback-modal-header">
          <h2>Enviar Feedback</h2>
          <button 
            className="feedback-close-btn" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Rating */}
          <div className="feedback-field">
            <label>Avaliação Geral</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rating-star ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                  disabled={isSubmitting}
                >
                  <FaStar />
                </button>
              ))}
              <span className="rating-text">
                {formData.rating === 0 ? 'Selecione uma avaliação' : 
                 formData.rating === 1 ? 'Muito ruim' :
                 formData.rating === 2 ? 'Ruim' :
                 formData.rating === 3 ? 'Regular' :
                 formData.rating === 4 ? 'Bom' : 'Excelente'}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="feedback-field">
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="feedback-field">
            <label htmlFor="subject">Assunto</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Resumo do seu feedback"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Message */}
          <div className="feedback-field">
            <label htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Descreva detalhadamente seu feedback, sugestão ou problema..."
              rows="5"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Email (opcional) */}
          <div className="feedback-field">
            <label htmlFor="email">Email (opcional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Seu email para contato"
              disabled={isSubmitting}
            />
            <small>Deixe seu email se deseja receber uma resposta</small>
          </div>

          {/* Submit Status */}
          {submitStatus && (
            <div className={`feedback-status ${submitStatus}`}>
              {submitStatus === 'success' ? (
                <>
                  <FaCheck />
                  <span>Feedback enviado com sucesso! Obrigado!</span>
                </>
              ) : (
                <span>Erro ao enviar feedback. Tente novamente.</span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="feedback-actions">
            <button
              type="button"
              className="feedback-cancel-btn"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="feedback-submit-btn"
              disabled={isSubmitting || formData.rating === 0 || !formData.category || !formData.subject || !formData.message}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
