import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, phone } = (body ?? {}) as { email?: unknown; phone?: unknown };

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const trimmedPhone = typeof phone === "string" ? phone.trim() : "";

  try {
    await serverClient.create({
      _type: "lead",
      email: email.trim(),
      ...(trimmedPhone ? { phone: trimmedPhone } : {}),
    });
  } catch (err) {
    console.error("Failed to create lead:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
