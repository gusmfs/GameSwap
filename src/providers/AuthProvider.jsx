import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const defaultAuthContext = {
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  updateBalance: () => {},
  isAuthenticated: false,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn('useAuth used outside of AuthProvider. Falling back to default context.');
    }
    return defaultAuthContext;
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const INITIAL_BALANCE = 1349.00; // Saldo inicial padrão

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage or session)
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Garantir que o usuário sempre tenha saldo inicializado
          if (parsedUser.balance === undefined || parsedUser.balance === null) {
            parsedUser.balance = INITIAL_BALANCE;
            localStorage.setItem('user', JSON.stringify(parsedUser));
          }
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao carregar usuário do localStorage:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    // Garantir que o usuário sempre tenha saldo inicializado
    const userWithBalance = {
      ...userData,
      balance: userData.balance !== undefined && userData.balance !== null 
        ? userData.balance 
        : INITIAL_BALANCE
    };
    setUser(userWithBalance);
    localStorage.setItem('user', JSON.stringify(userWithBalance));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const updateBalance = (amount) => {
    setUser(prev => {
      if (!prev) return prev;
      const newBalance = Math.max(0, (prev.balance || INITIAL_BALANCE) + amount);
      const updated = { ...prev, balance: newBalance };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    updateBalance,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 