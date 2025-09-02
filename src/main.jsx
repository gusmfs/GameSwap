import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'remixicon/fonts/remixicon.css';

// VLibras temporarily disabled to avoid DOM errors
// TODO: Re-enable with proper error handling when needed
/*
const loadVLibras = () => {
  try {
    if (window.VLibras) {
      console.log('VLibras already loaded');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      try {
        setTimeout(() => {
          if (window.VLibras && window.VLibras.Widget) {
            new window.VLibras.Widget('https://vlibras.gov.br/app');
            console.log('VLibras widget initialized successfully');
          } else {
            console.warn('VLibras not available after loading');
          }
        }, 100);
      } catch (error) {
        console.warn('VLibras widget initialization failed:', error);
      }
    };
    script.onerror = () => {
      console.warn('Failed to load VLibras plugin');
    };
    document.head.appendChild(script);
  } catch (error) {
    console.warn('VLibras loading failed:', error);
  }
};

const initializeVLibras = () => {
  setTimeout(loadVLibras, 1000);
};

initializeVLibras();
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
