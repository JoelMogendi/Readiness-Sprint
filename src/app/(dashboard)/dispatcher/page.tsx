'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Delivery } from '@/app/types';

// Define the Rider type based on our API response
type Rider = {
  _id: string;
  name: string;
  email: string;
};

export default function DispatcherDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run both fetches in parallel for better performance
        const [deliveriesData, ridersData] = await Promise.all([
          apiClient.getDeliveries(),
          apiClient.getRiders(),
        ]);
        
        setDeliveries(deliveriesData);
        setRiders(ridersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle assigning a rider to a delivery
  const handleAssignRider = async (deliveryId: string, riderId: string) => {
    if (!riderId) return;
    
    try {
      const updatedDelivery = await apiClient.updateDelivery(deliveryId, { 
        riderId,
        status: 'SCHEDULED' // Ensure status is correctly set when assigning
      });

      // Update the local state so the UI reflects the change immediately
      setDeliveries((prev) => 
        prev.map((d) => (d.id === deliveryId ? updatedDelivery : d))
      );
    } catch (err) {
      alert('Failed to assign rider. Please try again.');
    }
  };

  if (loading) return <div className="p-8 text-zinc-400">Loading dispatcher dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  // Filter for deliveries that haven't been completed
  const activeDeliveries = deliveries.filter(d => d.status !== 'DELIVERED');

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Dispatcher Dashboard</h1>
        <p className="text-zinc-400">Manage open requests and assign riders.</p>
      </header>

      <div className="grid gap-4">
        {activeDeliveries.length === 0 ? (
          <div className="p-8 border border-zinc-800 rounded-lg text-center text-zinc-500">
            No active delivery requests at the moment.
          </div>
        ) : (
          activeDeliveries.map((delivery) => (
            <div 
              key={delivery.id} 
              className="p-6 border border-zinc-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-lg">{delivery.customerName}</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300">
                    {delivery.status}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm mb-1">📍 {delivery.customerAddress}</p>
                <p className="text-zinc-400 text-sm">📦 {delivery.itemDescription}</p>
              </div>

              <div className="flex flex-col gap-2 min-w-[200px]">
                <label className="text-xs text-zinc-500 uppercase tracking-wider">
                  Assign Rider
                </label>
                <select
                  className="bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={delivery.riderId || ''}
                  onChange={(e) => handleAssignRider(delivery.id, e.target.value)}
                >
                  <option value="">Select a rider...</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}