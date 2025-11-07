import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Room from "@/models/Room";
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

    // Get counts
    const [
      totalUsers,
      totalRooms,
      totalBookings,
      availableRooms,
      activeBookings,
      completedBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Room.countDocuments(),
      Booking.countDocuments(),
      Room.countDocuments({ availability: true }),
      Booking.countDocuments({ status: "active" }),
      Booking.countDocuments({ status: "completed" }),
    ]);

    const stats = {
      totalUsers,
      totalRooms,
      totalBookings,
      availableRooms,
      activeBookings,
      completedBookings,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error: any) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
