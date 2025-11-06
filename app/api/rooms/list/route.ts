import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const rooms = await Room.find({ availability: true }).sort({
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
