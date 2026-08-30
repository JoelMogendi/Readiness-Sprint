'use client';

import { useState } from 'react';
import { useDeliveries } from '../../context/DeliveryContext';
import { DeliveryForm } from '../../components/retailer/DeliveryForm';

// Mock data with your personal examples
const MOCK_DELIVERIES = [
  {
    id: 'DEL-001',
    customerName: 'Irene Dzingai',
    customerPhone: '0774248564',
    customerAddress: 'Harare CBD, Zimbabwe',
    itemDescription: 'Laptop - Dell XPS 13',
    status: 'delivered' as const,
    retailerId: 'retailer-001',
    rider: {
      id: 'rider-001',
      name: 'Takudzwa Moyo'
    },
    assignedAt: '2026-08-29T10:00:00Z',
    pickedUpAt: '2026-08-29T10:30:00Z',
    deliveredAt: '2026-08-29T11:15:00Z',
    createdAt: '2026-08-29T09:00:00Z',
    updatedAt: '2026-08-29T11:15:00Z'
  },
  {
    id: 'DEL-002',
    customerName: 'Tendai Mukundu',
    customerPhone: '0774123456',
    customerAddress: 'Mbare, Harare, Zimbabwe',
    itemDescription: 'Groceries - Weekly Family Pack',
    status: 'picked_up' as const,
    retailerId: 'retailer-001',
    rider: {
      id: 'rider-002',
      name: 'Chengetai Mupanduki'
    },
    assignedAt: '2026-08-30T08:00:00Z',
    pickedUpAt: '2026-08-30T08:45:00Z',
    deliveredAt: undefined,
    createdAt: '2026-08-30T07:00:00Z',
    updatedAt: '2026-08-30T08:45:00Z'
  },
  {
    id: 'DEL-003',
    customerName: 'Ruvarashe Machingura',
    customerPhone: '0774987654',
    customerAddress: 'Belvedere, Harare, Zimbabwe',
    itemDescription: 'Books - University Textbooks',
    status: 'assigned' as const,
    retailerId: 'retailer-001',
    rider: {
      id: 'rider-003',
      name: 'Simbarashe Mupfumira'
    },
    assignedAt: '2026-08-30T09:30:00Z',
    pickedUpAt: undefined,
    deliveredAt: undefined,
    createdAt: '2026-08-30T08:00:00Z',
    updatedAt: '2026-08-30T09:30:00Z'
  },
  {
    id: 'DEL-004',
    customerName: 'Chiedza Chimurenga',
    customerPhone: '0774567890',
    customerAddress: 'Eastlea, Harare, Zimbabwe',
    itemDescription: 'Medicine - Pharmacy Order',
    status: 'pending' as const,
    retailerId: 'retailer-001',
    rider: undefined,
    assignedAt: undefined,
    pickedUpAt: undefined,
    deliveredAt: undefined,
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  }
];

export default function RetailerDashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const { deliveries, loading, error, fetchDeliveries } = useDeliveries();

  // Use mock data if no real deliveries exist
  const displayDeliveries = deliveries.length > 0 ? deliveries : MOCK_DELIVERIES;

  const handleRefresh = () => {
    fetchDeliveries();
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
  };

  // Count deliveries by status for stats
  const stats = {
    total: displayDeliveries.length,
    pending: displayDeliveries.filter(d => d.status === 'pending').length,
    assigned: displayDeliveries.filter(d => d.status === 'assigned').length,
    picked_up: displayDeliveries.filter(d => d.status === 'picked_up').length,
    delivered: displayDeliveries.filter(d => d.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🏪 Reflex Retailer</h1>
              <p className="text-sm text-gray-600">Manage your deliveries</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  showForm 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {showForm ? '✕ Close' : '📦 New Delivery'}
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
            <div className="text-xs text-gray-500">Assigned</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.picked_up}</div>
            <div className="text-xs text-gray-500">Picked Up</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-xs text-gray-500">Delivered</div>
          </div>
        </div>

        {/* Create Delivery Form */}
        {showForm && (
          <div className="mb-6">
            <DeliveryForm onClose={() => setShowForm(false)} />
          </div>
        )}

        {/* Delivery List */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">📋 Active Deliveries</h2>
            <span className="text-sm text-gray-500">
              {displayDeliveries.length} deliveries
            </span>
          </div>

          {loading && <p className="text-gray-500">Loading...</p>}

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              ❌ {error}
              <button
                onClick={handleRefresh}
                className="ml-2 text-red-700 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && displayDeliveries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p>No deliveries yet</p>
              <p className="text-sm">Click "New Delivery" to get started</p>
            </div>
          )}

          {!loading && !error && displayDeliveries.length > 0 && (
            <div className="space-y-3">
              {displayDeliveries.map((delivery) => {
                const statusColors: Record<string, string> = {
                  pending: 'bg-yellow-100 text-yellow-800',
                  assigned: 'bg-blue-100 text-blue-800',
                  picked_up: 'bg-purple-100 text-purple-800',
                  delivered: 'bg-green-100 text-green-800',
                };
                const statusLabels: Record<string, string> = {
                  pending: '🟡 Pending',
                  assigned: '🔵 Assigned',
                  picked_up: '🟣 Picked Up',
                  delivered: '🟢 Delivered',
                };
                const color = statusColors[delivery.status] || 'bg-gray-100 text-gray-800';
                const label = statusLabels[delivery.status] || delivery.status;

                return (
                  <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{delivery.customerName}</h3>
                        <p className="text-sm text-gray-600">{delivery.customerAddress}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                        {label}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>📦 {delivery.itemDescription}</p>
                      <p>📞 {delivery.customerPhone}</p>
                      {delivery.rider && <p>🛵 Rider: {delivery.rider.name}</p>}
                      {delivery.deliveredAt && (
                        <p className="text-green-600">
                          ✅ Delivered: {new Date(delivery.deliveredAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                      Order #{delivery.id.slice(0, 8)}
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