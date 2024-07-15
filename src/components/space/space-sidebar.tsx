import React from "react";
import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { findCurrentProfile } from "@/lib/current-profile";

import SpaceHeader from "./space-header";
import SpaceSection from "./space-section";
import SpaceChannel from "./space-channel";
import SpaceMember from "./space-member";
import SpaceSearch from "./space-search";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Hash,
  ShieldCheck,
  ShieldEllipsis,
  Video,
  Volume2,
} from "lucide-react";

const channelIcon = {
  [ChannelType.TEXT]: <Hash className="h-4 w-4 mr-2" />,
  [ChannelType.AUDIO]: <Volume2 className="h-4 w-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="h-4 w-4 mr-2" />,
};

const roleIcon = {
  [MemberRole.ADMIN]: <ShieldEllipsis className="h-4 w-4 mr-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
  ),
  [MemberRole.GUEST]: null,
};

export default async function SpaceSidebar({ spaceId }: { spaceId: string }) {
  const profile = await findCurrentProfile();

  if (!profile) {
    return redirect("/");
  }

  const space = await db.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
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

  const textChannels = space?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = space?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = space?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = space?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!space) {
    return redirect("/");
  }

  const role = space.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="h-full w-full flex flex-col text-primary bg-[#F2F3F5] dark:bg-[#1E242A]">
      <SpaceHeader space={space} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SpaceSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.username,
                  icon: roleIcon[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
        <div className="mb-2">
          <SpaceSection
            label="Text Channels"
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
          />
          <div className="space-y-[2px]">
            {textChannels?.map((channel) => (
              <SpaceChannel
                key={channel.id}
                channel={channel}
                space={space}
                role={role}
              />
            ))}
          </div>
        </div>
        <div className="mb-2">
          <SpaceSection
            label="Voice Channels"
            sectionType="channels"
            channelType={ChannelType.AUDIO}
            role={role}
          />
          <div className="space-y-[2px]">
            {audioChannels?.map((channel) => (
              <SpaceChannel
                key={channel.id}
                channel={channel}
                space={space}
                role={role}
              />
            ))}
          </div>
        </div>
        <div className="mb-2">
          <SpaceSection
            label="Video Channels"
            sectionType="channels"
            channelType={ChannelType.VIDEO}
            role={role}
          />
          <div className="space-y-[2px]">
            {videoChannels?.map((channel) => (
              <SpaceChannel
                key={channel.id}
                channel={channel}
                space={space}
                role={role}
              />
            ))}
          </div>
        </div>
        {!!members?.length && (
          <div className="mb-2">
            <SpaceSection
              label="Members"
              sectionType="members"
              role={role}
              space={space}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <SpaceMember key={member.id} member={member} space={space} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
