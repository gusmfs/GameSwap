import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { useAuth } from '../providers/AuthProvider';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  
  // Estados booleanos do carrinho - otimizado com useMemo
  const cartState = useMemo(() => {
    const totalValue = cart.reduce((sum, item) => sum + item.price, 0);
    const userBudget = user?.balance || 0;
    
    return {
      isEmpty: cart.length === 0,
      hasValidItems: cart.some(item => item.isValid !== false),
      hasInvalidItems: cart.some(item => item.isValid === false),
      hasPremiumItems: cart.some(item => item.rarity?.name === 'Covert'),
      hasStatTrakItems: cart.some(item => item.stattrak),
      hasSouvenirItems: cart.some(item => item.souvenir),
      isOverBudget: totalValue > userBudget,
      isEligibleForDiscount: cart.length >= 3 && totalValue >= 100,
      canCheckout: cart.length > 0 && totalValue <= userBudget
    };
  }, [cart, user?.balance]);

  // Carrega carrinho do localStorage apenas uma vez
  useEffect(() => {
    const savedCart = localStorage.getItem('gameswap-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        localStorage.removeItem('gameswap-cart');
      }
    }
  }, []);

  // Salva carrinho no localStorage com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('gameswap-cart', JSON.stringify(cart));
    }, 100); // Debounce de 100ms

    return () => clearTimeout(timeoutId);
  }, [cart]);

  // Adiciona item ao carrinho - otimizado com useCallback
  const addToCart = useCallback((item) => {
    const validations = {
      isUserLoggedIn: !!user,
      isItemNotAlreadyInCart: !cart.some(cartItem => cartItem.id === item.id)
    };

    const canAdd = Object.values(validations).every(validation => validation);
    
    if (!canAdd) {
      const failedValidations = Object.entries(validations)
        .filter(([key, value]) => !value)
        .map(([key]) => key);
      
      const messages = {
        isUserLoggedIn: 'Faça login para adicionar itens',
        isItemNotAlreadyInCart: 'Item já está no carrinho'
      };
      
      const message = failedValidations.map(key => messages[key]).join(', ');
      throw new Error(message);
    }

    setCart(prevCart => [...prevCart, { ...item, addedAt: new Date().toISOString() }]);
  }, [cart, user]);

  // Remove item do carrinho - otimizado com useCallback
  const removeFromCart = useCallback((itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  // Limpa carrinho - otimizado com useCallback
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calcula totais - otimizado com useMemo
  const getCartTotals = useCallback(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const discount = cartState.isEligibleForDiscount ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    return { subtotal, discount, total, itemCount: cart.length };
  }, [cart, cartState.isEligibleForDiscount]);

  // Valor do contexto - otimizado com useMemo
  const value = useMemo(() => ({
    cart,
    cartState,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotals
  }), [cart, cartState, addToCart, removeFromCart, clearCart, getCartTotals]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 