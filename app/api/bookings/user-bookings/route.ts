import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token) as any;

    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // AUTO-CLEANUP: Delete bookings older than 3 months (for all users)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const cleanupResult = await Booking.deleteMany({
      bookingDate: { $lt: threeMonthsAgo },
    });

    console.log(
      `Auto-cleanup: Deleted ${cleanupResult.deletedCount} old bookings`
    );

    // Fetch user bookings with room details (only non-deleted ones)
    const bookings = await Booking.find({
      userId: decoded.userId,
      status: { $in: ["active", "completed", "cancelled"] },
    })
      .populate("roomId")
      .sort({ bookingDate: -1 });

    return NextResponse.json(
      {
        bookings,
        cleanedUp: cleanupResult.deletedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
