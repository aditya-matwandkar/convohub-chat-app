"use client";

import React from "react";
import Image from "next/image";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActionTooltip from "@/components/action-tooltip";
import UserAvatar from "@/components/user-avatar";
import { ShieldCheck, ShieldEllipsis } from "lucide-react";

const roleIcon = {
  ADMIN: <ShieldEllipsis className="h-4 w-4 ml-2 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-emerald-500" />,
  GUEST: null,
};

export default function OpenImageFile() {
  const router = useRouter();
  const params = useParams();

  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "openImageFile";

  const { imageFileInfo } = data;

  const handleMemberClick = () => {
    if (
      imageFileInfo?.sender.id === imageFileInfo?.currentMemberId ||
      imageFileInfo?.chatType === "chat"
    ) {
      return;
    }

    router.push(`/spaces/${params?.spaceId}/chats/${imageFileInfo?.sender.id}`);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-50 dark:bg-[#2b2f38] text-black dark:text-white px-2 py-2">
        <DialogHeader className="pt-1">
          <DialogTitle className="text-2xl text-center font-bold flex items-center gap-x-2">
            <div
              className="cursor-pointer hover:drop-shadow-md transition"
              onClick={handleMemberClick}
            >
              <UserAvatar
                src={imageFileInfo?.sender.profile.imageURL}
                className="md:h-8 md:w-8"
              />
            </div>
            <div className="w-full flex flex-col">
              <div className="flex items-center gap-x-2">
                <div className="flex items-center">
                  <p
                    className="text-sm md:text-base font-semibold cursor-pointer hover:underline"
                    onClick={handleMemberClick}
                  >
                    {imageFileInfo?.sender.profile.username}
                  </p>
                  {imageFileInfo?.chatType === "channel" && (
                    <ActionTooltip label={imageFileInfo.sender.role}>
                      {roleIcon[imageFileInfo.sender.role]}
                    </ActionTooltip>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <a href={imageFileInfo?.imageURL} target="_blank">
          <Image
            src={imageFileInfo?.imageURL!}
            alt={`picture of ${imageFileInfo?.imageURL}`}
            className="rounded-sm"
            width={500}
            height={500}
          />
        </a>
      </DialogContent>
    </Dialog>
  );
}
