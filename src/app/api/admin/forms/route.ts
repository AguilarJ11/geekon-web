import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
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
  const { title, description } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Título requerido" }, { status: 400 });
  }

  let baseSlug = slug(title);
  let finalSlug = baseSlug;
  let i = 1;
  while (await prisma.form.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${i++}`;
  }

  const form = await prisma.form.create({
    data: { title: title.trim(), description: description?.trim() || null, slug: finalSlug },
  });
  return NextResponse.json(form, { status: 201 });
}
