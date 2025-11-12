// app/api/bookings/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Room from "@/models/Room";
import CompanyHours from "@/models/CompanyHours";
import { checkTimeSlotAvailability } from "@/lib/utils/availability";
import { verifyToken } from "@/lib/utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { sendBookingConfirmationEmail } from "@/lib/emailService";

// Business hours constants - MUST match frontend
const BUSINESS_OPEN = "08:00";
const BUSINESS_CLOSE = "18:00";

export async function POST(request: NextRequest) {
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

    const { roomId, bookingDate, startTime, endTime, isFullDayBooking, notes } =
      await request.json();

    // Validate required fields
    if (!roomId || !bookingDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findById(userDecoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get room details for email
    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
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
    let actualStartTime: string;
    let actualEndTime: string;

    if (isFullDayBooking) {
      // Full day booking MUST use business hours
      actualStartTime = BUSINESS_OPEN;
      actualEndTime = BUSINESS_CLOSE;
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
    }

    // Validate times are in business hours format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(actualStartTime) || !timeRegex.test(actualEndTime)) {
      return NextResponse.json(
        { message: "Invalid time format. Use HH:MM format" },
        { status: 400 }
      );
    }

    // Calculate booking hours for company hour system
    const [startHour, startMin] = actualStartTime.split(":").map(Number);
    const [endHour, endMin] = actualEndTime.split(":").map(Number);
    const startInMinutes = startHour * 60 + startMin;
    const endInMinutes = endHour * 60 + endMin;
    const bookingHours = (endInMinutes - startInMinutes) / 60;

    // Check if company has hour-based booking system
    const companyHours = await CompanyHours.findOne({
      companyName: user.companyName,
      isActive: true,
    });

    let isHourBasedBooking = false;
    let remainingHoursAfterBooking = null;

    if (companyHours) {
      // Check if company has enough hours
      if (companyHours.remainingHours < bookingHours) {
        return NextResponse.json(
          {
            message: `Insufficient hours. You need ${bookingHours}h but only have ${companyHours.remainingHours}h remaining.`,
            remainingHours: companyHours.remainingHours,
            requiredHours: bookingHours,
          },
          { status: 400 }
        );
      }

      isHourBasedBooking = true;
      remainingHoursAfterBooking = companyHours.remainingHours - bookingHours;
    }

    // Check for booking conflicts using the availability utility
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

    // Create the booking
    const booking = await Booking.create({
      userId: userDecoded.userId,
      roomId,
      bookingDate: dateObj,
      startTime: actualStartTime,
      endTime: actualEndTime,
      isFullDayBooking: isFullDayBooking || false,
      notes: notes || "",
      isHourBasedBooking,
      hoursUsed: isHourBasedBooking ? bookingHours : 0,
      companyName: user.companyName,
      status: "active",
    });

    // Deduct hours from company if hour-based booking
    if (isHourBasedBooking && companyHours) {
      companyHours.usedHours += bookingHours;
      companyHours.remainingHours = remainingHoursAfterBooking!;
      companyHours.transactions.push({
        type: "use",
        hours: bookingHours,
        description: `Booking for ${bookingDate} (${actualStartTime}-${actualEndTime})`,
        bookingId: booking._id,
      });
      await companyHours.save();
    }

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("userId", "name email companyName")
      .populate("roomId", "name floor description capacity");

    console.log("Booking created successfully:", {
      bookingId: booking._id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      isFullDayBooking: booking.isFullDayBooking,
      hoursUsed: booking.hoursUsed,
    });

    // Send confirmation email
    try {
      const formatTimeTo12h = (time24: string): string => {
        const [hours, minutes] = time24.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
      };

      const timeSlot = isFullDayBooking
        ? "Full Day (8:00 AM - 6:00 PM)"
        : `${formatTimeTo12h(actualStartTime)} - ${formatTimeTo12h(
            actualEndTime
          )}`;

      const duration = isFullDayBooking
        ? "Full Day"
        : `${bookingHours.toFixed(1)} hours`;

      const bookingEmailData = {
        bookingId: booking._id.toString(),
        roomName: room.name,
        date: new Date(bookingDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        timeSlot,
        duration,
        isFullDay: isFullDayBooking || false,
        hoursUsed: isHourBasedBooking ? bookingHours : undefined,
        remainingHours:
          remainingHoursAfterBooking !== null
            ? remainingHoursAfterBooking
            : undefined,
      };

      const userData = {
        name: user.name,
        email: user.email,
        companyName: user.companyName || "Not specified",
      };

      await sendBookingConfirmationEmail(userData, bookingEmailData);
      console.log("Booking confirmation email sent successfully");
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the booking if email fails - just log the error
    }

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking: populatedBooking,
        hoursDeducted: isHourBasedBooking ? bookingHours : 0,
        remainingHours: companyHours?.remainingHours || null,
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
