import React from "react";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { findCurrentProfile } from "@/lib/current-profile";
import { ChannelType } from "@prisma/client";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";

export default async function ChannelPage({
  params,
}: {
  params: { spaceId: string; channelId: string };
}) {
  const profile = await findCurrentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      spaceId: params.spaceId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#2B2F38]">
      <ChatHeader
        spaceId={params.spaceId}
        name={channel.name}
        type="channel"
        channelType={channel.type}
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            chatId={channel.id}
            name={channel.name}
            member={member}
            type="channel"
            apiURL="/api/messages"
            socketURL="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              spaceId: channel.spaceId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            apiURL="/api/socket/messages"
            query={{
              channelId: channel.id,
              spaceId: channel.spaceId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom channelId={channel.id} audio={true} video={false} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom channelId={channel.id} audio={true} video={true} />
      )}
    </div>
  );
}
