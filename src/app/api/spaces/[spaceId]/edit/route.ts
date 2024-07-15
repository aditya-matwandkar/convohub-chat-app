import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { spaceId: string } }
) {
  try {
    const { name, imageURL } = await req.json();

    const profile = await findCurrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.spaceId) {
      return new NextResponse("Space Id missing", { status: 400 });
    }

    const space = await db.space.update({
      where: {
        id: params.spaceId,
        profileId: profile.id,
      },
      data: {
        name,
        imageURL,
      },
    });

    if (!space) {
      return new NextResponse("Space does not exist.", { status: 404 });
    }

    return NextResponse.json(space);
  } catch (error) {
    console.log("Internal error while updating space settings:", error);
    return new NextResponse("Internal error while updating space settings.", {
      status: 500,
    });
  }
}
