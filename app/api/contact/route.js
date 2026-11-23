import { NextResponse } from "next/server";
import { insertInquiry, getAllInquiries } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, company, service, budget, timeline, message, selected_day, selected_slot } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const insertedId = insertInquiry({
      name,
      email,
      company,
      service,
      budget,
      timeline,
      message,
      selected_day,
      selected_slot,
    });

    return NextResponse.json({
      success: true,
      id: insertedId,
      reference: `#XB-INQ-${String(insertedId).padStart(4, "0")}`,
      message: "Client inquiry successfully recorded in database.",
    });
  } catch (error) {
    console.error("Failed to record inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error while saving inquiry." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = getAllInquiries();
    return NextResponse.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching inquiries." },
      { status: 500 }
    );
  }
}
