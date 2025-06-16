import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="background-container">
          <img src="/src/assets/images/Background-Illustration.gif" alt="Background" className="background-image" />
        </div>
        
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes here as needed */}
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
