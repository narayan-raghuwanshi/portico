import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

//Add a new link
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


//Update a link
export async function PUT(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const email = body.email;
  console.log(body);

  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser && body.link) {
    const updateLink = await prisma.link.update({
      where: { id: body.link.id },
      data: {
        title: body.link.title,
        href: body.link.href,
        userId: existingUser.id,
        id: body.link.id,
      },
    });

    return NextResponse.json(
      { user: existingUser, link: updateLink },
      { status: 200 }
    );
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}


//Delete a link
export async function DELETE(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const email = body.email;

  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  console.log(existingUser, body.link);

  if (existingUser && body.link) {
    await prisma.link.delete({
      where: { id: body.link.id },
    });

    return NextResponse.json({ user: existingUser }, { status: 200 });
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}
