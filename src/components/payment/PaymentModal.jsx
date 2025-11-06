import React, { useState } from 'react';
import { FaTimes, FaBarcode, FaQrcode, FaCreditCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('method'); // 'method', 'details', 'processing', 'success'
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: 1
  });
  const [pixCopyCode, setPixCopyCode] = useState('');
  const [boletoCode, setBoletoCode] = useState('');

  if (!isOpen) return null;

  // Gerar código PIX simulado
  const generatePixCode = () => {
    return `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2, 38)}5204000053039865802BR5913GAMESWAP STORE6009SAO PAULO62070503***6304`;
  };

  // Gerar código de boleto simulado
  const generateBoletoCode = () => {
    return `${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 10000)} ${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 100000)} ${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 100000)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100000000000)}`;
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setPaymentStep('details');

    // Gerar códigos automaticamente
    if (method === 'pix') {
      setPixCopyCode(generatePixCode());
    } else if (method === 'boleto') {
      setBoletoCode(generateBoletoCode());
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsProcessing(false);
    setPaymentStep('success');

    // Após sucesso, aguardar 2 segundos e chamar callback
    setTimeout(() => {
      onPaymentSuccess();
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    if (isProcessing) return; // Não fechar durante processamento
    
    setPaymentStep('method');
    setSelectedMethod(null);
    setIsProcessing(false);
    setCardData({
      number: '',
      name: '',
      expiry: '',
      cvv: '',
      installments: 1
    });
    setPixCopyCode('');
    setBoletoCode('');
    onClose();
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 0) {
      value = value.match(/.{1,4}/g).join(' ');
    }
    setCardData({ ...cardData, number: value });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardData({ ...cardData, expiry: value });
  };

  const canProceed = () => {
    if (selectedMethod === 'pix' || selectedMethod === 'boleto') {
      return true;
    }
    if (selectedMethod === 'credit' || selectedMethod === 'debit') {
      return cardData.number.length >= 19 &&
             cardData.name.length >= 3 &&
             cardData.expiry.length === 5 &&
             cardData.cvv.length === 3;
    }
    return false;
  };

  return (
    <div className="payment-modal-overlay" onClick={handleClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Finalizar Pagamento</h2>
          <button className="payment-modal-close" onClick={handleClose} disabled={isProcessing}>
            <FaTimes />
          </button>
        </div>

        <div className="payment-modal-content">
          {/* Resumo do pedido */}
          <div className="payment-summary">
            <div className="payment-summary-item">
              <span>Valor a pagar:</span>
              <span className="payment-amount">{formatPrice(amount)}</span>
            </div>
          </div>

          {/* Seleção de método */}
          {paymentStep === 'method' && (
            <div className="payment-methods">
              <h3>Escolha a forma de pagamento</h3>
              <div className="payment-methods-grid">
                <button
                  className="payment-method-card"
                  onClick={() => handleMethodSelect('pix')}
                >
                  <FaQrcode className="payment-method-icon" />
                  <span className="payment-method-name">PIX</span>
                  <span className="payment-method-benefit">Aprovação imediata</span>
                </button>

                <button
                  className="payment-method-card"
                  onClick={() => handleMethodSelect('boleto')}
                >
                  <FaBarcode className="payment-method-icon" />
                  <span className="payment-method-name">Boleto</span>
                  <span className="payment-method-benefit">Vencimento em 3 dias</span>
                </button>

                <button
                  className="payment-method-card"
                  onClick={() => handleMethodSelect('credit')}
                >
                  <FaCreditCard className="payment-method-icon" />
                  <span className="payment-method-name">Cartão de Crédito</span>
                  <span className="payment-method-benefit">Parcelamento disponível</span>
                </button>

                <button
                  className="payment-method-card"
                  onClick={() => handleMethodSelect('debit')}
                >
                  <FaCreditCard className="payment-method-icon" />
                  <span className="payment-method-name">Cartão de Débito</span>
                  <span className="payment-method-benefit">Desconto imediato</span>
                </button>
              </div>
            </div>
          )}

          {/* Detalhes do pagamento */}
          {paymentStep === 'details' && (
            <div className="payment-details">
              {/* PIX */}
              {selectedMethod === 'pix' && (
                <div className="payment-pix">
                  <div className="payment-info-box">
                    <FaQrcode className="payment-info-icon" />
                    <h3>Pague com PIX</h3>
                    <p className="payment-info-description">
                      Copie o código abaixo e cole no app do seu banco para realizar o pagamento instantâneo.
                    </p>
                  </div>
                  
                  <div className="pix-code-container">
                    <div className="pix-code">
                      {pixCopyCode}
                    </div>
                    <button
                      className="pix-copy-button"
                      onClick={() => {
                        navigator.clipboard.writeText(pixCopyCode);
                        alert('Código PIX copiado!');
                      }}
                    >
                      Copiar código
                    </button>
                  </div>

                  <div className="payment-note">
                    <p>💡 <strong>Simulação:</strong> Em um ambiente real, você seria redirecionado para o aplicativo do banco ou veria um QR Code para escanear.</p>
                  </div>
                </div>
              )}

              {/* Boleto */}
              {selectedMethod === 'boleto' && (
                <div className="payment-boleto">
                  <div className="payment-info-box">
                    <FaBarcode className="payment-info-icon" />
                    <h3>Boleto Bancário</h3>
                    <p className="payment-info-description">
                      O boleto será gerado e você poderá pagá-lo em qualquer banco ou lotérica até o vencimento.
                    </p>
                  </div>

                  <div className="boleto-code-container">
                    <div className="boleto-code">
                      {boletoCode}
                    </div>
                    <button
                      className="boleto-copy-button"
                      onClick={() => {
                        navigator.clipboard.writeText(boletoCode);
                        alert('Código do boleto copiado!');
                      }}
                    >
                      Copiar código
                    </button>
                  </div>

                  <div className="payment-note">
                    <p>📅 <strong>Vencimento:</strong> 3 dias úteis a partir de hoje</p>
                    <p>💡 <strong>Simulação:</strong> Em um ambiente real, um PDF do boleto seria gerado para download.</p>
                  </div>
                </div>
              )}

              {/* Cartão de Crédito */}
              {selectedMethod === 'credit' && (
                <div className="payment-card">
                  <div className="payment-info-box">
                    <FaCreditCard className="payment-info-icon" />
                    <h3>Cartão de Crédito</h3>
                  </div>

                  <div className="card-form">
                    <div className="form-group">
                      <label>Número do cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                    </div>

                    <div className="form-group">
                      <label>Nome no cartão</label>
                      <input
                        type="text"
                        placeholder="NOME COMPLETO"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          maxLength={5}
                        />
                      </div>

                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Parcelamento</label>
                      <select
                        value={cardData.installments}
                        onChange={(e) => setCardData({ ...cardData, installments: parseInt(e.target.value) })}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                          <option key={num} value={num}>
                            {num}x de {formatPrice(amount / num)} sem juros
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Cartão de Débito */}
              {selectedMethod === 'debit' && (
                <div className="payment-card">
                  <div className="payment-info-box">
                    <FaCreditCard className="payment-info-icon" />
                    <h3>Cartão de Débito</h3>
                  </div>

                  <div className="card-form">
                    <div className="form-group">
                      <label>Número do cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                    </div>

                    <div className="form-group">
                      <label>Nome no cartão</label>
                      <input
                        type="text"
                        placeholder="NOME COMPLETO"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          maxLength={5}
                        />
                      </div>

                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de ação */}
              <div className="payment-actions">
                <button
                  className="payment-button-secondary"
                  onClick={() => {
                    setPaymentStep('method');
                    setSelectedMethod(null);
                  }}
                  disabled={isProcessing}
                >
                  Voltar
                </button>
                <button
                  className="payment-button-primary"
                  onClick={handleProcessPayment}
                  disabled={!canProceed() || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="spinner" />
                      Processando...
                    </>
                  ) : (
                    `Confirmar pagamento de ${formatPrice(amount)}`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Processamento */}
          {paymentStep === 'processing' && (
            <div className="payment-processing">
              <FaSpinner className="processing-spinner" />
              <h3>Processando pagamento...</h3>
              <p>Aguarde enquanto confirmamos seu pagamento</p>
            </div>
          )}

          {/* Sucesso */}
          {paymentStep === 'success' && (
            <div className="payment-success">
              <FaCheckCircle className="success-icon" />
              <h3>Pagamento aprovado!</h3>
              <p>Seu pagamento foi processado com sucesso</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

