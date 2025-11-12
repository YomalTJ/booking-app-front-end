import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find valid OTP
    const validOtp = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
      type: "password_reset",
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!validOtp) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Increment attempts (for tracking, but don't mark as used yet)
    validOtp.attempts += 1;
    await validOtp.save();

    return NextResponse.json({
      message: "Verification code validated successfully",
      verified: true,
    });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify code" },
      { status: 500 }
    );
  }
}
