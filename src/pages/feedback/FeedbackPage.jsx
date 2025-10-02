import React, { useState } from 'react';
import { FaCommentDots, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleFeedbackSubmit = (feedbackData) => {
    console.log('Feedback enviado:', feedbackData);
    // Aqui você pode implementar a lógica para salvar o feedback
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="feedback-page">
      
      <div className="feedback-container">
        <div className="feedback-header">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft />
            Voltar
          </button>
          <h1 className="feedback-title">
            <FaCommentDots />
            Feedback
          </h1>
          <p className="feedback-subtitle">
            Sua opinião é importante para nós! Ajude-nos a melhorar o GameSwap.
          </p>
        </div>

        <div className="feedback-content">
          <div className="feedback-info">
            <h2>Como podemos ajudar?</h2>
            <p>
              Use o formulário ao lado para nos enviar sugestões, reportar bugs, 
              ou compartilhar qualquer feedback sobre sua experiência no GameSwap.
            </p>
            
            <div className="feedback-tips">
              <h3>Dicas para um feedback eficaz:</h3>
              <ul>
                <li>Seja específico sobre o problema ou sugestão</li>
                <li>Inclua passos para reproduzir bugs</li>
                <li>Mencione seu navegador e sistema operacional se relevante</li>
                <li>Use uma linguagem clara e objetiva</li>
              </ul>
            </div>
          </div>

          <div className="feedback-form-container">
            <FeedbackForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSubmit={handleFeedbackSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
