import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Set the token cookie with an empty value and an expired Max-Age
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use Secure only in production
    maxAge: 0, // Expire immediately
  });

  return response;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405 }
  );
}
