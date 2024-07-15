import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await findCurrentProfile();
    const { searchParams } = new URL(req.url);
    const { name, type } = await req.json();

    const spaceId = searchParams.get("spaceId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel Id missing.", { status: 400 });
    }

    if (!spaceId) {
      return new NextResponse("Space Id missing.", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
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
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    //Delete the below portion from every route as prisma will directly throw an error in catch part when space is not found.
    if (!space) {
      return new NextResponse("Space does not exist.", { status: 404 });
    }

    return NextResponse.json(space);
  } catch (error) {
    console.log("Internal error while updating the channel:", error);
    return new NextResponse("Internal error while updating the channel.", {
      status: 500,
    });
  }
}
