import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/utils/jwt";

export async function PUT(request: NextRequest) {
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

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Please provide booking ID" },
        { status: 400 }
      );
    }

    // Find booking and verify ownership
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.userId.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { message: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // NEW LOGIC: Check cancellation window based on booking date
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();

    // Calculate hours until booking starts
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Allow cancellation if:
    // 1. Booking is more than 24 hours away OR
    // 2. Booking was created within the last 1 hour (for immediate cancellations)
    const bookingCreatedAt = new Date(booking.createdAt);
    const hoursSinceCreation =
      (now.getTime() - bookingCreatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking <= 24 && hoursSinceCreation > 1) {
      return NextResponse.json(
        {
          message:
            "Bookings within 24 hours can only be cancelled within 1 hour of creation",
        },
        { status: 400 }
      );
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    return NextResponse.json(
      {
        message: "Booking cancelled successfully",
        booking,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
