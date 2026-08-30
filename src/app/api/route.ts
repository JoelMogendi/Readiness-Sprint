import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(
  process.cwd(),
  "data",
  "deliveries.json"
);

export async function GET() {
  try {
    const file = fs.readFileSync(dataPath, "utf8");
    const deliveries = JSON.parse(file);

    const riderId = "rider-001";

    const riderDeliveries = deliveries.filter(
      (delivery: { riderId: string }) =>
        delivery.riderId === riderId
    );

    return NextResponse.json({
      deliveries: riderDeliveries,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to load deliveries",
      },
      {
        status: 500,
      }
    );
  }
}