import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await findCurrentProfile();

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("Channel Id missing", { status: 401 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("Internal error while fetching the messages:", error);
    return new NextResponse("Internal error while fetching the messages", {
      status: 500,
    });
  }
}
