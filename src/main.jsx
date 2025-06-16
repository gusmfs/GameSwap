import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add VLibras widget
const script = document.createElement('script');
script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
script.async = true;
script.onload = () => {
  new window.VLibras.Widget('https://vlibras.gov.br/app');
};
document.head.appendChild(script);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
