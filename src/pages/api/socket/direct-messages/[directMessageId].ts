import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types";

import { db } from "@/lib/db";
import { findCurrentProfilePages } from "@/lib/current-profile-pages";
import { MemberRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await findCurrentProfilePages(req);
    const { directMessageId, chatId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!chatId) {
      return res.status(400).json({ error: "Conversation Id missing" });
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
      return res.status(404).json({ error: "Conversation not found" });
    }

    const member =
      chat.memberOne.profileId === profile.id ? chat.memberOne : chat.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        chatId: chatId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;

    const canDelete = isMessageOwner || isAdmin || isModerator;

    if (!canDelete) {
      return res
        .status(401)
        .json({ error: "Unauthorized to perform this action." });
    }

    if (req.method === "DELETE") {
      message = await db.directMessage.update({
        where: {
          id: message.id as string,
        },
        data: {
          content: "This message has been deleted.",
          fileUrl: null,
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res
          .status(401)
          .json({ error: "Unauthorized to perform this action." });
      }

      message = await db.directMessage.update({
        where: {
          id: message.id as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${chatId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("Internal error while updating/deleting the message:", error);
    return res
      .status(500)
      .json({ error: "Internal error while updating/deleting the message." });
  }
}
