import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import ThemeProvider from './providers/ThemeProvider.jsx';
import { CartProvider } from './hooks/useCart.jsx';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTopButton from './components/layout/ScrollToTopButton';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
          <div className="app">
            <div className="background-container">
            </div>
            
            <Header />
            <AppRoutes />
            <ScrollToTopButton />
            <Footer />
          </div>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
