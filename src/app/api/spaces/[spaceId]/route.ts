import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { spaceId: string } }
) {
  try {
    const profile = await findCurrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.spaceId) {
      return new NextResponse("Space Id missing.", { status: 400 });
    }

    const space = await db.space.delete({
      where: {
        id: params.spaceId,
        profileId: profile.id,
      },
    });

    if (!space) {
      return new NextResponse("Space does not exist.", { status: 404 });
    }

    return NextResponse.json(space);
  } catch (error) {
    console.log("Internal error while deleting the space:", error);
    return new NextResponse("Internal error while deleting the space.", {
      status: 500,
    });
  }
}
