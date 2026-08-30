import { NextResponse } from "next/server";
import type { Delivery, DeliveryInput } from "../../types";

const deliveries: Delivery[] = [
  {
    id: "d-1001",
    customerName: "Ava Thompson",
    address: "245 Market Street, Austin",
    eta: "Today, 3:00 PM",
    status: "In Transit",
  },
  {
    id: "d-1002",
    customerName: "Marcus Lee",
    address: "87 River Avenue, Dallas",
    eta: "Tomorrow, 9:30 AM",
    status: "Scheduled",
  },
  {
    id: "d-1003",
    customerName: "Nora Patel",
    address: "23 Cedar Lane, Houston",
    eta: "Today, 7:15 PM",
    status: "Delayed",
  },
];

export async function GET() {
  return NextResponse.json(deliveries);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as DeliveryInput;
  const createdDelivery: Delivery = {
    id: crypto.randomUUID(),
    customerName: payload.customerName,
    address: payload.address,
    eta: payload.eta || "Today, 5:00 PM",
    status: payload.status || "Scheduled",
  };

  deliveries.unshift(createdDelivery);

  return NextResponse.json(createdDelivery, { status: 201 });
}
