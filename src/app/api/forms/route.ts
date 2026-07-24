import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FORM_CATEGORIES } from "@/lib/form-categories";
import type { FormCategory } from "@prisma/client";

const VALID_CATEGORIES = FORM_CATEGORIES.map((c) => c.key);

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categoria = req.nextUrl.searchParams.get("categoria");
  const category: FormCategory | undefined =
    categoria && VALID_CATEGORIES.includes(categoria as typeof VALID_CATEGORIES[number])
      ? (categoria as FormCategory)
      : undefined;

  const forms = await prisma.form.findMany({
    where: { isPublished: true, ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { fields: true } },
      submissions: { where: { userId }, select: { id: true } },
    },
  });

  return NextResponse.json(
    forms.map(({ submissions, ...form }) => ({
      ...form,
      hasSubmitted: submissions.length > 0,
    })),
  );
}
