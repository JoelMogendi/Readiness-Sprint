export type DeliveryStatus = "assigned" | "picked_up" | "delivered";
export type ScanType = "pickup" | "delivery";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
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
  assigned: "Assigned",
  picked_up: "Picked Up",
  delivered: "Delivered",
};
