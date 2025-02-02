import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";

export const findCurrentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

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
