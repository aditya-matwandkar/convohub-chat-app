"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal-store";

import ActionTooltip from "@/components/action-tooltip";
import { Plus } from "lucide-react";

export default function NavAction() {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip label="Add a Space" side="right" align="center">
        <button
          className="flex items-center group"
          onClick={() => onOpen("createSpace")}
        >
          <div className="h-12 w-12 flex items-center justify-center mx-3 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden bg-white dark:bg-neutral-700 group-hover:bg-emerald-600">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}
