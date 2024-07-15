"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

interface NavItemProps {
  id: string;
  name: string;
  imageURL: string;
}

export default function NavItem({ id, name, imageURL }: NavItemProps) {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/spaces/${id}`);
  };

  return (
    <ActionTooltip label={name} side="right" align="center">
      <button
        className="flex items-center relative group"
        onClick={handleClick}
      >
        <div
          className={cn(
            "absolute left-0 rounded-r-full bg-primary transition-all duration-300 w-1",
            params?.spaceId !== id && "group-hover:h-5",
            params?.spaceId === id ? "h-10" : "h-2"
          )}
        />
        <div
          className={cn(
            "relative h-12 w-12 group flex mx-3 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden",
            params?.spaceId === id && "bg-primary/10 rounded-2xl text-primary"
          )}
        >
          <Image
            src={imageURL}
            alt={name + " image"}
            fill
            className="object-cover"
            sizes="20vw"
          />
        </div>
      </button>
    </ActionTooltip>
  );
}
