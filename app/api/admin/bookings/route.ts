import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetch all bookings with user and room details
    const bookings = await Booking.find()
      .populate("userId", "name email companyName")
      .populate("roomId", "name floor")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
