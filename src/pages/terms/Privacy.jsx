import React from 'react';
import { Link } from 'react-router-dom';
import './Terms.css';

const Privacy = () => {
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
              Política de Privacidade
            </h1>
            <p className="terms-date">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="terms-content">
            <section className="terms-section">
              <h2>1. Informações Coletadas</h2>
              <p>
                Coletamos informações que você nos fornece diretamente, incluindo:
              </p>
              <ul>
                <li>Nome completo e informações de contato</li>
                <li>Data de nascimento para verificação de idade</li>
                <li>Informações de pagamento e transações</li>
                <li>Dados de uso da plataforma</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>2. Como Usamos Suas Informações</h2>
              <p>
                Utilizamos suas informações para:
              </p>
              <ul>
                <li>Processar transações e pagamentos</li>
                <li>Verificar sua elegibilidade (idade mínima)</li>
                <li>Fornecer suporte ao cliente</li>
                <li>Melhorar nossos serviços</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>3. Compartilhamento de Informações</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
              </p>
              <ul>
                <li>Com processadores de pagamento autorizados</li>
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Para proteger nossos direitos e segurança</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>4. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações 
                pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos 
                criptografia SSL/TLS para proteger dados em trânsito.
              </p>
            </section>

            <section className="terms-section">
              <h2>5. Cookies e Tecnologias Similares</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso 
                da plataforma e personalizar conteúdo. Você pode controlar o uso de cookies através das 
                configurações do seu navegador.
              </p>
            </section>

            <section className="terms-section">
              <h2>6. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos 
                descritos nesta política, a menos que um período de retenção mais longo seja exigido ou 
                permitido por lei.
              </p>
            </section>

            <section className="terms-section">
              <h2>7. Seus Direitos</h2>
              <p>
                Você tem o direito de:
              </p>
              <ul>
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Retirar consentimento a qualquer momento</li>
                <li>Portabilidade de dados</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>8. Menores de Idade</h2>
              <p>
                Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente 
                informações pessoais de menores de idade. Se você é pai ou responsável e acredita que seu 
                filho nos forneceu informações pessoais, entre em contato conosco.
              </p>
            </section>

            <section className="terms-section">
              <h2>9. Alterações na Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
                mudanças significativas através de email ou aviso na plataforma. O uso contínuo dos 
                serviços após as alterações constitui aceitação da nova política.
              </p>
            </section>

            <section className="terms-section">
              <h2>10. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos suas 
                informações pessoais, entre em contato conosco:
              </p>
              <div style={{ marginTop: '0.5rem' }}>
                <p><span style={{ color: '#60a5fa' }}>Email:</span> privacidade@gameswap.com</p>
                <p><span style={{ color: '#60a5fa' }}>Endereço:</span> Rua GameSwap, 123 - São Paulo, SP</p>
              </div>
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

export default Privacy; 