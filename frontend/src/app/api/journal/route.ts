import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { query } from "@/lib/db";

type RawEntry = {
  id: number;
  title: string | null;
  content: string;
  created_at: string;
};

type Entry = {
  id: number;
  title: string | null;
  content: string;
  createdAt: string;
};

type JournalResponse = {
  entries: Entry[];
  error?: string;
};

type CreateJournalRequest = {
  title?: string | null;
  content?: string;
};

type CreateJournalResponse = {
  entry?: Entry;
  error?: string;
};

function mapRow(row: RawEntry): Entry {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
  };
}

function getSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json<JournalResponse>({ entries: [], error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await query<RawEntry>(
      `
        SELECT id, title, content, created_at
        FROM journal_entries
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 100
      `,
      [session.userId],
    );

    return NextResponse.json<JournalResponse>({ entries: result.rows.map(mapRow) });
  } catch (error) {
    console.error("[api/journal] failed to fetch entries", error);
    return NextResponse.json<JournalResponse>({ entries: [], error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json<CreateJournalResponse>({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateJournalRequest;
  try {
    body = await request.json();
  } catch (error) {
    console.error("[api/journal] invalid JSON", error);
    return NextResponse.json<CreateJournalResponse>({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = body.title?.trim() || null;
  const content = body.content?.trim();

  if (!content) {
    return NextResponse.json<CreateJournalResponse>({ error: "Content is required" }, { status: 400 });
  }

  try {
    const result = await query<RawEntry>(
      `
        INSERT INTO journal_entries (user_id, title, content)
        VALUES ($1, $2, $3)
        RETURNING id, title, content, created_at
      `,
      [session.userId, title, content],
    );

    const entry = mapRow(result.rows[0]);
    return NextResponse.json<CreateJournalResponse>({ entry });
  } catch (error) {
    console.error("[api/journal] failed to create entry", error);
    return NextResponse.json<CreateJournalResponse>({ error: "Database error" }, { status: 500 });
  }
}
