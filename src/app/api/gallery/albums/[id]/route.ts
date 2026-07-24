import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, requireAdmin, requireGalleryAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const canManage = role === "ADMIN" || role === "FOTOGRAFO";

  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      photos: {
        where: canManage ? undefined : { status: "APPROVED" },
        orderBy: { order: "asc" },
      },
      uploadedBy: { select: { id: true, username: true, name: true, role: true } },
    },
  });
  if (!album) return NextResponse.json({ error: "Álbum no encontrado" }, { status: 404 });

  // Un álbum todavía no aprobado no existe para el público, aunque adivinen la URL.
  if (!canManage && album.status !== "APPROVED") {
    return NextResponse.json({ error: "Álbum no encontrado" }, { status: 404 });
  }

  return NextResponse.json(album);
}

// Aprobación en bloque: solo ADMIN puede aprobar el álbum completo, lo que
// además aprueba automáticamente todas sus fotos que sigan PENDING (las que
// el admin haya rechazado puntualmente antes quedan afuera).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (status !== "APPROVED") {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const album = await prisma.album.update({ where: { id }, data: { status: "APPROVED" } });
  await prisma.photo.updateMany({ where: { albumId: id, status: "PENDING" }, data: { status: "APPROVED" } });

  if (!album.coverUrl) {
    const first = await prisma.photo.findFirst({ where: { albumId: id, status: "APPROVED" }, orderBy: { order: "asc" } });
    if (first) await prisma.album.update({ where: { id }, data: { coverUrl: first.url } });
  }

  return NextResponse.json(album);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireGalleryAccess();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Las que ya estaban REJECTED ya se borraron de Cloudinary al rechazarlas;
  // el resto (pendientes o aprobadas) todavía tienen su archivo ahí.
  const photos = await prisma.photo.findMany({
    where: { albumId: id, status: { not: "REJECTED" } },
    select: { publicId: true },
  });
  await Promise.all(photos.filter(p => p.publicId).map(p => deleteImage(p.publicId!)));

  await prisma.album.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
