import { CURRENT_RIDER_ID, orders } from "./mockData";
import type { ScanResponse, ScanType } from "../types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function findOrder(rawCode: string): Promise<ScanResponse> {
  await delay();

  const code = rawCode.trim().toUpperCase();
  const order = orders.find(
    (item) =>
      item.id.toUpperCase() === code ||
      item.id.replace(/\D/g, "") === code.replace(/\D/g, "")
  );

  if (!order) return { success: false, message: `No order found for "${rawCode}".` };

  if (order.riderId !== CURRENT_RIDER_ID) {
    return { success: false, message: "This order is not assigned to you." };
  }

  return { success: true, order: { ...order }, message: `Order ${order.id} loaded.` };
}

export async function confirmScan(
  orderId: string,
  scanType: ScanType
): Promise<ScanResponse> {
  await delay();

  const order = orders.find((item) => item.id === orderId);
  if (!order) return { success: false, message: "Order no longer exists." };

  if (order.riderId !== CURRENT_RIDER_ID) {
    return { success: false, message: "This order is not assigned to you." };
  }

  if (scanType === "pickup" && order.status !== "assigned") {
    return {
      success: false,
      message: `Pickup cannot be confirmed from "${order.status}".`,
    };
  }

  if (scanType === "delivery" && order.status !== "picked_up") {
    return {
      success: false,
      message: `Delivery cannot be confirmed from "${order.status}".`,
    };
  }

  order.status = scanType === "pickup" ? "picked_up" : "delivered";
  order.updatedAt = new Date().toISOString();

  return {
    success: true,
    order: { ...order },
    message: scanType === "pickup" ? "Pickup confirmed." : "Delivery confirmed.",
  };
}
