'use client';

import { useState } from 'react';
import { useDeliveries } from '../../context/DeliveryContext';
import { DeliveryForm } from '../../components/retailer/DeliveryForm';

export default function RetailerDashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const { deliveries, loading, error, fetchDeliveries } = useDeliveries();

  const handleRefresh = () => {
    fetchDeliveries();
  };

  // Count deliveries by our official uppercase status types
  const stats = {
    total: deliveries.length,
    scheduled: deliveries.filter(d => d.status === 'SCHEDULED').length,
    in_transit: deliveries.filter(d => d.status === 'IN_TRANSIT').length,
    delayed: deliveries.filter(d => d.status === 'DELAYED').length,
    delivered: deliveries.filter(d => d.status === 'DELIVERED').length,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-4 sm:p-8">
      <main className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Retailer Dashboard</h1>
            <p className="text-zinc-400 mt-1">Manage your delivery requests</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                showForm 
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                  : 'bg-zinc-50 text-zinc-950 hover:bg-zinc-200'
              }`}
            >
              {showForm ? '✕ Close Form' : '📦 New Delivery'}
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 border border-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-900 transition-colors text-sm font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-zinc-100">{stats.total}</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Total</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.scheduled}</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Scheduled</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.in_transit}</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">In Transit</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.delayed}</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Delayed</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.delivered}</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Delivered</div>
          </div>
        </div>

        {/* Create Delivery Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <DeliveryForm onClose={() => setShowForm(false)} />
          </div>
        )}

        {/* Delivery List */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Active Deliveries</h2>
          </div>

          {loading && <p className="text-zinc-500">Loading your deliveries...</p>}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {!loading && !error && deliveries.length === 0 && (
            <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-lg mb-1">No deliveries yet</p>
              <p className="text-sm">Click "New Delivery" to create your first request.</p>
            </div>
          )}

          {!loading && !error && deliveries.length > 0 && (
            <div className="grid gap-4">
              {deliveries.map((delivery) => {
                // Map the uppercase statuses to specific Tailwind colors
                const statusColors: Record<string, string> = {
                  SCHEDULED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  IN_TRANSIT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                  DELAYED: 'bg-red-500/10 text-red-400 border-red-500/20',
                  DELIVERED: 'bg-green-500/10 text-green-400 border-green-500/20',
                };
                
                const color = statusColors[delivery.status] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

                return (
                  <div key={delivery.id} className="border border-zinc-800 rounded-lg p-5 bg-zinc-950 hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg text-zinc-100">{delivery.customerName}</h3>
                        <p className="text-sm text-zinc-400">{delivery.customerAddress}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
                        {delivery.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm text-zinc-400">
                      <p>📦 <span className="text-zinc-300">{delivery.itemDescription}</span></p>
                      <p>📞 <span className="text-zinc-300">{delivery.customerPhone}</span></p>
                      
                      {/* Safety check for nested rider object or string ID */}
                      {(delivery.rider || delivery.riderId) && (
                         <p>🛵 Rider: <span className="text-zinc-300">
                           {typeof delivery.riderId === 'object' ? (delivery.riderId as any).name : 'Assigned'}
                         </span></p>
                      )}
                      
                      {delivery.deliveredAt && (
                        <p className="text-green-400 col-span-2">
                          ✅ Delivered: {new Date(delivery.deliveredAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}