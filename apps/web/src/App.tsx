import { Route, Routes, Navigate } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { ControlTowerPage } from './pages/ControlTowerPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { ShipmentDetailPage } from './pages/ShipmentDetailPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { InboxPage } from './pages/InboxPage';
import { ContactsPage } from './pages/ContactsPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { ConnectPage } from './pages/ConnectPage';
import { BillingPage } from './pages/BillingPage';
import { SettingsPage } from './pages/SettingsPage';
import { Landing } from './landing/Landing';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<ControlTowerPage />} />
        <Route path="shipments" element={<ShipmentsPage />} />
        <Route path="shipments/:ref" element={<ShipmentDetailPage />} />
        <Route path="live" element={<LiveTrackingPage />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="connect" element={<ConnectPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
