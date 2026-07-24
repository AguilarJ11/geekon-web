import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// "Mis inscripciones" junta las dos caras de participar en GeekOn!: los
// formularios a los que te postulaste (participante) y los que administrás
// como organizador (si un admin te asignó como dueño de alguno).
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [ownedForms, submissions] = await Promise.all([
    prisma.form.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { fields: true, submissions: true } } },
    }),
    prisma.formSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { form: { select: { title: true, category: true, edition: true } } },
    }),
  ]);

  return NextResponse.json({ ownedForms, submissions });
}
