import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import {
  checkTimeSlotAvailability,
  getDayAvailabilityStatus,
} from "@/lib/utils/availability";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { roomId, bookingDate, startTime, endTime, checkType } =
      await request.json();

    // Validation
    if (!roomId || !bookingDate) {
      return NextResponse.json(
        { message: "Please provide room ID and booking date" },
        { status: 400 }
      );
    }

    // Check day availability
    if (checkType === "day") {
      const result = await getDayAvailabilityStatus(roomId, bookingDate);
      return NextResponse.json(result, { status: 200 });
    }

    // Check specific time slot
    if (checkType === "timeSlot") {
      if (!startTime || !endTime) {
        return NextResponse.json(
          { message: "Please provide start and end times" },
          { status: 400 }
        );
      }

      const result = await checkTimeSlotAvailability(
        roomId,
        bookingDate,
        startTime,
        endTime
      );
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { message: "Invalid check type" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to check availability" },
      { status: 500 }
    );
  }
}
