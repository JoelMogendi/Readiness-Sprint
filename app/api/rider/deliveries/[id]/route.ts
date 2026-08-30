import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(
  process.cwd(),
  "data",
  "deliveries.json"
);

const allowedTransitions: Record<string, string> = {
  ASSIGNED: "PICKED_UP",
  PICKED_UP: "DELIVERED",
};

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();
    const requestedStatus = body.status;

    const file = fs.readFileSync(dataPath, "utf8");
    const deliveries = JSON.parse(file);

    const delivery = deliveries.find(
      (item: { id: string }) => item.id === id
    );

    if (!delivery) {
      return NextResponse.json(
        {
          error: "Delivery not found",
        },
        {
          status: 404,
        }
      );
    }

    const expectedNextStatus =
      allowedTransitions[delivery.status];

    if (requestedStatus !== expectedNextStatus) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${delivery.status} to ${requestedStatus}`,
        },
        {
          status: 409,
        }
      );
    }

    delivery.status = requestedStatus;

    fs.writeFileSync(
      dataPath,
      JSON.stringify(deliveries, null, 2)
    );

    return NextResponse.json({
      message: "Delivery status updated successfully",
      delivery,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update delivery",
      },
      {
        status: 500,
      }
    );
  }
}