import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    // Calculate the date 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Delete all bookings older than 3 months
    const result = await Booking.deleteMany({
      bookingDate: { $lt: threeMonthsAgo },
    });

    return NextResponse.json(
      {
        message: "Old bookings cleaned up successfully",
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to cleanup bookings" },
      { status: 500 }
    );
  }
}

// Optional: Auto-cleanup when fetching bookings
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Auto-cleanup: Delete bookings older than 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    await Booking.deleteMany({
      bookingDate: { $lt: threeMonthsAgo },
    });

    return NextResponse.json(
      { message: "Cleanup check completed" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Auto-cleanup error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to auto-cleanup" },
      { status: 500 }
    );
  }
}
