import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Pages
import Home from '../pages/home/Home';
import Marketplace from '../pages/marketplace/Marketplace';
import Inventory from '../pages/inventory/Inventory';
import Profile from '../pages/profile/Profile';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';

// Definição de todas as rotas da aplicação
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas Privadas */}
      <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <Inventory />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Rota para página não encontrada */}
      <Route path="*" element={<div>404 - Página não encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes; 