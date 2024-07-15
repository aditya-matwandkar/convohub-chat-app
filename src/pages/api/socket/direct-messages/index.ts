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
    const { chatId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!chatId) {
      return res.status(400).json({ error: "Chat Id missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const chat = await db.chat.findFirst({
      where: {
        id: chatId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      chat.memberOne.profileId === profile.id ? chat.memberOne : chat.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl: fileURL,
        chatId: chatId as string,
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

    const channelKey = `chat:${chatId}:messages:add`;

    res.socket.server.io.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("Internal error while sending the direct-message:", error);
    return res
      .status(500)
      .json({ message: "Internal error while sending the direct-message." });
  }
}
