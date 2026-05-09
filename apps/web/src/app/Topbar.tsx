import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAddShipments } from '../components/AddShipmentsContext';

export function Topbar() {
  const { open } = useAddShipments();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-brand-rule bg-brand-paper px-6">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="ft-eyebrow inline-flex items-center gap-1.5 border border-brand-navy px-2.5 py-1.5 text-brand-navy transition-colors hover:bg-brand-navy/5"
        >
          <ArrowLeft size={11} /> flowtrack.com
        </Link>
        <span className="ft-eyebrow inline-flex items-center gap-2 text-brand-navy">
          <span aria-hidden className="inline-block h-1.5 w-1.5 bg-brand-red" />
          Innovtex
        </span>
      </div>
      <div className="flex flex-1 max-w-md items-center gap-2 border border-brand-rule bg-brand-paper px-3 py-1.5 text-[13px] text-brand-navy focus-within:border-brand-red">
        <Search size={14} className="text-brand-navy/50" />
        <input
          className="w-full bg-transparent outline-none placeholder:text-brand-navy/35"
          placeholder="Search shipments, contacts, POs"
        />
        <span className="hidden md:inline border border-brand-rule px-1.5 py-0.5 text-[10px] text-brand-navy/55">
          ⌘K
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={open}
          className="ft-eyebrow inline-flex items-center gap-1.5 border border-brand-red bg-brand-red px-3 py-1.5 text-brand-paper transition-colors hover:bg-brand-redInk hover:border-brand-redInk"
        >
          <Plus size={12} /> Add shipments
        </button>
        <span className="ft-micro inline-flex items-center border border-brand-navy/20 px-2 py-1 text-brand-navy">
          AGI
        </span>
      </div>
    </header>
  );
}
