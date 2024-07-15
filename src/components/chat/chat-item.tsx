"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useModal } from "@/hooks/use-modal-store";
import { Member, MemberRole, Profile } from "@prisma/client";

import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { ChatInputSchema } from "@/schemas/chat-input-schema";
import queryString from "query-string";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  Edit2,
  FileText,
  ShieldCheck,
  ShieldEllipsis,
  Trash2,
} from "lucide-react";

const roleIcon = {
  ADMIN: <ShieldEllipsis className="h-4 w-4 ml-2 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-emerald-500" />,
  GUEST: null,
};

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  type: string;
  socketURL: string;
  socketQuery: Record<string, string>;
  timestamp: string;
  fileURL: string | null;
  currentMember: Member;
  isUpdated: boolean;
  isDeleted: boolean;
}

export default function ChatItem({
  id,
  content,
  member,
  type,
  socketURL,
  socketQuery,
  timestamp,
  fileURL,
  currentMember,
  isUpdated,
  isDeleted,
}: ChatItemProps) {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { onOpen } = useModal();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof ChatInputSchema>>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isMessageOwner = currentMember.id === member.id;
  const canDeleteMessage =
    !isDeleted && (isAdmin || isModerator || isMessageOwner);
  const canEditMessage = !isDeleted && isMessageOwner && !fileURL;

  const fileType = fileURL?.split(".").pop();
  const isPDF = fileType === "pdf" && fileURL;
  const isImage = !isPDF && fileURL;

  const { isSubmitting } = form.formState;

  const handleMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/spaces/${params?.spaceId}/chats/${member.id}`);
  };

  const onSubmit = async (values: z.infer<typeof ChatInputSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketURL}/${id}`,
        query: socketQuery,
      });

      values.content = values.content.trim();

      const response = await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal error",
        description: "Failed to update the message.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleEscKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleEscKeyDown);

    return () => {
      window.removeEventListener("keydown", handleEscKeyDown);
    };
  }, []);

  return (
    <div className="w-full relative flex items-center group p-4 hover:bg-black/10 transition">
      <div className="w-full flex items-start group gap-x-2 whitespace-pre-wrap">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
          onClick={handleMemberClick}
        >
          <UserAvatar src={member.profile.imageURL} />
        </div>
        <div className="w-full flex flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="text-sm font-semibold cursor-pointer hover:underline"
                onClick={handleMemberClick}
              >
                {member.profile.username}
              </p>
              {type === "channel" && (
                <ActionTooltip label={member.role}>
                  {roleIcon[member.role]}
                </ActionTooltip>
              )}
            </div>
            <span className="text-[10px] leading-3 text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isPDF && (
            <div className="flex items-center py-2 relative rounded-md">
              <a
                href={fileURL}
                className="ml-2 text-sm flex items-center gap-x-1 text-zinc-800 dark:text-zinc-100 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-10 w-10 fill-gray-50 stroke-gray-800" />
                PDF file
              </a>
            </div>
          )}
          {isImage && (
            <div
              className="h-48 w-48 flex items-center mt-2 relative aspect-square bg-secondary border rounded-md overflow-hidden"
              onClick={() =>
                onOpen("openImageFile", {
                  imageFileInfo: {
                    imageURL: fileURL,
                    chatType: type,
                    sender: member,
                    currentMemberId: currentMember.id,
                  },
                })
              }
            >
              <Image
                fill
                src={fileURL}
                alt={content}
                className="object-cover cursor-pointer"
                sizes="24vw"
              />
            </div>
          )}

          {!fileURL && !isEditing && (
            <p
              className={cn(
                "text-sm mt-1 text-zinc-600 dark:text-zinc-300",
                isDeleted && "italic text-zinc-500 dark:text-zinc-400 text-xs"
              )}
            >
              {content}
              {isUpdated && !isDeleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (Edited)
                </span>
              )}
            </p>
          )}
          {!fileURL && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col pt-2 gap-y-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="w-full relative">
                          <Textarea
                            placeholder="Edited message"
                            className="h-32 p-2 text-zinc-600 dark:text-zinc-200 bg-zinc-200/90 dark:bg-[#1e242a] border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 custom-scrollbar"
                            autoComplete="off"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-x-2 self-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 p-1 rounded-sm absolute -top-2 right-5 border bg-white dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit2
                className="h-4 w-4 ml-auto cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash2
              className="h-4 w-4 ml-auto cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              onClick={() =>
                onOpen("deleteMessage", {
                  apiURL: `${socketURL}/${id}`,
                  query: socketQuery,
                })
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}
