import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import CompanyHours from "@/models/CompanyHours";
import { verifyToken } from "@/lib/utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export async function GET(request: NextRequest) {
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

    // Get user details
    const user = await User.findById(userDecoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if company has hour-based booking
    const companyHours = await CompanyHours.findOne({
      companyName: user.companyName,
      isActive: true,
    });

    if (!companyHours) {
      return NextResponse.json(
        {
          hasHourBasedBooking: false,
          message: "Company does not have hour-based booking",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        hasHourBasedBooking: true,
        companyHours: {
          totalHours: companyHours.totalHours,
          usedHours: companyHours.usedHours,
          remainingHours: companyHours.remainingHours,
          companyName: companyHours.companyName,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Company hours check error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to check company hours" },
      { status: 500 }
    );
  }
}
