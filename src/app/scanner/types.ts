// Field names (customerPhone, customerAddress) and the DeliveryStatus union
// are aligned to match the shared Delivery type in src/app/types/index.ts
// (Faith's retailer dashboard). "pending" is included for type compatibility
// even though the scanner flow never produces or expects it — a rider only
// ever sees orders that are already assigned.

export type DeliveryStatus = "pending" | "assigned" | "picked_up" | "delivered";
export type ScanType = "pickup" | "delivery";

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  itemDescription: string;
  status: DeliveryStatus;
  riderId: string;
  updatedAt: string;
}

export interface ScanResponse {
  success: boolean;
  order?: Order;
  message: string;
}

export const STATUS_LABELS: Record<DeliveryStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  picked_up: "Picked Up",
  delivered: "Delivered",
};
