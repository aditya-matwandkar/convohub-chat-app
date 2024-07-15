"use client";

import React, { useRef, ElementRef, Fragment } from "react";
import { Member } from "@prisma/client";

import ChatWelcome from "./chat-welcome";
import ChatItem from "./chat-item";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

import { MessageWithMembersWithProfile } from "@/types";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import "@/style/custom-scrollbar.css";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  chatId: string;
  name: string;
  member: Member;
  type: "channel" | "chat";
  apiURL: string;
  socketURL: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "chatId";
  paramValue: string;
}

export default function ChatMessages({
  chatId,
  name,
  member,
  type,
  apiURL,
  socketURL,
  socketQuery,
  paramKey,
  paramValue,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages:add`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiURL,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });

  useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    loadMore: fetchNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loader2 className="h-7 w-7 my-4 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <ServerCrash className="h-7 w-7 my-4 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 py-4 flex flex-col overflow-y-auto custom-scrollbar"
      ref={chatRef}
    >
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={type} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 my-4 text-zinc-500 animate-spin" />
          ) : (
            <button
              className="text-xs my-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              onClick={() => fetchNextPage()}
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message: MessageWithMembersWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                //@ts-ignore
                member={message.member}
                type={type}
                socketURL={socketURL}
                socketQuery={socketQuery}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                fileURL={message.fileUrl}
                currentMember={member}
                isUpdated={message.createdAt !== message.updatedAt}
                isDeleted={message.deleted}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
