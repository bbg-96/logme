import { NextResponse } from "next/server";

import { query } from "@/lib/db";

type DbCheckResponse = {
  ok: boolean;
  error?: string;
};

export async function GET() {
  try {
    const result = await query<{ ok: number }>("SELECT 1 as ok");
    const ok = result.rows[0]?.ok === 1;

    const body: DbCheckResponse = { ok };
    return NextResponse.json(body);
  } catch (error) {
    console.error("[api/db-check] database connectivity failed", error);
    const body: DbCheckResponse = { ok: false, error: "Database connection failed" };
    return NextResponse.json(body, { status: 500 });
  }
}
