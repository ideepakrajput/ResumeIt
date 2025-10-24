import { NextRequest, NextResponse } from "next/server";
import { getUserResumeAnalyses } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analyses = await getUserResumeAnalyses(userId, 20, 0);

    return NextResponse.json({
      analyses,
    });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
