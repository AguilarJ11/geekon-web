import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: formId } = await params;

  const [form, submissions] = await Promise.all([
    prisma.form.findUnique({
      where: { id: formId },
      include: { fields: { orderBy: { order: "asc" } } },
    }),
    prisma.formSubmission.findMany({
      where: { formId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ form, submissions });
}
