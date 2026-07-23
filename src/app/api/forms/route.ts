import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const forms = await prisma.form.findMany({
    where: { isPublished: true },
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
