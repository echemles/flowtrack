import { Plus, Search, ArrowLeft, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAddShipments } from '../components/AddShipmentsContext';
import { useMobileDrawer } from './AppShell';

export function Topbar() {
  const { open: openAddShipments } = useAddShipments();
  const { toggle: toggleDrawer, open: drawerOpen } = useMobileDrawer();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-brand-rule bg-brand-paper px-4 sm:gap-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={toggleDrawer}
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          aria-controls="app-sidebar"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-brand-rule text-brand-navy transition-colors hover:bg-brand-navy/5 md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Mobile-only brand wordmark */}
        <span
          className="ft-eyebrow text-brand-navy sm:hidden"
          style={{ letterSpacing: '0.16em' }}
        >
          FLOWTRACK
        </span>

        {/* Back-to-marketing link: full label at sm+, icon-only below */}
        <Link
          to="/"
          aria-label="Back to flowtrack.com"
          className="ft-eyebrow hidden sm:inline-flex items-center gap-1.5 border border-brand-navy px-2.5 py-1.5 text-brand-navy transition-colors hover:bg-brand-navy/5"
        >
          <ArrowLeft size={11} /> flowtrack.com
        </Link>

        {/* Org chip: collapsed to dot below sm */}
        <span className="ft-eyebrow hidden sm:inline-flex items-center gap-2 text-brand-navy">
          <span aria-hidden className="inline-block h-1.5 w-1.5 bg-brand-red" />
          Innovtex
        </span>
      </div>

      {/* Search: hidden on mobile */}
      <div className="hidden sm:flex flex-1 max-w-md items-center gap-2 border border-brand-rule bg-brand-paper px-3 py-1.5 text-[13px] text-brand-navy focus-within:border-brand-red">
        <Search size={14} className="text-brand-navy/50" />
        <input
          className="w-full bg-transparent outline-none placeholder:text-brand-navy/35"
          placeholder="Search shipments, contacts, POs"
        />
        <span className="hidden md:inline border border-brand-rule px-1.5 py-0.5 text-[10px] text-brand-navy/55">
          ⌘K
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Add shipments: icon-only on mobile, labeled on sm+ */}
        <button
          type="button"
          onClick={openAddShipments}
          aria-label="Add shipments"
          className="inline-flex h-9 w-9 sm:h-auto sm:w-auto items-center justify-center gap-1.5 border border-brand-red bg-brand-red px-0 sm:px-3 sm:py-1.5 text-brand-paper transition-colors hover:bg-brand-redInk hover:border-brand-redInk"
        >
          <Plus size={14} className="sm:hidden" />
          <span className="ft-eyebrow hidden sm:inline-flex items-center gap-1.5">
            <Plus size={12} /> Add shipments
          </span>
        </button>
        <span className="ft-micro hidden sm:inline-flex items-center border border-brand-navy/20 px-2 py-1 text-brand-navy">
          AGI
        </span>
      </div>
    </header>
  );
}
