import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import backgroundGif from './assets/Images/Background-Illustration.gif';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="background-container">
          <img src={backgroundGif} alt="Background" className="background-image" />
        </div>
        
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          {/* Add more routes here as needed */}
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
