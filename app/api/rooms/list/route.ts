import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");

    // Build query object
    const query: any = {};
    if (branch) {
      query.branch = branch;
    }

    const rooms = await Room.find(query).sort({
      floor: 1,
      name: 1,
    });

    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}