import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaPlus, FaWallet, FaExclamationTriangle } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart.jsx';
import { useAuth } from '../../providers/AuthProvider';
import { formatPrice } from '../../utils/formatPrice';
import PaymentModal from '../../components/payment/PaymentModal';

const Cart = () => {
  const { cart, cartState, removeFromCart, getCartTotals, clearCart } = useCart();
  const { user, updateBalance } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const totals = getCartTotals();

  // Calcular saldo e valores de pagamento
  const paymentInfo = useMemo(() => {
    const availableBalance = user?.balance || 0;
    const totalToPay = totals.total;
    const amountCovered = Math.min(availableBalance, totalToPay);
    const remainingToPay = Math.max(totalToPay - availableBalance, 0);
    const canCompletePurchase = remainingToPay === 0 && totalToPay > 0;

    return {
      availableBalance,
      totalToPay,
      amountCovered,
      remainingToPay,
      canCompletePurchase
    };
  }, [user?.balance, totals.total]);

  const handleCheckout = () => {
    if (!user) {
      alert('Por favor, faça login para finalizar a compra');
      return;
    }

    // Se há valor a pagar (saldo insuficiente), abrir modal de pagamento
    if (paymentInfo.remainingToPay > 0) {
      setIsPaymentModalOpen(true);
      return;
    }

    // Se saldo suficiente, finalizar direto
    if (paymentInfo.totalToPay === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    setIsCheckingOut(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      // Deduzir saldo usado
      if (paymentInfo.amountCovered > 0) {
        updateBalance(-paymentInfo.amountCovered);
      }
      
      // Limpar carrinho
      clearCart();
      
      alert('Compra realizada com sucesso!');
      setIsCheckingOut(false);
      
      // Redirecionar para marketplace após 1 segundo
      setTimeout(() => {
        window.location.href = '/marketplace';
      }, 1000);
    }, 2000);
  };

  const handlePaymentSuccess = () => {
    // Quando pagamento for bem-sucedido, atualizar saldo e finalizar compra
    setIsCheckingOut(true);
    
    setTimeout(() => {
      // O valor pago externamente (remainingToPay) não afeta o saldo
      // Apenas deduzir o total da compra do saldo
      // O amountCovered já estava no saldo, então deduzimos o total completo
      updateBalance(-paymentInfo.totalToPay);
      
      // Limpar carrinho
      clearCart();
      
      setIsCheckingOut(false);
      
      // Redirecionar para marketplace após 1 segundo
      setTimeout(() => {
        window.location.href = '/marketplace';
      }, 1000);
    }, 500);
  };

  return (
    <div className="cart-container">
      <div className="cart-content">
        
        {/* Header */}
        <div className="cart-header">
          <Link 
            to="/marketplace" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            <FaArrowLeft />
            <span>Voltar ao Marketplace</span>
          </Link>
          
          <h1 className="cart-title">
            <FaShoppingCart style={{ color: '#60a5fa' }} />
            <span>Carrinho de Compras</span>
            {!cartState.isEmpty && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </h1>
        </div>

        <div className="cart-grid">
          
          {/* Lista de Itens */}
          <div>
            {cartState.isEmpty ? (
              <div className="cart-card cart-empty">
                <FaShoppingCart style={{ fontSize: '4rem', color: '#9ca3af', marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Seu carrinho está vazio
                </h2>
                <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
                  Adicione alguns itens do marketplace para começar
                </p>
                <Link 
                  to="/marketplace" 
                  className="cart-btn cart-btn-primary"
                >
                  Explorar Marketplace
                </Link>
              </div>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="cart-item-image"
                    />

                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-rarity">{item.rarity?.name}</p>
                      <p className="cart-item-details">
                        {item.weapon?.name}
                        {item.wear?.name && ` • ${item.wear.name}`}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div className="cart-item-price">
                        {formatPrice(item.price)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-remove-btn"
                        title="Remover do carrinho"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumo do Carrinho */}
          <div>
            <div className="cart-card">
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem'
              }}>
                Resumo da Compra
              </h2>
              
              {!cartState.isEmpty && (
                <>
                  {/* Informações do usuário */}
                  {user && (
                    <div className="cart-user-balance">
                      <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                        Saldo disponível
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        {formatPrice(paymentInfo.availableBalance)}
                      </div>
                      
                      {/* Informação de saldo usado */}
                      {paymentInfo.amountCovered > 0 && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          marginBottom: '0.75rem',
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaWallet style={{ color: '#60a5fa' }} />
                            <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                              Saldo usado nesta compra
                            </span>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#60a5fa' }}>
                            {formatPrice(paymentInfo.amountCovered)}
                          </span>
                        </div>
                      )}

                      {/* Aviso de valor a pagar */}
                      {paymentInfo.remainingToPay > 0 && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          marginBottom: '0.75rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaExclamationTriangle style={{ color: '#f87171' }} />
                            <span style={{ fontSize: '0.875rem', color: '#fca5a5' }}>
                              Valor a pagar
                            </span>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#f87171' }}>
                            {formatPrice(paymentInfo.remainingToPay)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Totais */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div className="cart-summary-item">
                      <span>Subtotal ({cart.length} itens)</span>
                      <span>{formatPrice(totals.subtotal)}</span>
                    </div>
                    
                    {cartState.isEligibleForDiscount && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                        color: '#34d399'
                      }}>
                        <span>Desconto (10%)</span>
                        <span>-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    
                    <div className="cart-summary-total">
                      <span>Total</span>
                      <span>{formatPrice(totals.total)}</span>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut || (!paymentInfo.canCompletePurchase && paymentInfo.remainingToPay === 0) || !user}
                      className={`cart-btn ${
                        !isCheckingOut && (paymentInfo.canCompletePurchase || paymentInfo.remainingToPay > 0) && user
                          ? paymentInfo.remainingToPay > 0 ? 'cart-btn-primary' : 'cart-btn-success'
                          : 'cart-btn-disabled'
                      }`}
                      title={
                        !user 
                          ? 'Faça login para finalizar a compra'
                          : paymentInfo.remainingToPay > 0
                            ? `Clique para escolher método de pagamento`
                            : !paymentInfo.canCompletePurchase 
                              ? `Saldo insuficiente. Você precisa pagar ${formatPrice(paymentInfo.remainingToPay)} adicionais`
                              : 'Finalizar compra'
                      }
                    >
                      {isCheckingOut 
                        ? 'Processando...' 
                        : paymentInfo.remainingToPay > 0
                          ? `Pagar ${formatPrice(paymentInfo.remainingToPay)}`
                          : 'Finalizar Compra'
                      }
                    </button>
                    
                    <Link 
                      to="/marketplace" 
                      className="cart-btn cart-btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                      }}
                    >
                      <FaPlus />
                      Continuar Comprando
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={paymentInfo.remainingToPay}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Cart; 