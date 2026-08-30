'use client';

import type { Delivery } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: '🗓️ Scheduled',
  IN_TRANSIT: '🚚 In Transit',
  DELAYED: '⚠️ Delayed',
  DELIVERED: '✅ Delivered',
};

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  IN_TRANSIT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  DELAYED: 'bg-red-500/10 text-red-400 border-red-500/20',
  DELIVERED: 'bg-green-500/10 text-green-400 border-green-500/20',
};

interface DeliveryCardProps {
  delivery: Delivery;
}

export function DeliveryCard({ delivery }: DeliveryCardProps) {
  const statusColor = STATUS_COLORS[delivery.status] || 'bg-zinc-800 text-zinc-300 border-zinc-700';
  const statusLabel = STATUS_LABELS[delivery.status] || delivery.status;

  const formattedDate = new Date(delivery.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg text-zinc-100">{delivery.customerName}</h3>
          <p className="text-zinc-400 text-sm">{delivery.customerAddress}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm text-zinc-400">
        <p><span className="text-zinc-500">Item:</span> {delivery.itemDescription}</p>
        <p><span className="text-zinc-500">Phone:</span> {delivery.customerPhone}</p>
        
        {/* Support both nested rider objects and populated strings */}
        {(delivery.rider || delivery.riderId) && (
          <p><span className="text-zinc-500">Rider:</span> {
            typeof delivery.riderId === 'object' ? (delivery.riderId as any).name : 'Assigned'
          }</p>
        )}
        
        {delivery.deliveredAt && (
          <p className="text-green-400 col-span-2 mt-1">
            ✅ Delivered: {new Date(delivery.deliveredAt).toLocaleString('en-US')}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between text-xs text-zinc-500 tracking-wide">
        <span className="uppercase">ID: {delivery.id.slice(0, 8)}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}