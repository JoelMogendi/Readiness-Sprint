
'use client';

import { Delivery } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  pending: '🟡 Pending',
  assigned: '🔵 Assigned',
  picked_up: '🟣 Picked Up',
  delivered: '🟢 Delivered',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
};

interface DeliveryCardProps {
  delivery: Delivery;
}

export function DeliveryCard({ delivery }: DeliveryCardProps) {
  const statusColor = STATUS_COLORS[delivery.status] || 'bg-gray-100 text-gray-800';
  const statusLabel = STATUS_LABELS[delivery.status] || delivery.status;

  const formattedDate = new Date(delivery.createdAt).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{delivery.customerName}</h3>
          <p className="text-gray-600 text-sm">{delivery.customerAddress}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm">
          <span className="font-medium">Item:</span> {delivery.itemDescription}
        </p>
        <p className="text-sm">
          <span className="font-medium">Phone:</span> {delivery.customerPhone}
        </p>
        {delivery.rider && (
          <p className="text-sm">
            <span className="font-medium">🛵 Rider:</span> {delivery.rider.name}
          </p>
        )}
        {delivery.deliveredAt && (
          <p className="text-sm text-green-600">
            ✅ Delivered: {new Date(delivery.deliveredAt).toLocaleString('en-KE')}
          </p>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
        <span>🆔 Order #{delivery.id.slice(0, 8)}</span>
        <span>📅 {formattedDate}</span>
      </div>
    </div>
  );
}