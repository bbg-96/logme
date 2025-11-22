import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";

import { query } from "@/lib/db";

type RawEntry = {
  id: number;
  title: string | null;
  content: string;
  created_at: string;
};

type TodayResponse = {
  entry: {
    id: number;
    title: string | null;
    content: string;
    createdAt: string;
  } | null;
};

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

export async function GET() {
  try {
    const result = await query<RawEntry>(
      `
        SELECT id, title, content, created_at
        FROM journal_entries
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [session.userId]
        ORDER BY created_at DESC
        LIMIT 1
      `
    );

    const raw = result.rows[0];

    const response: TodayResponse = raw
      ? {
          entry: {
            id: raw.id,
            title: raw.title,
            content: raw.content,
            createdAt: raw.created_at,
          },
        }
      : { entry: null };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[api/today] failed to load latest journal entry", error);
    return NextResponse.json(
      {
        error: "Failed to fetch the latest log entry",
      },
      { status: 500 }
    );
  }
}
