import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart.jsx';
import { useAuth } from '../../providers/AuthProvider';

const Cart = () => {
  const { cart, cartState, removeFromCart, getCartTotals } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert('Compra realizada com sucesso!');
      // Limpar carrinho após compra bem-sucedida
      window.location.reload();
      setIsCheckingOut(false);
    }, 2000);
  };

  const totals = getCartTotals();

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
                      <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                        Saldo disponível
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                        {formatPrice(user.balance || 0)}
                      </div>
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
                      disabled={isCheckingOut}
                      className={`cart-btn ${!isCheckingOut ? 'cart-btn-success' : 'cart-btn-disabled'}`}
                    >
                      {isCheckingOut ? 'Processando...' : 'Finalizar Compra'}
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
    </div>
  );
};

export default Cart; 