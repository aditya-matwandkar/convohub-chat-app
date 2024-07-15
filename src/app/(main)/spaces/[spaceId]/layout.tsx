import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import SpaceSidebar from "@/components/space/space-sidebar";

export default async function SpaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { spaceId: string };
}) {
  const profile = await findCurrentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const space = await db.space.findUnique({
    where: {
      id: params.spaceId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!space) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="h-full fixed hidden md:flex flex-col w-60 z-30 inset-y-0">
        <SpaceSidebar spaceId={params.spaceId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
}
