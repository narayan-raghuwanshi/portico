import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
interface Props {
  params: { username: string };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const links = await prisma.link.findMany({
    where: {
      userId: user.id,
    },
  });

  const testimonalLinks = await prisma.testimonial.findMany({
    where: {
      userId: user.id,
    },
  });

  return NextResponse.json(
    {
      userData: {
        heading: user.heading,
        description: user.description,
        links: links,
        testimonalLinks: testimonalLinks,
      },
    },
    { status: 200 }
  );
}
