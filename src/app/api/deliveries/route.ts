import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "deliveries.json");

// Define allowed status transitions
const allowedTransitions: Record<string, string> = {
  'pending': 'assigned',
  'scheduled': 'assigned',  // If you use 'scheduled'
  'assigned': 'picked_up',
  'picked_up': 'delivered',
  'delivered': 'delivered',
};

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status: requestedStatus, riderId } = body;

    console.log(`📝 Updating delivery ${id}:`, { requestedStatus, riderId });

    // Read deliveries from file
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: "Deliveries data file not found" },
        { status: 500 }
      );
    }

    const file = fs.readFileSync(dataPath, "utf8");
    const deliveries = JSON.parse(file);
    const deliveryIndex = deliveries.findIndex((item: any) => item.id === id);

    if (deliveryIndex === -1) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    const delivery = deliveries[deliveryIndex];

    // Assign rider
    if (riderId !== undefined) {
      delivery.riderId = riderId;
      console.log(`✅ Assigned rider ${riderId} to delivery ${id}`);
    }

    // Update status
    if (requestedStatus) {
      // Check if transition is valid
      const expectedNextStatus = allowedTransitions[delivery.status];
      if (requestedStatus !== expectedNextStatus && delivery.status !== 'delivered') {
        return NextResponse.json(
          { 
            error: `Invalid status transition from ${delivery.status} to ${requestedStatus}`,
            expected: expectedNextStatus
          },
          { status: 409 }
        );
      }
      delivery.status = requestedStatus;
    }

    // Add timestamps
    if (delivery.status === 'picked_up') {
      delivery.pickedUpAt = new Date().toISOString();
    }
    if (delivery.status === 'delivered') {
      delivery.deliveredAt = new Date().toISOString();
    }

    delivery.updatedAt = new Date().toISOString();

    // Save back to file
    deliveries[deliveryIndex] = delivery;
    fs.writeFileSync(dataPath, JSON.stringify(deliveries, null, 2));

    console.log(`✅ Delivery ${id} updated successfully`);

    return NextResponse.json({
      message: "Delivery updated successfully",
      delivery,
    });
  } catch (error) {
    console.error("❌ Error updating delivery:", error);
    return NextResponse.json(
      { error: "Unable to update delivery" },
      { status: 500 }
    );
  }
}

// GET a single delivery
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: "Deliveries data file not found" },
        { status: 500 }
      );
    }

    const file = fs.readFileSync(dataPath, "utf8");
    const deliveries = JSON.parse(file);
    const delivery = deliveries.find((item: any) => item.id === id);

    if (!delivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ delivery });
  } catch (error) {
    console.error("❌ Error fetching delivery:", error);
    return NextResponse.json(
      { error: "Unable to fetch delivery" },
      { status: 500 }
    );
  }
}