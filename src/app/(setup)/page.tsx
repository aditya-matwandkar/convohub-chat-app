import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { initialProfile } from "@/lib/initial-profile";

import { redirect } from "next/navigation";

import InitialModal from "@/components/modals/initial-modal";

export default async function SetupPage() {
  const profile = await initialProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const space = await db.space.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (space) {
    return redirect(`/spaces/${space.id}`);
  }

  return <InitialModal />;
}
