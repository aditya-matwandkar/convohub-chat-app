import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await findCurrentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const spaceId = searchParams.get("spaceId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse("Member Id missing.", { status: 400 });
    }

    if (!spaceId) {
      return new NextResponse("Space Id missing", { status: 400 });
    }

    const space = await db.space.update({
      where: {
        id: spaceId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    if (!space) {
      return new NextResponse(
        "Something went wrong while updating the member role.",
        { status: 400 }
      );
    }

    return NextResponse.json(space);
  } catch (error) {
    console.log("Internal error while updating member's role:", error);
    return new NextResponse("Internal error while updating member's role.", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await findCurrentProfile();
    const { searchParams } = new URL(req.url);

    const spaceId = searchParams.get("spaceId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse("Member Id missing.", { status: 400 });
    }

    if (!spaceId) {
      return new NextResponse("Space Id missing", { status: 400 });
    }

    const space = await db.space.update({
      where: {
        id: spaceId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    if (!space) {
      return new NextResponse(
        "Something went wrong while kicking the member.",
        { status: 400 }
      );
    }

    return NextResponse.json(space);
  } catch (error) {
    console.log("Internal error while deleting the member:", error);
    return new NextResponse("Internal error while deleting the member.", {
      status: 500,
    });
  }
}
