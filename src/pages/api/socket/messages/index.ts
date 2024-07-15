import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types";

import { db } from "@/lib/db";
import { findCurrentProfilePages } from "@/lib/current-profile-pages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await findCurrentProfilePages(req);

    const { content, fileURL } = req.body;
    const { spaceId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!spaceId) {
      return res.status(400).json({ error: "Space Id missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel Id missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const space = await db.space.findFirst({
      where: {
        id: spaceId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        spaceId: spaceId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = space.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl: fileURL,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages:add`;

    res.socket.server.io.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("Internal error while sending the message:", error);
    return res
      .status(500)
      .json({ message: "Internal error while sending the message." });
  }
}
