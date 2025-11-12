import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { sendPasswordResetOtpEmail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return NextResponse.json({
        message:
          "If an account with that email exists, a verification code has been sent",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Invalidate any existing OTPs for this email
    await Otp.updateMany(
      { email: email.toLowerCase(), type: "password_reset", isUsed: false },
      { isUsed: true }
    );

    // Create new OTP
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      type: "password_reset",
      expiresAt,
    });

    // Send OTP email
    try {
      const userData = {
        name: user.name,
        email: user.email,
        companyName: user.companyName,
      };

      await sendPasswordResetOtpEmail(userData, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Continue even if email fails for security
    }

    return NextResponse.json({
      message:
        "If an account with that email exists, a verification code has been sent",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Failed to process request" },
      { status: 500 }
    );
  }
}
