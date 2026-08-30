import type { Delivery } from "../../types";
import { DeliveryCard } from "./DeliveryCard";

export function DeliveryList({ deliveries }: { deliveries: Delivery[] }) {
  return (
    <div className="space-y-4">
      {deliveries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 p-12 text-center text-zinc-500">
          <p className="text-lg">No deliveries found.</p>
        </div>
      ) : (
        deliveries.map((delivery) => (
          <DeliveryCard key={delivery.id} delivery={delivery} />
        ))
      )}
    </div>
  );
}