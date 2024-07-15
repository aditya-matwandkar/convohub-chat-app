"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal-store";
import { MemberRole } from "@prisma/client";
import { SpaceWithMembersWithProfiles } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  CirclePlus,
  LogOut,
  Settings,
  Trash2,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

interface SpaceHeaderProps {
  space: SpaceWithMembersWithProfiles;
  role?: MemberRole;
}

export default function SpaceHeader({ space, role }: SpaceHeaderProps) {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const { onOpen } = useModal();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="w-full h-12 font-semibold px-3 flex items-center border-b-2 border-neutral-200 dark:border-[#0F0F0F] hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            {space.name}
            <ChevronDown className="w-5 h-5 ml-1 md:ml-auto" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
          {isModerator && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer text-emerald-500"
              onClick={() => onOpen("invite", { space })}
            >
              Invite People
              <UserRoundPlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer"
              onClick={() => {
                onOpen("editSpace", { space });
              }}
            >
              Space Settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer"
              onClick={() => onOpen("members", { space })}
            >
              Manage Members
              <UsersRound className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer"
              onClick={() => onOpen("createChannel")}
            >
              Create Channel
              <CirclePlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer text-[#BC2525]"
              onClick={() => onOpen("deleteSpace", { space })}
            >
              Delete Space
              <Trash2 className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer text-[#BC2525]"
              onClick={() => onOpen("leaveSpace", { space })}
            >
              Leave Space
              <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
