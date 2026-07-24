import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Búsqueda pública de usuarios por username o nombre. Substring simple,
// insensible a mayúsculas — no hace falta escribir el handle exacto.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 1) return NextResponse.json([]);

  const users = await prisma.user.findMany({
    where: {
      username: { not: null },
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { username: true, name: true, image: true, role: true },
    take: 8,
    orderBy: { username: "asc" },
  });

  return NextResponse.json(users);
}
