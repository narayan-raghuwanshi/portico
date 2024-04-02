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

  if (existingUser && body.link) {
    const newLink = await prisma.link.create({
      data: {
        title: body.link.title,
        href: body.link.href,
        description: body.link.description,
        userId: existingUser.id,
      },
    });

    return NextResponse.json(
      { user: existingUser, link: newLink },
      { status: 200 }
    );
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
