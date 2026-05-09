import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { AddShipmentsModal } from './AddShipmentsModal';

type Ctx = { open: () => void; close: () => void; isOpen: boolean };

const AddShipmentsContext = createContext<Ctx | null>(null);

export function useAddShipments() {
  const ctx = useContext(AddShipmentsContext);
  if (!ctx) throw new Error('useAddShipments must be used inside <AddShipmentsProvider>');
  return ctx;
}

export function AddShipmentsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // global Cmd/Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ?addshipments=1 in URL auto-opens (used by smoke screenshot capture)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('addshipments') === '1') setIsOpen(true);
  }, []);

  return (
    <AddShipmentsContext.Provider value={{ open, close, isOpen }}>
      {children}
      <AddShipmentsModal open={isOpen} onClose={close} />
    </AddShipmentsContext.Provider>
  );
}
