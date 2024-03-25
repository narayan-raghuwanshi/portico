import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  if (!body)
    return NextResponse.json(
      { error: "User data is required" },
      { status: 400 }
    );

  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existingUser)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const newUser = await prisma.user.create({
    data: {
      email:body.email,
      name:body.name,
      username:body.username,
    },
  });
  console.log("Success");
  

  return NextResponse.json({ user: newUser }, { status: 200 });
}
