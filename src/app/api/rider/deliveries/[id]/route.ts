import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "deliveries.json");

// Define allowed status transitions
const allowedTransitions: Record<string, string> = {
  'pending': 'assigned',
  'assigned': 'picked_up',
  'picked_up': 'delivered',
  'delivered': 'delivered', // Final state - no further transitions
};

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status: requestedStatus, riderId } = body;

    // Read existing deliveries
    const file = fs.readFileSync(dataPath, "utf8");
    const deliveries = JSON.parse(file);
    const delivery = deliveries.find((item: { id: string }) => item.id === id);

    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    // Rider assignment: separate from status state machine
    if (riderId !== undefined) {
      delivery.riderId = riderId;
      if (requestedStatus) delivery.status = requestedStatus; // e.g. 'assigned'
    } else if (requestedStatus) {
      // Normal status-only transition still enforces the state machine
      const expectedNextStatus = allowedTransitions[delivery.status];
      if (requestedStatus !== expectedNextStatus) {
        return NextResponse.json(
          { error: `Invalid status transition from ${delivery.status} to ${requestedStatus}` },
          { status: 409 }
        );
      }
      delivery.status = requestedStatus;
    }

    // Add timestamp for tracking
    if (delivery.status === 'picked_up') {
      delivery.pickedUpAt = new Date().toISOString();
    }
    if (delivery.status === 'delivered') {
      delivery.deliveredAt = new Date().toISOString();
    }

    delivery.updatedAt = new Date().toISOString();

    // Save back to file
    fs.writeFileSync(dataPath, JSON.stringify(deliveries, null, 2));

    return NextResponse.json({
      message: "Delivery updated successfully",
      delivery,
    });
  } catch (error) {
    console.error("❌ Error updating delivery:", error);
    return NextResponse.json({ error: "Unable to update delivery" }, { status: 500 });
  }
}