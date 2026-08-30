"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import Scanner from "./components/Scanner";
import OrderCard from "./components/OrderCard";
import type { Order } from "./types";

export default function ScannerPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function message(type: "success" | "error", text: string) {
    setNotice({ type, text });
    window.setTimeout(() => setNotice(null), 3200);
  }

  return (
    <main className="sync-page">
      <section className="sync-hero">
        <div>
          <p>RIDER WORKSPACE</p>
          <h1>Scan. Confirm.<br /><em>Keep delivery moving.</em></h1>
          <span>Retrieve an assigned order, confirm pickup, then confirm delivery.</span>
        </div>
        <div className="flow">
          <small>DELIVERY FLOW</small>
          <strong>Assigned → Picked Up → Delivered</strong>
        </div>
      </section>

      <section className="sync-grid">
        <Scanner onOrder={setOrder} onMessage={message} />
        {order ? (
          <OrderCard order={order} onOrder={setOrder} onMessage={message} />
        ) : (
          <div className="empty-order">
            <div>02</div>
            <h2>No delivery selected</h2>
            <p>Scan a package or enter an order code to retrieve the rider&apos;s assigned delivery.</p>
          </div>
        )}
      </section>

      <section className="handoff">
        <span />
        <div>
          <strong>Integration boundary</strong>
          <p>
            Scanner UI calls <code>findOrder()</code> and <code>confirmScan()</code>.
            The backend teammate can replace those implementations with real API calls
            without rewriting the UI.
          </p>
        </div>
      </section>

      {notice && (
        <div className={`notice ${notice.type}`}>
          {notice.type === "success" ? <CheckCircle2 size={16} /> : <X size={16} />}
          {notice.text}
        </div>
      )}
    </main>
  );
}
