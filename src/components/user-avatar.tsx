import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserAvatar({
  src,
  className,
}: {
  src?: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
      <AvatarFallback className="bg-gray-300">
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
}
