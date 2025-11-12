import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/utils/password";
import { generateToken } from "@/lib/utils/jwt";
import { sendRegistrationConfirmationEmail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, companyName, phoneNumber } =
      await request.json();

    // Validation
    if (!name || !email || !password || !companyName || !phoneNumber) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      companyName,
      phoneNumber,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    // Send registration confirmation email (don't await to avoid blocking response)
    try {
      const userData = {
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        phoneNumber: user.phoneNumber,
      };

      await sendRegistrationConfirmationEmail(userData);
      console.log("Registration confirmation email sent successfully");
    } catch (emailError) {
      console.error(
        "Failed to send registration confirmation email:",
        emailError
      );
      // Don't fail registration if email fails - just log the error
    }

    // Return response
    return NextResponse.json(
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          companyName: user.companyName,
        },
        message: "Registration successful! Welcome email sent.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
