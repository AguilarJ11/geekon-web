import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [users, admins, forms, publishedForms, pendingSubmissions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.form.count(),
    prisma.form.count({ where: { isPublished: true } }),
    prisma.formSubmission.count({ where: { status: "PENDING" } }),
  ]);

  return NextResponse.json({ users, admins, forms, publishedForms, pendingSubmissions });
}
