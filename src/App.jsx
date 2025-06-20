import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <div className="background-container">
          </div>
          
          <Header />
          <AppRoutes />
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
