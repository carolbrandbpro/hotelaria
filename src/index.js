import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Usa modo claro por padrão (remove configuração anterior de dark)
document.body.removeAttribute('data-theme');

// Força base da API a partir do .env quando disponível
try {
  const envBase = process.env.REACT_APP_API_BASE;
  if (envBase) {
    localStorage.setItem('api_base', envBase);
  }
} catch {}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);