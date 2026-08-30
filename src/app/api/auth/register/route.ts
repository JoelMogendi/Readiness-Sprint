import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // 1. Validate incoming data
    const parsedData = registerSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error:"Validation failed", details: z.treeifyError(parsedData.error) }, { status: 400 });
    }

    const { name, email, password, role } = parsedData.data;

    // 2. Check if user already exists (Why: Prevents duplicate email crashes)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    // 3. Hash the password (Why: Never store plain-text passwords in the DB for security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}