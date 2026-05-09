import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import './index.css';
import { App } from './App';
import { ToastProvider } from './components/ui/Toast';
import { AddShipmentsProvider } from './components/AddShipmentsContext';

// HashRouter on GitHub Pages avoids 404s on deep-link refresh (no SPA fallback).
// BrowserRouter in dev keeps URLs clean.
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ToastProvider>
        <AddShipmentsProvider>
          <App />
        </AddShipmentsProvider>
      </ToastProvider>
    </Router>
  </StrictMode>,
);
