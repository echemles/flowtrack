import { Plus, Search } from 'lucide-react';
import { useAddShipments } from '../components/AddShipmentsContext';

export function Topbar() {
  const { open } = useAddShipments();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-surface-card px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">FlowTrack</span>
        <span className="rounded-full border border-border-subtle bg-surface-canvas px-2 py-0.5 text-xs text-text-secondary">
          Innovtex
        </span>
      </div>
      <div className="flex flex-1 max-w-md items-center gap-2 rounded-md border border-border-subtle bg-surface-canvas px-3 py-1.5 text-sm text-text-secondary">
        <Search size={14} />
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Search shipments, contacts, POs"
        />
        <span className="hidden md:inline rounded border border-border-subtle bg-surface-card px-1.5 py-0.5 text-[10px] text-text-muted">
          ⌘K
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={open}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus size={12} /> Add shipments
        </button>
        <span className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-2 py-0.5 text-xs font-medium text-white">
          AGI
        </span>
      </div>
    </header>
  );
}
