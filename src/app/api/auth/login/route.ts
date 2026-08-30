import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_only";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // 1. Validate incoming data
    const parsedData = loginSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    const { email, password } = parsedData.data;

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // 4. Generate the JWT Token (Why: To securely identify the user in subsequent requests)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // 5. Return token and user data (excluding password)
    return NextResponse.json(
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}