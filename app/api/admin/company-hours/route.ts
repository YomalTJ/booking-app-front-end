import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CompanyHours from "@/models/CompanyHours";
import User from "@/models/User";
import { verifyToken } from "@/lib/utils/jwt";

// GET all companies with their hours
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

    // Remove .lean() to keep virtuals, or manually calculate remainingHours
    const companyHoursData = await CompanyHours.find()
      .sort({ createdAt: -1 })
      .lean();

    // Manually add remainingHours to each record
    const companyHours = companyHoursData.map((ch) => ({
      ...ch,
      remainingHours: ch.totalHours - ch.usedHours,
    }));

    return NextResponse.json({ companyHours }, { status: 200 });
  } catch (error: any) {
    console.error("Company hours fetch error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch company hours" },
      { status: 500 }
    );
  }
}

// POST - Add hours to a company
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
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { companyName, hours, description } = await request.json();

    if (!companyName || !hours || hours <= 0) {
      return NextResponse.json(
        { message: "Please provide valid company name and hours" },
        { status: 400 }
      );
    }

    // Check if company exists in users
    const companyExists = await User.findOne({ companyName });
    if (!companyExists) {
      return NextResponse.json(
        { message: "Company not found in users database" },
        { status: 404 }
      );
    }

    // Find or create company hours record
    let companyHoursRecord = await CompanyHours.findOne({ companyName });

    if (companyHoursRecord) {
      // Add hours to existing record
      companyHoursRecord.totalHours += hours;
      companyHoursRecord.transactions.push({
        type: "add",
        hours,
        description: description || `Added ${hours} hours`,
        createdAt: new Date(),
      });
      await companyHoursRecord.save();
    } else {
      // Create new record (don't set remainingHours as it's a virtual field)
      companyHoursRecord = await CompanyHours.create({
        companyName,
        totalHours: hours,
        usedHours: 0,
        transactions: [
          {
            type: "add",
            hours,
            description: description || `Initial ${hours} hours`,
            createdAt: new Date(),
          },
        ],
      });
    }

    // Convert to plain object and add remainingHours
    const responseData = companyHoursRecord.toObject();
    responseData.remainingHours =
      responseData.totalHours - responseData.usedHours;

    return NextResponse.json(
      {
        message: "Hours added successfully",
        companyHours: responseData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Add hours error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to add hours" },
      { status: 500 }
    );
  }
}
