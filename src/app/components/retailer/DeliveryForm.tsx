'use client';

import { useState } from 'react';
import { useDeliveries } from '../../context/DeliveryContext';
import type { DeliveryInput } from '../../types';

interface DeliveryFormProps {
  onClose?: () => void;
}

export function DeliveryForm({ onClose }: DeliveryFormProps) {
  const { createDelivery } = useDeliveries();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<DeliveryInput>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    itemDescription: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!form.customerName.trim() || !form.customerPhone.trim() || 
        !form.customerAddress.trim() || !form.itemDescription.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createDelivery(form);
      setForm({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        itemDescription: '',
      });
      if (onClose) onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">📦 New Delivery Request</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Customer Name *
          </label>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="e.g., Irene Dzingai"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Customer Phone *
          </label>
          <input
            type="tel"
            name="customerPhone"
            value={form.customerPhone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="e.g., 0774248564"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Delivery Address *
          </label>
          <input
            type="text"
            name="customerAddress"
            value={form.customerAddress}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="e.g., Harare CBD, Zimbabwe"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Item Description *
          </label>
          <textarea
            name="itemDescription"
            value={form.itemDescription}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Describe the item being delivered..."
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : '📤 Schedule Delivery'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}