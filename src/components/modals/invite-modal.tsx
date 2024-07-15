"use client";

import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, Copy, RefreshCw } from "lucide-react";

import axios from "axios";
import { cn } from "@/lib/utils";

export default function InviteModal() {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "invite";

  const originURL = useOrigin();
  const { space } = data;

  const inviteURL = `${originURL}/invite/${space?.inviteCode}`;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteURL);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleUpdateInviteLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/spaces/${space?.id}/invite-code`
      );
      const result = response.data;
      onOpen("invite", { space: result });
    } catch (error) {
      console.log("Error updating invite link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-50 dark:bg-[#2b2f38] text-black dark:text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends to {space?.name}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-100">
            Space invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 dark:bg-[#1e242a] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-zinc-50 text-ellipsis"
              value={inviteURL}
              readOnly
            />
            <Button
              size="icon"
              className="bg-gray-200 text-zinc-700 dark:text-white dark:bg-gray-600 hover:bg-gray-200/70 dark:hover:bg-gray-600/70"
              onClick={handleCopy}
              disabled={isLoading}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          {
            <Button
              variant="link"
              size="sm"
              className="text-xs text-zinc-500 dark:text-zinc-300 mt-4"
              disabled={isLoading}
              onClick={handleUpdateInviteLink}
            >
              Generate new link
              <RefreshCw
                className={cn("w-4 h-4 ml-2", isLoading && "animate-spin")}
              />
            </Button>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
