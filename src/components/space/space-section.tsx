"use client";

import React from "react";
import { ChannelType, MemberRole } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store";
import { SpaceWithMembersWithProfiles } from "@/types";

import ActionTooltip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";

interface SpaceSectionProps {
  label: string;
  sectionType: "channels" | "members";
  role?: MemberRole;
  channelType?: ChannelType;
  space?: SpaceWithMembersWithProfiles;
}

export default function SpaceSection({
  label,
  sectionType,
  role,
  channelType,
  space,
}: SpaceSectionProps) {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("createChannel", { channelType })}
          >
            <Plus className="h-4 w-4 " />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("members", { space })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}
