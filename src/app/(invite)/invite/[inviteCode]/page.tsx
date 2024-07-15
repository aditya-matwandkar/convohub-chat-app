import { findCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function InviteCodePage({
  params,
}: {
  params: { inviteCode: string };
}) {
  const profile = await findCurrentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  //Check if the space exists or not
  const existingSpace = await db.space.findUnique({
    where: {
      inviteCode: params.inviteCode,
    },
  });

  if (!existingSpace) {
    return <div>TODO: Add space does not exist component</div>;
  }

  //Check if user exists already in this space.
  const userExistInSpace = await db.space.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (userExistInSpace) {
    return redirect(`/spaces/${userExistInSpace.id}`);
  }

  const space = await db.space.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  return redirect(`/spaces/${space.id}`);
}
