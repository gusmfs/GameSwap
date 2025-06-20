import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/home/Home';
import Marketplace from './pages/marketplace/Marketplace';
import Inventory from './pages/inventory/Inventory';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import backgroundGif from './assets/Images/Background-Illustration.gif';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <div className="background-container">
          </div>
          
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
