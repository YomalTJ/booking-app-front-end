import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { generateToken } from "@/lib/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { message: "Please provide username and password" },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await Admin.findOne({
      username: username.toLowerCase(),
      isActive: true,
    }).select("+password");

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id.toString());

    // Return response
    return NextResponse.json(
      {
        token,
        name: admin.name,
        username: admin.username,
        role: admin.role,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
