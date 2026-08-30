'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { apiClient } from "../lib/api";
import { socketService } from "../lib/socket";
import type { Delivery, DeliveryInput } from "../types";

type DeliveryContextValue = {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
  fetchDeliveries: () => Promise<void>;
  createDelivery: (data: DeliveryInput) => Promise<Delivery>;
  updateDelivery: (delivery: Delivery) => void;
};

const DeliveryContext = createContext<DeliveryContextValue | undefined>(
  undefined
);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retailerId, setRetailerId] = useState<string | null>(null);

  // Get retailer ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRetailerId(localStorage.getItem("userId"));
    }
  }, []);

  // Fetch deliveries
  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getDeliveries();
      setDeliveries(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch deliveries"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Create delivery
  const createDelivery = useCallback(
    async (data: DeliveryInput) => {
      try {
        const newDelivery = await apiClient.createDelivery(data);
        setDeliveries((prev) => [newDelivery, ...prev]);
        return newDelivery;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create delivery"
        );
        throw err;
      }
    },
    []
  );

  // Update a single delivery (for real-time updates)
  const updateDelivery = useCallback((updatedDelivery: Delivery) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === updatedDelivery.id ? updatedDelivery : d))
    );
  }, []);

  // Set up WebSocket connection
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && retailerId) {
      socketService.connect(token);
      socketService.subscribeToRetailerDeliveries(retailerId, updateDelivery);
    }

    return () => {
      socketService.unsubscribe();
      socketService.disconnect();
    };
  }, [retailerId, updateDelivery]);

  // Initial fetch
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        loading,
        error,
        fetchDeliveries,
        createDelivery,
        updateDelivery,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDeliveries() {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error("useDeliveries must be used within a DeliveryProvider");
  }
  return context;
}