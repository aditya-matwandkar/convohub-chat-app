import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const findCurrentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const currentProfile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return currentProfile;
};
