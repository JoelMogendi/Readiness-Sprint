import type { Order } from "../types";

export const CURRENT_RIDER_ID = "rider-01";

export const orders: Order[] = [
  {
    id: "RX-1042",
    customerName: "John Kamau",
    phone: "+254 712 345 678",
    address: "Westlands, Nairobi",
    itemDescription: "2 electronics items",
    status: "assigned",
    riderId: CURRENT_RIDER_ID,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "RX-1043",
    customerName: "Mary Wanjiku",
    phone: "+254 723 111 222",
    address: "Kilimani, Nairobi",
    itemDescription: "1 pharmacy order",
    status: "picked_up",
    riderId: CURRENT_RIDER_ID,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "RX-1044",
    customerName: "Brian Otieno",
    phone: "+254 701 555 999",
    address: "Karen, Nairobi",
    itemDescription: "2 hardware items",
    status: "delivered",
    riderId: CURRENT_RIDER_ID,
    updatedAt: new Date().toISOString(),
  },
];
