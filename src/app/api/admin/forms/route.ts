import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FORM_CATEGORIES, categoryInfo, participantBadgeName } from "@/lib/form-categories";
import { awardBadge } from "@/lib/badges";

const VALID_CATEGORIES = FORM_CATEGORIES.map((c) => c.key);

function slug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const forms = await prisma.form.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { fields: true, submissions: true } } },
  });
  return NextResponse.json(forms);
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, description, category, edition, ownerEmail } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Título requerido" }, { status: 400 });
  }
  if (category && !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
  }

  let ownerId: string | null = null;
  if (ownerEmail?.trim()) {
    const owner = await prisma.user.findUnique({ where: { email: ownerEmail.trim() } });
    if (!owner) return NextResponse.json({ error: "No existe ningún usuario con ese email" }, { status: 400 });
    ownerId = owner.id;
  }

  const baseSlug = slug(title);
  let finalSlug = baseSlug;
  let i = 1;
  while (await prisma.form.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${i++}`;
  }

  const finalCategory = category || "OTRO";
  const finalEdition = edition?.trim() || null;

  const form = await prisma.form.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      slug: finalSlug,
      category: finalCategory,
      edition: finalEdition,
      ownerId,
    },
  });

  if (ownerId) {
    const cat = categoryInfo(finalCategory);
    await awardBadge(
      ownerId,
      participantBadgeName(cat.ownerRole, finalEdition),
      `Organizador/a de "${form.title}"`,
      cat.icon
    );
  }

  return NextResponse.json(form, { status: 201 });
}
