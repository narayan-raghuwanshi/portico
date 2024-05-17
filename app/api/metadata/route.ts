import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function PUT(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  if (!body)
    return NextResponse.json(
      { error: "User data is required" },
      { status: 400 }
    );

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user)
    return NextResponse.json({ error: "User does not exist" }, { status: 403 });

  const updatedUser = await prisma.user.update({
    where: { email: body.email },
    data: {
      heading: body.heading,
      description: body.description,
    },
  });

  return NextResponse.json({ user: updatedUser }, { status: 200 });
}
