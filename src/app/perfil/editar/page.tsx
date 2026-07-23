import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditProfileForm from "./EditProfileForm";

export default async function EditarPerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  return (
    <EditProfileForm
      initial={{
        name: user.name ?? "",
        bio: user.bio ?? "",
        image: user.image,
        banner: user.banner,
        city: user.city ?? "",
        instagram: user.instagram ?? "",
        discord: user.discord ?? "",
        tiktok: user.tiktok ?? "",
        twitter: user.twitter ?? "",
        interests: user.interests,
      }}
    />
  );
}
