import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { checkTimeSlotAvailability } from "@/lib/utils/availability";
import { verifyToken } from "@/lib/utils/jwt";

// Business hours constants - MUST match frontend
const BUSINESS_OPEN = "08:00";
const BUSINESS_CLOSE = "18:00";

export async function POST(request: NextRequest) {
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

    const { roomId, bookingDate, startTime, endTime, isFullDayBooking, notes } =
      await request.json();

    if (!roomId || !bookingDate) {
      return NextResponse.json(
        { message: "Please provide room ID and booking date" },
        { status: 400 }
      );
    }

    // Parse booking date (YYYY-MM-DD format) to UTC
    let dateObj: Date;
    if (typeof bookingDate === "string") {
      const [yearStr, monthStr, dayStr] = bookingDate.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      // Create UTC date at midnight
      dateObj = new Date(Date.UTC(year, month - 1, day));
    } else {
      dateObj = new Date(bookingDate);
    }

    // CRITICAL: Determine actual start and end times based on full day booking
    // For full day bookings, ALWAYS use business hours (08:00 - 18:00)
    // Ignore any 00:00 or 23:59 values from frontend
    let actualStartTime: string;
    let actualEndTime: string;

    if (isFullDayBooking) {
      // Full day booking MUST use business hours
      actualStartTime = BUSINESS_OPEN;
      actualEndTime = BUSINESS_CLOSE;

      console.log("Full day booking detected - using business hours:", {
        actualStartTime,
        actualEndTime,
      });
    } else {
      // Regular booking - use provided times
      if (!startTime || !endTime) {
        return NextResponse.json(
          {
            message:
              "Please provide start time and end time for custom bookings",
          },
          { status: 400 }
        );
      }
      actualStartTime = startTime;
      actualEndTime = endTime;

      console.log("Custom time slot booking:", {
        actualStartTime,
        actualEndTime,
      });
    }

    // Validate times are in business hours format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(actualStartTime) || !timeRegex.test(actualEndTime)) {
      return NextResponse.json(
        { message: "Invalid time format. Use HH:MM format" },
        { status: 400 }
      );
    }

    // Check availability
    const availability = await checkTimeSlotAvailability(
      roomId,
      dateObj,
      actualStartTime,
      actualEndTime
    );

    if (!availability.isAvailable) {
      return NextResponse.json(
        {
          message: availability.message,
          type: availability.type,
        },
        { status: 409 }
      );
    }

    // Create booking with correct times
    const booking = await Booking.create({
      userId: decoded.userId,
      roomId,
      bookingDate: dateObj,
      startTime: actualStartTime, // Will be 08:00 for full day
      endTime: actualEndTime, // Will be 18:00 for full day
      isFullDayBooking: isFullDayBooking || false,
      notes: notes || "",
    });

    await booking.populate("roomId");

    console.log("Booking created successfully:", {
      bookingId: booking._id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      isFullDayBooking: booking.isFullDayBooking,
    });

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
