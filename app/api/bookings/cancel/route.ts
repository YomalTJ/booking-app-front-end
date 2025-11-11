// app/api/bookings/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import CompanyHours from "@/models/CompanyHours";
import { verifyToken } from "@/lib/utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Type guard to ensure decoded is JwtPayload with userId
    const userDecoded = decoded as JwtPayload & { userId: string };

    await dbConnect();

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (booking.userId.toString() !== userDecoded.userId) {
      return NextResponse.json(
        { message: "Unauthorized to cancel this booking" },
        { status: 403 }
      );
    }

    // Check if already cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { message: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // Check cancellation window based on booking date
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();

    // Calculate hours until booking starts
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Calculate hours since booking creation
    const bookingCreatedAt = new Date(booking.createdAt);
    const hoursSinceCreation =
      (now.getTime() - bookingCreatedAt.getTime()) / (1000 * 60 * 60);

    // Allow cancellation if:
    // 1. Booking is more than 24 hours away OR
    // 2. Booking was created within the last 1 hour (for immediate cancellations)
    const canCancel = hoursUntilBooking > 24 || hoursSinceCreation <= 1;

    if (!canCancel) {
      return NextResponse.json(
        {
          message:
            "Bookings within 24 hours can only be cancelled within 1 hour of creation",
          details: {
            hoursUntilBooking: Math.round(hoursUntilBooking * 100) / 100,
            hoursSinceCreation: Math.round(hoursSinceCreation * 100) / 100,
            cancellationDeadline:
              "24 hours before booking or within 1 hour of creation",
          },
        },
        { status: 400 }
      );
    }

    // Refund hours if it's an hour-based booking
    let hoursRefunded = 0;
    let companyHoursUpdated = null;

    if (
      booking.isHourBasedBooking &&
      booking.hoursUsed > 0 &&
      booking.companyName
    ) {
      console.log("Processing hour-based booking refund:", {
        bookingId: booking._id,
        hoursUsed: booking.hoursUsed,
        companyName: booking.companyName,
      });

      const companyHours = await CompanyHours.findOne({
        companyName: booking.companyName,
      });

      if (companyHours) {
        const previousUsedHours = companyHours.usedHours;
        const previousRemainingHours =
          companyHours.totalHours - companyHours.usedHours;

        // Refund the hours by reducing usedHours
        companyHours.usedHours = Math.max(
          0,
          companyHours.usedHours - booking.hoursUsed
        );

        // Add refund transaction
        companyHours.transactions.push({
          type: "refund",
          hours: booking.hoursUsed,
          description: `Refund for cancelled booking on ${
            booking.bookingDate.toISOString().split("T")[0]
          } (${booking.startTime}-${booking.endTime})`,
          bookingId: booking._id,
          createdAt: new Date(),
        });

        await companyHours.save();

        hoursRefunded = booking.hoursUsed;

        const newRemainingHours =
          companyHours.totalHours - companyHours.usedHours;

        companyHoursUpdated = {
          previousUsedHours,
          newUsedHours: companyHours.usedHours,
          previousRemainingHours,
          newRemainingHours,
          totalHours: companyHours.totalHours,
        };

        console.log("Hours refunded successfully:", {
          bookingId: booking._id,
          hoursRefunded,
          companyName: booking.companyName,
          previousUsedHours,
          newUsedHours: companyHours.usedHours,
          previousRemainingHours,
          newRemainingHours,
          totalHours: companyHours.totalHours,
        });
      } else {
        console.warn(
          "CompanyHours not found for company:",
          booking.companyName
        );
      }
    }

    // Update booking status
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    // Populate booking details for response
    const cancelledBooking = await Booking.findById(booking._id)
      .populate("userId", "name email companyName")
      .populate("roomId", "name floor description capacity");

    console.log("Booking cancelled successfully:", {
      bookingId: booking._id,
      hoursRefunded,
      cancelledBy: userDecoded.userId,
      cancellationTime: new Date().toISOString(),
      companyHoursUpdated,
    });

    return NextResponse.json(
      {
        message: "Booking cancelled successfully",
        hoursRefunded,
        booking: cancelledBooking,
        companyHoursUpdated,
        cancellationDetails: {
          cancelledAt: new Date(),
          hoursUntilBooking: Math.round(hoursUntilBooking * 100) / 100,
          hoursSinceCreation: Math.round(hoursSinceCreation * 100) / 100,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Booking cancellation error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
