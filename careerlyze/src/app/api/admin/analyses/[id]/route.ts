import { NextRequest, NextResponse } from "next/server";
import { deleteResumeAnalysis } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await deleteResumeAnalysis(params.id);

    if (success) {
      return NextResponse.json({
        message: "Analysis deleted successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting analysis:", error);
    return NextResponse.json(
      { error: "Failed to delete analysis" },
      { status: 500 }
    );
  }
}
