"use client";

import { Check, CheckCircle2, MapPin, Package, Phone } from "lucide-react";
import { confirmScan } from "../lib/api";
import { STATUS_LABELS } from "../types";
import type { DeliveryStatus, Order, ScanType } from "../types";
import { useEffect, useState } from "react";

const steps: DeliveryStatus[] = ["assigned", "picked_up", "delivered"];

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  return `${diffHr}h ago`;
}

export default function OrderCard({
  order,
  onOrder,
  onMessage,
}: {
  order: Order;
  onOrder: (order: Order) => void;
  onMessage: (type: "success" | "error", text: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  // Re-render every 30s so the relative timestamp stays fresh without a refresh.
  const [, forceTick] = useState(0);
  const current = steps.indexOf(order.status);

  useEffect(() => {
    const id = window.setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  async function confirm(type: ScanType) {
    setBusy(true);
    const result = await confirmScan(order.id, type);
    setBusy(false);

    if (!result.success || !result.order) {
      onMessage("error", result.message);
      return;
    }

    onOrder(result.order);
    onMessage("success", result.message);
  }

  return (
    <div className="order-card">
      <div className="order-head">
        <div><span>02</span><h2>Delivery</h2></div>
        <b className={`status ${order.status}`}>{STATUS_LABELS[order.status]}</b>
      </div>

      <div className="order-id-row">
        <div className="order-id">{order.id}</div>
        <span className="updated">Updated {relativeTime(order.updatedAt)}</span>
      </div>

      <div className="customer">
        <div className="avatar">{order.customerName[0]}</div>
        <div>
          <strong>{order.customerName}</strong>
          <a href={`tel:${order.phone}`}><Phone size={12} /> {order.phone}</a>
        </div>
      </div>

      <div className="facts">
        <div><MapPin size={16} /> {order.address}</div>
        <div><Package size={16} /> {order.itemDescription}</div>
      </div>

      <div className="timeline">
        {steps.map((step, i) => (
          <div
            key={step}
            className={[i <= current ? "active" : "", i === current ? "current" : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="step">{i < current ? <Check size={12} /> : i + 1}</div>
            <div>
              <strong>{STATUS_LABELS[step]}</strong>
              <small>
                {step === "assigned" && "Order assigned to rider"}
                {step === "picked_up" && "Package collected"}
                {step === "delivered" && "Customer received package"}
              </small>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button
          className="action"
          disabled={busy || order.status !== "assigned"}
          onClick={() => void confirm("pickup")}
        >
          <Package size={16} /> Confirm pickup
        </button>
        <button
          className="action"
          disabled={busy || order.status !== "picked_up"}
          onClick={() => void confirm("delivery")}
        >
          <CheckCircle2 size={16} /> Confirm delivery
        </button>
      </div>

      {order.status === "delivered" && (
        <div className="complete"><CheckCircle2 size={16} /> Delivery complete and synchronized.</div>
      )}
    </div>
  );
}
