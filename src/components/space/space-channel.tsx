"use client";

import React from "react";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import { Channel, ChannelType, MemberRole, Space } from "@prisma/client";

import ActionTooltip from "../action-tooltip";
import { Edit2, Hash, Lock, Trash2, Video, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const channelIcon = {
  [ChannelType.TEXT]: (
    <Hash className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.AUDIO]: (
    <Volume2 className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
};

interface SpaceChannelProps {
  channel: Channel;
  space: Space;
  role?: MemberRole;
}

export default function SpaceChannel({
  channel,
  space,
  role,
}: SpaceChannelProps) {
  const router = useRouter();
  const params = useParams();

  const { onOpen } = useModal();

  const icon = channelIcon[channel.type];

  const handleClick = () => {
    router.push(`/spaces/${params?.spaceId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { space, channel });
  };

  return (
    <button
      className={cn(
        "group w-full p-2 mb-1 rounded-md flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={handleClick}
    >
      {icon}
      <p
        className={cn(
          "font-semibold text-sm line-clamp-1 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex items-center gap-x-2 ml-auto">
          <ActionTooltip label="Edit">
            <Edit2
              className="h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, "editChannel")}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash2
              className="h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, "deleteChannel")}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="h-4 w-4 ml-auto text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
}
