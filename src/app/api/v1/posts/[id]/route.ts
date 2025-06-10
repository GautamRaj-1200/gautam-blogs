import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const post = await prisma.blog.findUnique({ where: { id: params.id } });
//   return NextResponse.json(post);
// }
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.blog.findUnique({ where: { id: id } });
  return NextResponse.json(post);
}
