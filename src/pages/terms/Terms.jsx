import React from 'react';
import { Link } from 'react-router-dom';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="blur-circle circle1"></div>
        <div className="blur-circle circle2"></div>
        <div className="blur-circle circle3"></div>
      </div>

      <div className="terms-container">
        <div className="terms-card">
          <div className="terms-header">
            <h1 className="terms-title">
              Termos de Uso
            </h1>
            <p className="terms-date">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="terms-content">
            <section className="terms-section">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma GameSwap, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
              </p>
            </section>

            <section className="terms-section">
              <h2>2. Elegibilidade</h2>
              <p>
                Para usar a GameSwap, você deve ter pelo menos 18 anos de idade. Ao se cadastrar, você confirma que 
                atende a este requisito de idade e tem capacidade legal para celebrar contratos.
              </p>
            </section>

            <section className="terms-section">
              <h2>3. Conta do Usuário</h2>
              <p>
                Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em aceitar 
                responsabilidade por todas as atividades que ocorrem em sua conta. A GameSwap não será responsável 
                por qualquer perda ou dano decorrente de sua falha em proteger sua conta.
              </p>
            </section>

            <section className="terms-section">
              <h2>4. Uso Aceitável</h2>
              <p>
                Você concorda em usar a plataforma apenas para fins legais e de acordo com estes Termos. 
                É proibido usar nossos serviços para:
              </p>
              <ul>
                <li>Atividades ilegais ou fraudulentas</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Transmitir conteúdo malicioso ou prejudicial</li>
                <li>Interferir na operação da plataforma</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>5. Transações e Pagamentos</h2>
              <p>
                Todas as transações na GameSwap são processadas de forma segura. Você concorda em fornecer 
                informações precisas e atualizadas para todas as transações. A GameSwap reserva-se o direito 
                de recusar ou cancelar transações que violem estes termos.
              </p>
            </section>

            <section className="terms-section">
              <h2>6. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da GameSwap, incluindo textos, gráficos, logotipos e software, é propriedade 
                da GameSwap ou de seus licenciadores e está protegido por leis de propriedade intelectual.
              </p>
            </section>

            <section className="terms-section">
              <h2>7. Limitação de Responsabilidade</h2>
              <p>
                A GameSwap não será responsável por danos indiretos, incidentais, especiais ou consequenciais 
                decorrentes do uso de nossos serviços, incluindo perda de lucros, dados ou uso.
              </p>
            </section>

            <section className="terms-section">
              <h2>8. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. As modificações entrarão 
                em vigor imediatamente após a publicação. Seu uso contínuo da plataforma constitui aceitação 
                dos novos termos.
              </p>
            </section>

            <section className="terms-section">
              <h2>9. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do email: 
                <span style={{ color: '#60a5fa' }}> suporte@gameswap.com</span>
              </p>
            </section>
          </div>

          <div className="terms-button-container">
            <Link to="/register" className="terms-button">
              Voltar ao Cadastro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 