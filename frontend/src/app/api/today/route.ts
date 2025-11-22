import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { query } from "@/lib/db";

type RawEntry = {
  id: number;
  title: string | null;
  content: string;
  created_at: string;
};

type TodayEntry = {
  id: number;
  title: string | null;
  content: string;
  createdAt: string;
};

type TodayResponse = {
  entry: TodayEntry | null;
  error?: string;
};

export async function GET(request: NextRequest) {
  // 1) JWT 쿠키 확인
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json<TodayResponse>(
      { entry: null, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json<TodayResponse>(
      { entry: null, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    // 2) 해당 사용자(user_id)의 최신 로그 1개 조회
    const result = await query<RawEntry>(
      `
        SELECT id, title, content, created_at
        FROM journal_entries
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [session.userId],
    );

    const row = result.rows[0];

    const entry: TodayEntry | null = row
      ? {
          id: row.id,
          title: row.title,
          content: row.content,
          createdAt: row.created_at,
        }
      : null;

    const body: TodayResponse = { entry };
    return NextResponse.json(body);
  } catch (error) {
    console.error("[api/today] failed to fetch latest entry", error);

    return NextResponse.json<TodayResponse>(
      { entry: null, error: "Database unavailable" },
      { status: 500 },
    );
  }
}
