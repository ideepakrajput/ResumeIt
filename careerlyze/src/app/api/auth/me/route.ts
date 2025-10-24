import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-simple";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // For now, return a simple user object
    // In production, you would fetch from database
    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: "user@example.com",
        name: "User",
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
