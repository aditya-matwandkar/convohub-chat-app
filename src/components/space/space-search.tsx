"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface SpaceSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          id: string;
          name: string;
          icon: React.ReactNode;
        }[]
      | undefined;
  }[];
}

export default function SpaceSearch({ data }: SpaceSearchProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if ((e.key === "i" || e.key === "I") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", keyDown);

    return () => document.removeEventListener("keydown", keyDown);
  }, []);

  const handleClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "channel") {
      return router.push(`/spaces/${params?.spaceId}/channels/${id}`);
    }

    if (type === "member") {
      return router.push(`/spaces/${params?.spaceId}/chats/${id}`);
    }
  };

  return (
    <div>
      <button
        className="w-full p-2 rounded-md flex items-center gap-x-2 group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="h-5 px-1.5 text-[10px] inline-flex items-center gap-1 pointer-events-none select-none rounded border bg-muted dark:bg-[#0F0F0F] font-mono font-medium text-muted-foreground ml-auto">
          Ctrl I
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) {
              return null;
            }

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => handleClick({ id, type })}
                  >
                    {icon} <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
