"use client";

import React, { useState, useEffect } from "react";

import { useUser } from "@clerk/nextjs";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

import { Loader2 } from "lucide-react";
import axios from "axios";

export default function MediaRoom({
  channelId,
  audio,
  video,
}: {
  channelId: string;
  audio: boolean;
  video: boolean;
}) {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    const name = user.username;

    (async () => {
      try {
        const response = await axios.get(
          `/api/get-participant-token?room=${channelId}&username=${name}`
        );

        const data = response.data;
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.username, channelId]);

  if (token === "") {
    return (
      <div className="flex flex-col justify-center items-center flex-1">
        <Loader2 className="h-7 w-7 my-4 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
