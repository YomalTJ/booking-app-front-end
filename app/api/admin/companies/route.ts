import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/utils/jwt";

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
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get unique company names from users
    const companies = await User.aggregate([
      {
        $group: {
          _id: "$companyName",
          userCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          companyName: "$_id",
          userCount: 1,
        },
      },
      {
        $sort: { companyName: 1 },
      },
    ]);

    return NextResponse.json({ companies }, { status: 200 });
  } catch (error: any) {
    console.error("Companies fetch error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
