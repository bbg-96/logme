import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "logme_session";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: number;
  email: string;
  username: string;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set. Please define it in .env.local");
  }
  return secret;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as SessionPayload;
  } catch (error) {
    console.error("[auth] failed to verify token", error);
    return null;
  }
}

export function attachAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  });

  return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
