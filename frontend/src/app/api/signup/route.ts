import { NextRequest, NextResponse } from "next/server";

import { attachAuthCookie, hashPassword, signSession } from "@/lib/auth";
import { query } from "@/lib/db";

type SignupBody = {
  email?: string;
  password?: string;
  username?: string;
};

type UserRow = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SignupBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const username = body.username?.trim();

  if (!email || !password || !username) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  try {
    const existing = await query<UserRow>(
      "SELECT id, email, username, password_hash, created_at FROM users WHERE email = $1 OR username = $2 LIMIT 1",
      [email, username]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email or username already in use" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const inserted = await query<UserRow>(
      `
        INSERT INTO users (email, password_hash, username, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, email, username, password_hash, created_at
      `,
      [email, passwordHash, username]
    );

    const user = inserted.rows[0];
    const token = signSession({ userId: user.id, email: user.email, username: user.username });
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username, createdAt: user.created_at },
      redirectTo: `/u/${user.username}/today`,
    });

    attachAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("[api/signup] failed to sign up", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
