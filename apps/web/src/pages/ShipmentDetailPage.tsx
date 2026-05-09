// Placeholder until FT-006 is started; route mounts but full layout TODO.
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ShipmentDetailSchema, type ShipmentDetail } from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import { ShipmentDetailLayout } from './shipment-detail/ShipmentDetailLayout';

export function ShipmentDetailPage() {
  const { ref } = useParams();
  const path = ref ? `/shipments/${ref}` : null;
  const state = useApi(path, ShipmentDetailSchema);

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <div>
        <Link
          to="/shipments"
          className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={12} /> All shipments
        </Link>
      </div>
      <DataState<ShipmentDetail> state={state}>
        {(data) => <ShipmentDetailLayout data={data} />}
      </DataState>
    </div>
  );
}
