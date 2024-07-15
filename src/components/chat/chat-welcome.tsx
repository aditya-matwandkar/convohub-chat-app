import React from "react";

import { Hash, UserRound } from "lucide-react";

export default function ChatWelcome({
  name,
  type,
}: {
  name: string;
  type: "channel" | "chat";
}) {
  return (
    <div className="px-4 mb-4 space-y-2">
      <div className="h-[75px] w-[75px] flex items-center justify-center rounded-full bg-zinc-500 dark:bg-gray-700/90">
        {type === "channel" ? (
          <Hash className="h-12 w-12 text-white" />
        ) : (
          <UserRound className="h-12 w-12 text-white" />
        )}
      </div>
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}.`}
      </p>
    </div>
  );
}
