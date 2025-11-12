import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { hashPassword } from "@/lib/utils/password";
import { sendPasswordResetSuccessEmail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, otp, newPassword } = await request.json();

    console.log("Password reset request:", {
      email,
      otp: otp ? "***" : "missing",
      newPassword: newPassword ? "***" : "missing",
    });

    if (!email || !otp || !newPassword) {
      console.log("Missing required fields");
      return NextResponse.json(
        { message: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    // Verify OTP again (it should still be valid)
    const validOtp = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
      type: "password_reset",
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    console.log("OTP validation result:", {
      foundOtp: !!validOtp,
      isUsed: validOtp?.isUsed,
      expiresAt: validOtp?.expiresAt,
      now: new Date(),
    });

    if (!validOtp) {
      // Let's check what OTPs exist for this email for debugging
      const allOtps = await Otp.find({
        email: email.toLowerCase(),
        type: "password_reset",
      });
      console.log("All OTPs for email:", allOtps);

      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // NOW mark OTP as used after successful password reset
    validOtp.isUsed = true;
    await validOtp.save();

    console.log("Password reset successful for user:", email);

    // Send success email
    try {
      const userData = {
        name: user.name,
        email: user.email,
        companyName: user.companyName,
      };

      await sendPasswordResetSuccessEmail(userData);
      console.log("Success email sent");
    } catch (emailError) {
      console.error("Failed to send success email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
