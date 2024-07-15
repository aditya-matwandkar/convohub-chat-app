import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const profile = await findCurrentProfile();
    const { searchParams } = new URL(req.url);
    const { name, type } = await req.json();

    const spaceId = searchParams.get("spaceId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!spaceId) {
      return new NextResponse("Space Id missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      });
    }

    const space = await db.space.update({
      where: {
        id: spaceId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(space);
  } catch (error) {
    console.log("Internal error while creating channel:", error);
    return new NextResponse("Internal error while creating channel.", {
      status: 500,
    });
  }
}
