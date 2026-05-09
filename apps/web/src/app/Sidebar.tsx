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
  ArrowUpRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useMobileDrawer } from './AppShell';

type NavItem = {
  to: string;
  label: string;
  Icon: typeof LayoutDashboard;
  end?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/app', label: 'Control Tower', Icon: LayoutDashboard, end: true },
  { to: '/app/shipments', label: 'Shipments', Icon: Package },
  { to: '/app/live', label: 'Live Tracking', Icon: MapPin },
  { to: '/app/inbox', label: 'Inbox', Icon: Inbox },
  { to: '/app/contacts', label: 'Contacts', Icon: Users },
  { to: '/app/purchase-orders', label: 'Purchase Orders', Icon: Receipt },
  { to: '/app/connect', label: 'Connect', Icon: Plug },
  { to: '/app/billing', label: 'Billing Center', Icon: CreditCard },
  { to: '/app/settings', label: 'Settings', Icon: Settings },
];

export function Sidebar() {
  const { open } = useMobileDrawer();

  return (
    <aside
      className={clsx(
        // Mobile: fixed slide-in drawer overlaying content
        'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-brand-ink text-brand-paper',
        'transition-transform duration-[220ms] ease-out motion-reduce:transition-none',
        open ? 'translate-x-0' : '-translate-x-full',
        // Desktop: static, always visible, no transform
        'md:static md:translate-x-0 md:transition-none',
      )}
      aria-hidden={false}
    >
      <div className="px-5 pt-6 pb-5">
        <div
          className="text-brand-paper"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontWeight: 200,
            fontSize: '14px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          FlowTrack
        </div>
        <div
          className="mt-2 text-brand-red"
          style={{
            fontWeight: 700,
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          Logistics Control Tower
        </div>
      </div>
      <div className="border-b border-brand-ruleDark" />
      <nav className="flex-1 px-2 py-3">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'relative flex items-center gap-3 px-4 py-2 text-[13px] transition-colors',
                isActive
                  ? 'text-brand-paper'
                  : 'text-brand-paper/60 hover:text-brand-paper',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-brand-red"
                  />
                ) : null}
                <Icon size={16} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-brand-ruleDark px-5 py-4">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[10px] text-brand-muteDark hover:text-brand-paper transition-colors"
          style={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}
        >
          flowtrack.com <ArrowUpRight size={11} />
        </a>
      </div>
    </aside>
  );
}
