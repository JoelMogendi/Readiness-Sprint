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
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 text-zinc-100">📦 New Delivery Request</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-400">
              Customer Name *
            </label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-zinc-100 transition-all"
              placeholder="e.g., Irene Dzingai"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-400">
              Customer Phone *
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-zinc-100 transition-all"
              placeholder="e.g., 0774248564"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-zinc-400">
            Delivery Address *
          </label>
          <input
            type="text"
            name="customerAddress"
            value={form.customerAddress}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-zinc-100 transition-all"
            placeholder="e.g., Harare CBD, Zimbabwe"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-zinc-400">
            Item Description *
          </label>
          <textarea
            name="itemDescription"
            value={form.itemDescription}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-zinc-100 transition-all resize-none"
            placeholder="Describe the item being delivered..."
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-zinc-50 text-zinc-950 font-medium py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Schedule Delivery'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-zinc-800 text-zinc-300 font-medium py-3 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}