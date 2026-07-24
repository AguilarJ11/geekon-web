import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, requireGalleryAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const canManage = role === "ADMIN" || role === "FOTOGRAFO";

  const albums = await prisma.album.findMany({
    where: canManage ? undefined : { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, edition: true, description: true, coverUrl: true, status: true, createdAt: true,
      photos: { select: { status: true } },
      uploadedBy: { select: { id: true, username: true, name: true, role: true } },
    },
  });

  return NextResponse.json(albums.map(({ photos, ...a }) => ({
    ...a,
    photosCount: photos.filter(p => p.status === "APPROVED").length,
    pendingCount: photos.filter(p => p.status === "PENDING").length,
  })));
}

export async function POST(req: NextRequest) {
  const session = await requireGalleryAccess();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, edition, description } = await req.json();

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
  }
  if (title.trim().length > 80) {
    return NextResponse.json({ error: "El título es demasiado largo" }, { status: 400 });
  }

  const s = await getServerSession(authOptions);
  const userId = (s?.user as { id?: string } | undefined)?.id;

  const album = await prisma.album.create({
    data: {
      title: title.trim(),
      edition: typeof edition === "string" && edition.trim() ? edition.trim() : null,
      description: typeof description === "string" && description.trim() ? description.trim() : null,
      uploadedById: userId,
    },
  });

  return NextResponse.json(album, { status: 201 });
}
