import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Inbox,
  Users,
  Receipt,
  Plug,
  CreditCard,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

type NavItem = {
  to: string;
  label: string;
  Icon: typeof LayoutDashboard;
  end?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Control Tower', Icon: LayoutDashboard, end: true },
  { to: '/shipments', label: 'Shipments', Icon: Package },
  { to: '/live', label: 'Live Tracking', Icon: MapPin },
  { to: '/inbox', label: 'Inbox', Icon: Inbox },
  { to: '/contacts', label: 'Contacts', Icon: Users },
  { to: '/purchase-orders', label: 'Purchase Orders', Icon: Receipt },
  { to: '/connect', label: 'Connect', Icon: Plug },
  { to: '/billing', label: 'Billing Center', Icon: CreditCard },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex w-60 flex-col border-r border-border-subtle bg-surface-card">
      <div className="px-5 py-5 text-lg font-semibold tracking-tight">
        <span className="text-blue-600">Flow</span>
        <span>Track</span>
      </div>
      <nav className="flex-1 px-2 py-2">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 font-semibold text-blue-700'
                  : 'text-text-secondary hover:bg-surface-canvas hover:text-text-primary',
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border-subtle px-4 py-3 text-xs text-text-muted">
        Innovtex Logistics
      </div>
    </aside>
  );
}
