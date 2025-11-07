import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetch all users (excluding password)
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}