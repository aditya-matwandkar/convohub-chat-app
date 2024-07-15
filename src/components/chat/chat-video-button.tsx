"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ActionTooltip from "../action-tooltip";

import { Video, VideoOff } from "lucide-react";
import queryString from "query-string";

export default function ChatVideoButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  const handleClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <ActionTooltip label={tooltipLabel} side="bottom">
      <button
        onClick={handleClick}
        className="mr-4 ml-auto hover:opacity-75 transition"
      >
        {isVideo ? (
          <VideoOff className="h-6 w-6 text-[#BC2525]" />
        ) : (
          <Video className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
    </ActionTooltip>
  );
}
