import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireGalleryAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";

const VALID_STATUSES = ["APPROVED", "REJECTED"];

// Aprobar/rechazar es exclusivo de ADMIN, aunque la foto la haya subido un
// FOTOGRAFO: toda foto necesita el visto bueno de un administrador antes de
// aparecer en la galería pública.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status, reason } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }
  if (status === "REJECTED" && (typeof reason !== "string" || !reason.trim())) {
    return NextResponse.json({ error: "Tenés que indicar el motivo del rechazo" }, { status: 400 });
  }

  const photo = await prisma.photo.update({
    where: { id },
    data: {
      status,
      rejectionReason: status === "REJECTED" ? reason.trim() : null,
    },
  });

  if (status === "APPROVED") {
    const album = await prisma.album.findUnique({ where: { id: photo.albumId }, select: { coverUrl: true } });
    if (!album?.coverUrl) {
      await prisma.album.update({ where: { id: photo.albumId }, data: { coverUrl: photo.url } });
    }
  }

  // Una foto rechazada no se va a mostrar nunca: borramos el archivo de
  // Cloudinary para no dejarlo huérfano, aunque el registro (con el motivo)
  // se mantenga en la base para referencia del fotógrafo/admin.
  if (status === "REJECTED" && photo.publicId) {
    await deleteImage(photo.publicId);
  }

  return NextResponse.json(photo);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireGalleryAccess();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const photo = await prisma.photo.delete({ where: { id } });

  // No borramos dos veces: si ya estaba REJECTED, el archivo ya se eliminó
  // de Cloudinary en el momento del rechazo.
  if (photo.publicId && photo.status !== "REJECTED") {
    await deleteImage(photo.publicId);
  }

  // Si era la portada del álbum, promovemos otra foto aprobada restante (o la dejamos vacía).
  const album = await prisma.album.findUnique({ where: { id: photo.albumId }, select: { coverUrl: true } });
  if (album?.coverUrl === photo.url) {
    const next = await prisma.photo.findFirst({
      where: { albumId: photo.albumId, status: "APPROVED" },
      orderBy: { order: "asc" },
    });
    await prisma.album.update({ where: { id: photo.albumId }, data: { coverUrl: next?.url ?? null } });
  }

  return new NextResponse(null, { status: 204 });
}
