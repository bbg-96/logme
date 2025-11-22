import { NextRequest, NextResponse } from "next/server";

import { attachAuthCookie, signSession, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";

type LoginBody = {
  email?: string;
  password?: string;
};

type UserRow = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  try {
    const result = await query<UserRow>(
      "SELECT id, email, username, password_hash, created_at FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signSession({ userId: user.id, email: user.email, username: user.username });
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username, createdAt: user.created_at },
      redirectTo: `/u/${user.username}/today`,
    });

    attachAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("[api/login] failed to log in", error);
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 });
  }
}
