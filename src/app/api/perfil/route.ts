import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const name = form.get("name");
  const bio = form.get("bio");
  const avatar = form.get("avatar");
  const banner = form.get("banner");

  const data: { name?: string; bio?: string; image?: string; banner?: string } = {};

  if (typeof name === "string") {
    const trimmed = name.trim();
    if (!trimmed) return NextResponse.json({ error: "El nombre no puede estar vacío" }, { status: 400 });
    if (trimmed.length > 60) return NextResponse.json({ error: "El nombre es demasiado largo" }, { status: 400 });
    data.name = trimmed;
  }

  if (typeof bio === "string") {
    if (bio.length > 280) return NextResponse.json({ error: "La bio no puede superar 280 caracteres" }, { status: 400 });
    data.bio = bio.trim();
  }

  for (const [field, file, key] of [
    ["avatar", avatar, "image"],
    ["banner", banner, "banner"],
  ] as const) {
    if (file instanceof File && file.size > 0) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Formato de imagen no soportado para ${field}` }, { status: 400 });
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: `La imagen de ${field} supera los 5MB` }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadImage(buffer, field);
      data[key] = url;
    }
  }

  const user = await prisma.user.update({ where: { id: userId }, data });

  return NextResponse.json({
    name: user.name,
    bio: user.bio,
    image: user.image,
    banner: user.banner,
  });
}
