import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, generateToken } from "@/lib/auth-simple";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // For now, create a simple user object without database
    // In production, you would check against database
    const userId = Date.now().toString(); // Simple ID generation
    const token = generateToken(userId);

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: userId,
        email: email,
        name: "User",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
