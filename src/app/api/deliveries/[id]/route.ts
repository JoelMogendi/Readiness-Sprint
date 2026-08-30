import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Delivery } from "@/models/Delivery";
import { updateDeliverySchema } from "@/lib/validation";
import { getUserFromToken } from "@/lib/auth";
import { z } from "zod";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "DISPATCHER" && user.role !== "RIDER") {
      return NextResponse.json({ message: "Forbidden. Only Dispatchers or Riders can update deliveries." }, { status: 403 });
    }

    const body = await request.json();
    const parsedData = updateDeliverySchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: "Failed", details: z.treeifyError(parsedData.error) }, { status: 400 });
    }

    const { status, riderId, dispatcherId } = parsedData.data;
    const updateFields: Record<string, unknown> = {};

    if (status) {
      updateFields.status = status;
      if (status === "IN_TRANSIT") updateFields.pickedUpAt = new Date();
      if (status === "DELIVERED") updateFields.deliveredAt = new Date();
    }

    if (riderId) {
      updateFields.riderId = riderId;
      updateFields.assignedAt = new Date();
    }

    if (dispatcherId) {
      updateFields.dispatcherId = dispatcherId;
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).populate("riderId", "name phone");

    if (!updatedDelivery) {
      return NextResponse.json({ message: "Delivery not found" }, { status: 404 });
    }

    return NextResponse.json(updatedDelivery, { status: 200 });
  } catch (error) {
    console.error("Update Delivery Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const user = getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const delivery = await Delivery.findById(id).populate("riderId", "name phone");

    if (!delivery) {
      return NextResponse.json({ message: "Delivery not found" }, { status: 404 });
    }

    return NextResponse.json(delivery, { status: 200 });
  } catch (error) {
    console.error("Get Single Delivery Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}