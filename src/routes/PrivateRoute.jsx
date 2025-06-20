import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Aguarda a verificação de autenticação
  if (loading) {
    return null; // ou um componente de loading
  }

  // Se não estiver autenticado, redireciona para o login
  // salvando a localização atual para redirect após o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderiza o componente da rota
  return children;
};

export default PrivateRoute; 