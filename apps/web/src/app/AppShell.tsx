import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

type DrawerCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  close: () => void;
};

const MobileDrawerContext = createContext<DrawerCtx | null>(null);

export function useMobileDrawer(): DrawerCtx {
  const ctx = useContext(MobileDrawerContext);
  if (!ctx) throw new Error('useMobileDrawer must be used within AppShell');
  return ctx;
}

export function AppShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Auto-close drawer if viewport grows past md
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open]);

  const value = useMemo(
    () => ({ open, setOpen, toggle, close }),
    [open, toggle, close],
  );

  return (
    <MobileDrawerContext.Provider value={value}>
      <div className="relative flex min-h-screen w-screen bg-brand-bone text-brand-navy md:h-screen">
        <Sidebar />
        {/* Backdrop for mobile drawer */}
        <button
          type="button"
          aria-hidden={!open}
          tabIndex={-1}
          onClick={close}
          className={
            'fixed inset-0 z-30 bg-brand-navy/70 transition-opacity duration-[220ms] ease-out md:hidden ' +
            (open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none') +
            ' motion-reduce:transition-none'
          }
        />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col md:h-screen md:overflow-hidden">
          <Topbar />
          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </MobileDrawerContext.Provider>
  );
}
