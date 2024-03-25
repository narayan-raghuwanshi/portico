import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const email = body.email;
  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser)
    return NextResponse.json({ user: existingUser }, { status: 200 });

  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
