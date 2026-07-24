import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { INTEREST_CATALOG, URUGUAY_DEPARTMENTS } from "@/lib/profile-catalog";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const SOCIAL_FIELDS = ["instagram", "discord", "tiktok", "twitter"] as const;
const INTEREST_KEYS = new Set(INTEREST_CATALOG.map((i) => i.key));

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const name = form.get("name");
  const bio = form.get("bio");
  const city = form.get("city");
  const avatar = form.get("avatar");
  const banner = form.get("banner");
  const interests = form.getAll("interests");

  const data: {
    name?: string; bio?: string; image?: string; banner?: string; city?: string | null;
    instagram?: string | null; discord?: string | null; tiktok?: string | null; twitter?: string | null;
    interests?: string[]; showEmail?: boolean; showFriendsPublicly?: boolean;
  } = {};

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

  if (typeof city === "string") {
    if (city === "") {
      data.city = null;
    } else if (!(URUGUAY_DEPARTMENTS as readonly string[]).includes(city)) {
      return NextResponse.json({ error: "Departamento inválido" }, { status: 400 });
    } else {
      data.city = city;
    }
  }

  for (const field of SOCIAL_FIELDS) {
    const value = form.get(field);
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 80) {
        return NextResponse.json({ error: `El usuario de ${field} es demasiado largo` }, { status: 400 });
      }
      data[field] = trimmed || null;
    }
  }

  const showEmail = form.get("showEmail");
  if (typeof showEmail === "string") {
    data.showEmail = showEmail === "1";
  }

  const showFriendsPublicly = form.get("showFriendsPublicly");
  if (typeof showFriendsPublicly === "string") {
    data.showFriendsPublicly = showFriendsPublicly === "1";
  }

  if (form.get("interestsTouched") === "1") {
    const values = interests.map((v) => v.toString());
    const invalid = values.some((v) => !INTEREST_KEYS.has(v as never));
    if (invalid) return NextResponse.json({ error: "Tag de interés inválido" }, { status: 400 });
    if (values.length > 4) return NextResponse.json({ error: "Máximo 4 intereses" }, { status: 400 });
    data.interests = values;
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
      const { url } = await uploadImage(buffer, field);
      data[key] = url;
    }
  }

  const user = await prisma.user.update({ where: { id: userId }, data });

  return NextResponse.json({
    name: user.name,
    bio: user.bio,
    image: user.image,
    banner: user.banner,
    city: user.city,
    instagram: user.instagram,
    discord: user.discord,
    tiktok: user.tiktok,
    twitter: user.twitter,
    interests: user.interests,
  });
}
