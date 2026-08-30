"use client";

import { useEffect, useState } from "react";

type DeliveryStatus =
  | "ASSIGNED"
  | "PICKED_UP"
  | "DELIVERED";

type Delivery = {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  itemDescription: string;
  status: DeliveryStatus;
};

const statusLabels: Record<
  DeliveryStatus,
  string
> = {
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked Up",
  DELIVERED: "Delivered",
};

export default function RiderPage() {
  const [deliveries, setDeliveries] = useState<
    Delivery[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadDeliveries() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/rider/deliveries"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load deliveries"
        );
      }

      const data = await response.json();

      setDeliveries(data.deliveries ?? []);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to load your deliveries."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeliveries();
  }, []);

  async function updateStatus(
    id: string,
    nextStatus: DeliveryStatus
  ) {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(
        `/api/rider/deliveries/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update status"
        );
      }

      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === id
            ? {
                ...delivery,
                status: nextStatus,
              }
            : delivery
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update delivery."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function getNextStatus(
    status: DeliveryStatus
  ) {
    if (status === "ASSIGNED") {
      return "PICKED_UP";
    }

    if (status === "PICKED_UP") {
      return "DELIVERED";
    }

    return null;
  }

  function getButtonText(
    status: DeliveryStatus
  ) {
    if (status === "ASSIGNED") {
      return "Mark as Picked Up";
    }

    if (status === "PICKED_UP") {
      return "Mark as Delivered";
    }

    return "Delivery Complete";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-bold tracking-widest text-blue-600">
            REFLEX
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Rider Dashboard
              </h1>

              <p className="mt-2 text-slate-600">
                Manage your assigned deliveries
                and keep customers informed.
              </p>
            </div>

            <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Rider
              </p>

              <p className="font-semibold text-slate-900">
                Rider 001
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">
              Loading assigned deliveries...
            </p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No deliveries assigned
            </h2>

            <p className="mt-2 text-slate-500">
              New assignments will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">
                  Total Deliveries
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {deliveries.length}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">
                  In Progress
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {
                    deliveries.filter(
                      (delivery) =>
                        delivery.status !==
                        "DELIVERED"
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {
                    deliveries.filter(
                      (delivery) =>
                        delivery.status ===
                        "DELIVERED"
                    ).length
                  }
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {deliveries.map((delivery) => {
                const nextStatus =
                  getNextStatus(
                    delivery.status
                  );

                const isUpdating =
                  updatingId === delivery.id;

                return (
                  <article
                    key={delivery.id}
                    className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          Delivery #{delivery.id}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                          {delivery.customerName}
                        </h2>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          delivery.status ===
                          "ASSIGNED"
                            ? "bg-yellow-100 text-yellow-800"
                            : delivery.status ===
                              "PICKED_UP"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {
                          statusLabels[
                            delivery.status
                          ]
                        }
                      </span>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Customer Phone
                        </p>

                        <p className="mt-1 text-slate-900">
                          {delivery.customerPhone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Delivery Address
                        </p>

                        <p className="mt-1 text-slate-900">
                          {delivery.address}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Item
                        </p>

                        <p className="mt-1 text-slate-900">
                          {
                            delivery.itemDescription
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      {nextStatus ? (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(
                              delivery.id,
                              nextStatus
                            )
                          }
                          className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdating
                            ? "Updating..."
                            : getButtonText(
                                delivery.status
                              )}
                        </button>
                      ) : (
                        <div className="rounded-lg bg-green-50 px-4 py-3 text-center font-semibold text-green-700">
                          ✓ Delivery Complete
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}