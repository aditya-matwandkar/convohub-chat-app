import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await findCurrentProfile();

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const chatId = searchParams.get("chatId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!chatId) {
      return new NextResponse("Chat Id missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          chatId,
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
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          chatId,
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
    console.log("Internal error while fetching the direct-messages:", error);
    return new NextResponse(
      "Internal error while fetching the direct-messages",
      {
        status: 500,
      }
    );
  }
}
