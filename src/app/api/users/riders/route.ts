import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // 1. Authenticate (Only Dispatchers need to see the list of riders)
    const user = getUserFromToken(request);
    if (!user || user.role !== "DISPATCHER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // 2. Fetch all users with the RIDER role, returning only their ID and name
    const riders = await User.find({ role: "RIDER" }).select("_id name email");

    return NextResponse.json(riders, { status: 200 });
  } catch (error) {
    console.error("Fetch Riders Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}