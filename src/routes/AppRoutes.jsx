import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Pages
import Home from '../pages/home/Home';
import Marketplace from '../pages/marketplace/Marketplace';
import Cart from '../pages/Cart/Cart';
import Inventory from '../pages/inventory/Inventory';
import Profile from '../pages/profile/Profile';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import Terms from '../pages/terms/Terms';
import Privacy from '../pages/terms/Privacy';
import SocialProfile from '../pages/social/SocialProfile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import FeedbackPage from '../pages/feedback/FeedbackPage';
import ResetPassword from '../pages/login/ResetPassword';
import Acessibilidade from '../pages/terms/Acessibilidade';

// Definição de todas as rotas da aplicação
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/u/:slug" element={<SocialProfile />} />
      <Route path="/u/id/:userId" element={<SocialProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/acessibilidade" element={<Acessibilidade />} />

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
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Rota para página não encontrada */}
      <Route path="*" element={<div>404 - Página não encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;
