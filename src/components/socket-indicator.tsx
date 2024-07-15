"use client";

import React from "react";
import { useSocket } from "./providers/socket-provider";
import ActionTooltip from "./action-tooltip";

export default function SocketIndicator() {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <ActionTooltip label="Connecting...">
        <div className="h-[10px] w-[10px] bg-yellow-600 rounded-full" />
      </ActionTooltip>
    );
  }

  return (
    <ActionTooltip label="Connected">
      <div className="h-[10px] w-[10px] bg-emerald-500 rounded-full" />
    </ActionTooltip>
  );
}
