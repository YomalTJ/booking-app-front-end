import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

// This route should be disabled after creating your admin
// Set this to false after setup
const ALLOW_SETUP = true;

export async function POST(request: NextRequest) {
  try {
    // Security check - disable this route after initial setup
    if (!ALLOW_SETUP) {
      return NextResponse.json(
        { message: "Setup route is disabled" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({});

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists. Setup is complete." },
        { status: 400 }
      );
    }

    const { name, username, password } = await request.json();

    // Validation
    if (!name || !username || !password) {
      return NextResponse.json(
        { message: "Please provide name, username, and password" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Create admin
    const admin = await Admin.create({
      name,
      username: username.toLowerCase(),
      password,
      role: "superadmin",
      isActive: true,
    });

    return NextResponse.json(
      {
        message: "Admin created successfully!",
        admin: {
          name: admin.name,
          username: admin.username,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin creation error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create admin" },
      { status: 500 }
    );
  }
}
