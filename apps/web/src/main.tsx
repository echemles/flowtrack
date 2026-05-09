import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { App } from './App';
import { ToastProvider } from './components/ui/Toast';
import { AddShipmentsProvider } from './components/AddShipmentsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AddShipmentsProvider>
          <App />
        </AddShipmentsProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
