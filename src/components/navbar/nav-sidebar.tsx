import React from "react";
import { redirect } from "next/navigation";

import { UserButton } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";

import NavAction from "./nav-action";
import NavItem from "./nav-item";

import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { ModeToggle } from "../toggle-theme";

export default async function NavSideBar() {
  const profile = await findCurrentProfile();

  if (!profile) {
    return redirect("/");
  }

  const spaces = await db.space.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="h-full flex flex-col space-y-4 py-3 items-center text-primary w-full bg-[#E3E5E8] dark:bg-[#0F0F0F]">
      <NavAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-800 rounded-md w-10 mx-auto" />
      <ScrollArea className="w-full flex-1">
        {spaces.map((space) => (
          <div key={space.id} className="mb-4">
            <NavItem
              id={space.id}
              name={space.name}
              imageURL={space.imageURL}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-10 w-10",
            },
          }}
          afterSignOutUrl="/"
        />
      </div>
    </div>
  );
}
