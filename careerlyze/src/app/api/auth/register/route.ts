import { NextRequest, NextResponse } from "next/server";
import { hashPassword, generateToken } from "@/lib/auth-simple";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // For now, create a simple user object without database
    // In production, you would save to database
    const hashedPassword = await hashPassword(password);
    const userId = Date.now().toString(); // Simple ID generation
    const token = generateToken(userId);

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: {
        id: userId,
        email: email,
        name: name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
