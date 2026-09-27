import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";
import { getPreBriefQuestions } from "@/lib/sanity";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AnswerPayload {
  questionKey: string;
  questionLabel: string;
  value?: string;
  values?: string[];
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, answers } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    answers?: unknown;
  };

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Your name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  // Answers are rebuilt from the CMS questions rather than trusted as sent:
  // the label is snapshotted server-side, unknown keys are dropped, and
  // required questions are enforced here as well as in the browser.
  const questions = await getPreBriefQuestions();
  const submitted = (answers ?? {}) as Record<string, unknown>;

  const built: AnswerPayload[] = [];
  for (const q of questions) {
    const raw = submitted[q.key];

    if (q.fieldType === "multiSelect") {
      const values = Array.isArray(raw)
        ? raw.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
        : [];
      if (q.required && !values.length) {
        return NextResponse.json({ error: `"${q.label}" is required.` }, { status: 400 });
      }
      if (values.length) {
        built.push({ questionKey: q.key, questionLabel: q.label, values });
      }
      continue;
    }

    const value = typeof raw === "string" ? raw.trim() : "";
    if (q.required && !value) {
      return NextResponse.json({ error: `"${q.label}" is required.` }, { status: 400 });
    }
    if (value) {
      built.push({ questionKey: q.key, questionLabel: q.label, value });
    }
  }

  try {
    await serverClient.create({
      _type: "preBrief",
      name: name.trim(),
      email: email.trim(),
      submittedAt: new Date().toISOString(),
      answers: built.map((a) => ({ _type: "preBriefAnswer", ...a })),
    });
  } catch (err) {
    console.error("Failed to create pre-brief submission:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
