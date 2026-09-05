'use client';

import { useState, useEffect } from 'react';
import { useDeliveries } from '../../context/DeliveryContext';

export default function DispatcherDashboard() {
  const { deliveries, loading, fetchDeliveries } = useDeliveries();
  const [riderList] = useState([
    { id: 'rider-001', name: 'Takudzwa Moyo', active: true },
    { id: 'rider-002', name: 'Chengetai Mupanduki', active: true },
    { id: 'rider-003', name: 'Simbarashe Mupfumira', active: true },
  ]);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending');

  const handleAssign = (deliveryId: string, riderId: string) => {
    const rider = riderList.find(r => r.id === riderId);
    alert(`✅ Delivery ${deliveryId} assigned to ${rider?.name}`);
    
    // In a real app, call API to assign rider
    // For now, just show the assignment
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">📋 Dispatcher Dashboard</h1>
        <p className="text-sm text-gray-600">Assign riders to delivery requests</p>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">🔄 Open Requests</p>
            <p className="text-2xl font-bold">{pendingDeliveries.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">🛵 Available Riders</p>
            <p className="text-2xl font-bold">{riderList.filter(r => r.active).length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">✅ Today's Assignments</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">🔄 Open Delivery Requests</h2>

        {loading && <p>Loading...</p>}

        {pendingDeliveries.length === 0 ? (
          <div className="bg-white p-8 text-center text-gray-500 rounded-lg border">
            <p className="text-4xl mb-2">📭</p>
            <p>No pending deliveries</p>
            <p className="text-sm">Retailers haven't created any deliveries yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white border p-4 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-semibold">{delivery.customerName}</p>
                    <p className="text-sm text-gray-600">{delivery.customerAddress}</p>
                    <p className="text-sm">📦 {delivery.itemDescription}</p>
                    <p className="text-sm">📞 {delivery.customerPhone}</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <select
                      className="border p-2 rounded text-sm w-full md:w-48"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssign(delivery.id, e.target.value);
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">Assign Rider...</option>
                      {riderList.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} {!r.active ? '(Busy)' : '✅ Available'}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs bg-yellow-100 text-yellow-800 p-1 rounded text-center">
                      ⏳ Pending Assignment
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}