"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Member, MemberRole, Profile, Space } from "@prisma/client";

import UserAvatar from "../user-avatar";
import { ShieldCheck, ShieldEllipsis } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpaceMemberProps {
  member: Member & { profile: Profile };
  space: Space;
}

const roleIcon = {
  [MemberRole.ADMIN]: <ShieldEllipsis className="h-4 w-4 mr-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
  ),
  [MemberRole.GUEST]: null,
};

export default function SpaceMember({ member, space }: SpaceMemberProps) {
  const router = useRouter();
  const params = useParams();

  const icon = roleIcon[member.role];

  const handleClick = () => {
    router.push(`/spaces/${params?.spaceId}/chats/${member.id}`);
  };

  return (
    <button
      className={cn(
        "group w-full p-2 mb-1 rounded-md flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
      onClick={handleClick}
    >
      <UserAvatar
        src={member.profile.imageURL}
        className="h-7 w-7 md:h-7 md:w-7"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.username}
      </p>
      {icon}
    </button>
  );
}
