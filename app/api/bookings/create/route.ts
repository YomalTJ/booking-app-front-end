import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { checkTimeSlotAvailability } from "@/lib/utils/availability";
import { verifyToken } from "@/lib/utils/jwt";

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

    console.log("Creating booking with data:", {
      roomId,
      bookingDate,
      startTime,
      endTime,
      isFullDayBooking,
      userId: decoded.userId,
    });

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

    console.log("Parsed date object (UTC):", dateObj.toISOString());

    // Check availability
    const availability = await checkTimeSlotAvailability(
      roomId,
      dateObj,
      isFullDayBooking ? "00:00" : startTime,
      isFullDayBooking ? "23:59" : endTime
    );

    console.log("Availability check result:", availability);

    if (!availability.isAvailable) {
      return NextResponse.json(
        {
          message: availability.message,
          type: availability.type,
        },
        { status: 409 }
      );
    }

    // Create booking
    const booking = await Booking.create({
      userId: decoded.userId,
      roomId,
      bookingDate: dateObj,
      startTime: isFullDayBooking ? "00:00" : startTime,
      endTime: isFullDayBooking ? "23:59" : endTime,
      isFullDayBooking: isFullDayBooking || false,
      notes: notes || "",
    });

    console.log("Booking created:", {
      id: booking._id,
      bookingDate: booking.bookingDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    await booking.populate("roomId");

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
