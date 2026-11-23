import { NextResponse } from "next/server";
import { tryInsertInquiry, getAllInquiries } from "@/lib/db";

const MAX_LENGTHS = {
  name: 100,
  email: 200,
  company: 200,
  service: 100,
  budget: 100,
  timeline: 100,
  message: 2000,
  selected_day: 20,
  selected_slot: 20,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLOT_RE = /^\d{1,2}:\d{2}\s?(EST|EDT)$/;

// Simple in-memory rate limit: 5 submissions per IP per hour.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) {
    hits.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(ip, timestamps);
  return false;
}

function clientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  return (forwarded ? forwarded.split(",")[0].trim() : null) || "unknown";
}

function cleanString(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Honeypot: bots fill the hidden "website" field — fake success, no write.
    if (body.website) {
      return NextResponse.json({
        success: true,
        reference: "#XB-INQ-0000",
        message: "Client inquiry successfully recorded in database.",
      });
    }

    if (isRateLimited(clientIp(req))) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const name = cleanString(body.name, MAX_LENGTHS.name);
    const email = cleanString(body.email, MAX_LENGTHS.email);
    const selectedDay = cleanString(body.selected_day, MAX_LENGTHS.selected_day);
    const selectedSlot = cleanString(body.selected_slot, MAX_LENGTHS.selected_slot);

    if (!name || !email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid name and email are required." },
        { status: 400 }
      );
    }

    if (selectedDay && !DAY_RE.test(selectedDay)) {
      return NextResponse.json(
        { error: "Invalid selected day." },
        { status: 400 }
      );
    }

    if (selectedSlot && !SLOT_RE.test(selectedSlot)) {
      return NextResponse.json(
        { error: "Invalid selected time slot." },
        { status: 400 }
      );
    }

    const insertedId = tryInsertInquiry({
      name,
      email,
      company: cleanString(body.company, MAX_LENGTHS.company),
      service: cleanString(body.service, MAX_LENGTHS.service),
      budget: cleanString(body.budget, MAX_LENGTHS.budget),
      timeline: cleanString(body.timeline, MAX_LENGTHS.timeline),
      message: cleanString(body.message, MAX_LENGTHS.message),
      selected_day: selectedDay,
      selected_slot: selectedSlot,
    });

    if (insertedId === null) {
      return NextResponse.json(
        { error: "That date and time slot is already booked." },
        { status: 409 }
      );
    }

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
    // Only expose booking fields — never client PII.
    const bookings = getAllInquiries().map((inq) => ({
      id: inq.id,
      selected_day: inq.selected_day,
      selected_slot: inq.selected_slot,
      created_at: inq.created_at,
    }));
    return NextResponse.json({
      success: true,
      count: bookings.length,
      inquiries: bookings,
    });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching inquiries." },
      { status: 500 }
    );
  }
}
