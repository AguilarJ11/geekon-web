import { NextRequest, NextResponse } from "next/server";
import { requireGalleryAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireGalleryAccess();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const album = await prisma.album.findUnique({ where: { id }, select: { id: true, _count: { select: { photos: true } } } });
  if (!album) return NextResponse.json({ error: "Álbum no encontrado" }, { status: 404 });

  const form = await req.formData();
  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return NextResponse.json({ error: "No se recibió ninguna foto" }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Formato no soportado: ${file.name}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `${file.name} supera los 8MB` }, { status: 400 });
    }
  }

  const uploaded: { url: string; publicId: string }[] = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    uploaded.push(await uploadImage(buffer, `galeria/${id}`));
  }

  let order = album._count.photos;
  // Entran como PENDING (default del schema): recién se suman a la galería
  // pública y pasan a ser portada candidata cuando un admin las aprueba.
  const photos = await prisma.$transaction(
    uploaded.map(({ url, publicId }) => prisma.photo.create({ data: { albumId: id, url, publicId, order: order++ } }))
  );

  return NextResponse.json(photos, { status: 201 });
}
