import React from "react";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { findCurrentProfile } from "@/lib/current-profile";
import { getOrCreateChat } from "@/lib/chat";

import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import MediaRoom from "@/components/media-room";

export default async function MemberChatPage({
  params,
  searchParams,
}: {
  params: { spaceId: string; memberId: string };
  searchParams: { video?: boolean };
}) {
  const profile = await findCurrentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      spaceId: params.spaceId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const chat = await getOrCreateChat(currentMember.id, params.memberId);

  if (!chat) {
    return redirect(`/spaces/${params.spaceId}`);
  }

  const { memberOne, memberTwo } = chat;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#2b2f38]">
      <ChatHeader
        name={otherMember.profile.username}
        spaceId={params.spaceId}
        imageURL={otherMember.profile.imageURL}
        type="chat"
      />
      {!searchParams.video && (
        <>
          <ChatMessages
            apiURL="/api/direct-messages"
            chatId={chat.id}
            member={currentMember}
            name={otherMember.profile.username}
            paramKey="chatId"
            paramValue={chat.id}
            socketQuery={{
              chatId: chat.id,
            }}
            socketURL="/api/socket/direct-messages"
            type="chat"
          />
          <ChatInput
            apiURL="/api/socket/direct-messages"
            query={{
              chatId: chat.id,
            }}
          />
        </>
      )}
      {searchParams.video && (
        <MediaRoom channelId={chat.id} audio={true} video={true} />
      )}
    </div>
  );
}
