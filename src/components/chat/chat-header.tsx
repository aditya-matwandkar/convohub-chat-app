import React from "react";

import MobileToggle from "../mobile-toggle";
import UserAvatar from "../user-avatar";
import SocketIndicator from "../socket-indicator";
import ChatVideoButton from "./chat-video-button";

import { ChannelType } from "@prisma/client";
import { Hash, Video, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  spaceId: string;
  name: string;
  type: "channel" | "chat";
  imageURL?: string;
  channelType?: ChannelType;
}

const channelIcon = {
  [ChannelType.TEXT]: (
    <Hash className="h-6 w-6 mr-1 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.AUDIO]: (
    <Volume2 className="h-6 w-6 mr-1 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="h-6 w-6 mr-1 text-zinc-500 dark:text-zinc-400" />
  ),
};

export default function ChatHeader({
  spaceId,
  name,
  type,
  imageURL,
  channelType,
}: ChatHeaderProps) {
  const icon = channelIcon[channelType!];

  return (
    <div className="h-12 px-3 flex items-center font-semibold border-b-2 border-neutral-200 dark:border-[#0f0f0f]">
      <MobileToggle spaceId={spaceId} />
      {type === "channel" && <>{icon}</>}
      {type === "chat" && (
        <UserAvatar
          src={imageURL}
          className="h-8 w-8 md:h-8 md:w-8 mr-2 ml-1 md:ml-0"
        />
      )}
      <p className="font-semibold text-black dark:text-white">{name}</p>
      {type === "chat" && <ChatVideoButton />}
      <div className={cn("flex items-center", type === "channel" && "ml-auto")}>
        <SocketIndicator />
      </div>
    </div>
  );
}
