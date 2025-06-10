import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.blog.findUnique({ where: { id: params.id } });
  return NextResponse.json(post);
}
