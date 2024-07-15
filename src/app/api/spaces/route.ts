import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { name, imageURL } = await req.json();

    const profile = await findCurrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const space = await db.space.create({
      data: {
        name,
        imageURL,
        inviteCode: uuidv4(),
        profileId: profile.id,
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    if (!space) {
      return new NextResponse(
        "Unexpected error occured while creating space, please retry.",
        { status: 404 }
      );
    }

    return NextResponse.json(space);
  } catch (error) {
    console.log("Unexpected error while creating spaces:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
