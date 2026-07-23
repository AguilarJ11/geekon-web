import { prisma } from "@/lib/prisma";

export async function awardBadge(userId: string, name: string, description: string, icon: string) {
  const badge = await prisma.badge.upsert({
    where: { name },
    update: {},
    create: { name, description, icon },
  });
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
    update: {},
    create: { userId, badgeId: badge.id },
  });
}
