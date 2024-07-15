"use client";

import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

import UserAvatar from "@/components/user-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  CircleUserRound,
  EllipsisVertical,
  Loader2,
  ShieldCheck,
  ShieldEllipsis,
  ShieldQuestion,
  UserRoundX,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { SpaceWithMembersWithProfiles } from "@/types";
import queryString from "query-string";
import axios from "axios";

const roleIcon = {
  ADMIN: <ShieldEllipsis className="h-4 w-4 ml-2 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-emerald-500" />,
  GUEST: null,
};

export default function ManageMembersModal() {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "members";

  const [loadingId, setLoadingId] = useState("");

  const { space } = data as { space: SpaceWithMembersWithProfiles };

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = queryString.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          spaceId: space.id,
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { space: response.data });
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal error",
        description: "Failed to update the member role.",
        variant: "destructive",
      });
    } finally {
      setLoadingId("");
    }
  };

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = queryString.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          spaceId: space.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { space: response.data });
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal error",
        description: "Failed to kick the member.",
        variant: "destructive",
      });
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-50 dark:bg-[#2b2f38] text-black dark:text-white overflow-hidden py-0 pb-2">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 dark:text-zinc-400">
            {space?.members?.length}{" "}
            {space?.members?.length < 2 ? "member" : "members"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[420px] mt-8 pr-6">
          {space?.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-x-2 mb-6 group"
            >
              <UserAvatar src={member.profile.imageURL} />
              <div className="flex flex-col gap-y- pl-1">
                <div className="flex items-center text-xs md:text-sm font-semibold">
                  {member.profile.username}
                  {roleIcon[member.role]}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-300">
                  {member.profile.email}
                </p>
              </div>
              {space.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto mr-[2px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-full">
                        <EllipsisVertical className="h-4 w-4 text-zinc-600 dark:text-zinc-100 hidden group-hover:block transition" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="h-4 w-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, "GUEST")
                                }
                              >
                                <CircleUserRound className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleKick(member.id)}>
                          <UserRoundX className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="h-4 w-4 ml-auto text-zinc-500 animate-spin" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
