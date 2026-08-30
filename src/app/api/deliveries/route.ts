import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Delivery } from "@/models/Delivery";
import { createDeliverySchema } from "@/lib/validation";
import { getUserFromToken } from "@/lib/auth";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // 1. Authenticate the user
    const user = getUserFromToken(request);
    if (!user || user.role !== "RETAILER") {
      return NextResponse.json({ message: "Unauthorized. Only retailers can create deliveries." }, { status: 403 });
    }

    const body = await request.json();

    // 2. Validate incoming payload using Zod
    const parsedData = createDeliverySchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: "Validation failed" , details: z.treeifyError(parsedData.error) });
    }

    // 3. Save to database
    const newDelivery = await Delivery.create({
      ...parsedData.data,
      retailerId: user.userId, // Automatically link the delivery to the logged-in retailer
      status: "SCHEDULED", // Default status defined in our model
    });

    return NextResponse.json(newDelivery, { status: 201 });
  } catch (error) {
    console.error("Create Delivery Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // 1. Authenticate the user
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let deliveries;

    // 2. Role-based data fetching
    if (user.role === "RETAILER") {
      // Retailers only see their own deliveries
      deliveries = await Delivery.find({ retailerId: user.userId }).sort({ createdAt: -1 });
    } else if (user.role === "DISPATCHER") {
      // Dispatchers see all deliveries, and we populate the rider details if assigned
      deliveries = await Delivery.find()
        .populate("riderId", "name phone") // Pulls the rider's name from the Users collection
        .sort({ createdAt: -1 });
    } else {
      // Riders see deliveries assigned to them
      deliveries = await Delivery.find({ riderId: user.userId }).sort({ createdAt: -1 });
    }

    return NextResponse.json(deliveries, { status: 200 });
  } catch (error) {
    console.error("Fetch Deliveries Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}