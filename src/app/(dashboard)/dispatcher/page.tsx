'use client';

import { useState, useEffect } from 'react';
import { apiRequest, getAuthToken } from '../../../lib/api-client';

interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  itemDescription: string;
  status: string;
  riderId: string | null;
}

interface Rider {
  id: string;
  name: string;
  active: boolean;
}

export default function DispatcherDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRider, setSelectedRider] = useState<{ [key: string]: string }>({});

  const riders: Rider[] = [
    { id: 'rider-001', name: 'Takudzwa Moyo', active: true },
    { id: 'rider-002', name: 'Chengetai Mupanduki', active: true },
    { id: 'rider-003', name: 'Simbarashe Mupfumira', active: true },
  ];

  // Check if user is logged in
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      console.log('🔴 No token found, redirecting to login');
      window.location.href = '/login';
    } else {
      console.log('🟢 Token found');
    }
  }, []);

  // Fetch deliveries from API
  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 Fetching deliveries...');
      const data = await apiRequest<Delivery[]>('/api/deliveries');
      console.log('✅ Deliveries fetched:', data);
      setDeliveries(data);
    } catch (error) {
      console.error('❌ Error fetching deliveries:', error);
      setError('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  // Load deliveries on mount
  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Assign rider to delivery
  const assignRider = async (deliveryId: string, riderId: string) => {
    if (!riderId) {
      alert('Please select a rider');
      return;
    }

    // Check for token before making request
    const token = getAuthToken();
    if (!token) {
      alert('You must be logged in to assign riders');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`📤 Assigning rider ${riderId} to delivery ${deliveryId}`);
      console.log(`🔑 Token exists: ${!!token}`);

      const data = await apiRequest<{ message: string; delivery: Delivery }>(
        `/api/deliveries/${deliveryId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            riderId: riderId,
            status: 'assigned'
          }),
        }
      );

      console.log('✅ Rider assigned:', data);
      alert(`✅ Rider assigned successfully!`);
      
      // Refresh the delivery list
      await fetchDeliveries();
    } catch (error) {
      console.error('❌ Failed to assign rider:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign rider';
      setError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter pending deliveries
  const pendingDeliveries = deliveries.filter(d => 
    d.status === 'pending' || d.status === 'scheduled'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">📋 Dispatcher Dashboard</h1>
              <p className="text-sm text-gray-600">Manage open requests and assign riders</p>
            </div>
            <button
              onClick={fetchDeliveries}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              disabled={loading}
            >
              {loading ? 'Loading...' : '🔄 Refresh'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">📦 Open Requests</p>
            <p className="text-2xl font-bold text-blue-600">{pendingDeliveries.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">🛵 Available Riders</p>
            <p className="text-2xl font-bold text-green-600">{riders.filter(r => r.active).length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">✅ Total Deliveries</p>
            <p className="text-2xl font-bold text-purple-600">{deliveries.length}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            ❌ {error}
            <button
              onClick={fetchDeliveries}
              className="ml-2 text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 text-gray-500">
            <p>Loading deliveries...</p>
          </div>
        )}

        {/* Delivery List */}
        {!loading && !error && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">🔄 Open Delivery Requests</h2>

            {pendingDeliveries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">📭</p>
                <p>No pending deliveries</p>
                <p className="text-sm">All deliveries have been assigned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <p className="font-semibold text-lg">{delivery.customerName}</p>
                        <p className="text-sm text-gray-600">{delivery.customerAddress}</p>
                        <p className="text-sm text-gray-600">📦 {delivery.itemDescription}</p>
                        <p className="text-sm text-gray-600">📞 {delivery.customerPhone}</p>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          ⏳ {delivery.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <select
                          className="border border-gray-300 p-2 rounded-lg text-sm w-full md:w-48"
                          value={selectedRider[delivery.id] || ''}
                          onChange={(e) => {
                            setSelectedRider(prev => ({
                              ...prev,
                              [delivery.id]: e.target.value
                            }));
                          }}
                        >
                          <option value="">Select a rider...</option>
                          {riders.map((rider) => (
                            <option key={rider.id} value={rider.id}>
                              {rider.name} {rider.active ? '✅' : '❌'}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignRider(delivery.id, selectedRider[delivery.id] || '')}
                          disabled={!selectedRider[delivery.id] || loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Assigning...' : '📤 Assign Rider'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}