import type { Delivery } from "../../types";
import { DeliveryCard } from "./DeliveryCard";

export function DeliveryList({ deliveries }: { deliveries: Delivery[] }) {
  return (
    <div className="space-y-4">
      {deliveries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          No deliveries scheduled yet.
        </p>
      ) : (
        deliveries.map((delivery) => (
          <DeliveryCard key={delivery.id} delivery={delivery} />
        ))
      )}
    </div>
  );
}
