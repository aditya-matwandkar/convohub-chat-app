import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { findCurrentProfile } from "@/lib/current-profile";

import { redirect } from "next/navigation";

export default async function SpacePage({
  params,
}: {
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
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const generalChannel = space?.channels[0];

  if (!generalChannel || generalChannel.name !== "general") {
    return null;
  }

  return redirect(`/spaces/${params.spaceId}/channels/${generalChannel.id}`);
}
