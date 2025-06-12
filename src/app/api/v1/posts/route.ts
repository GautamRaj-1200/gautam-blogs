import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const post = await prisma.blog.create({ data });
  return NextResponse.json(post, { status: 201 });
}

export async function GET() {
  const posts = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(posts, { status: 201 });
}
