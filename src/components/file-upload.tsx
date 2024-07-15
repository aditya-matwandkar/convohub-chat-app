"use client";

import React from "react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import { FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  endpoint: "messageFile" | "spaceImage";
  onChange: (url?: string) => void;
  value: string;
}

export default function FileUpload({
  endpoint,
  onChange,
  value,
}: FileUploadProps) {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div
        className={cn(
          endpoint === "spaceImage" && "relative h-24 w-24",
          endpoint === "messageFile" && "relative h-60 w-80"
        )}
      >
        <Image
          fill
          src={value}
          alt="Upload image"
          className={cn(
            endpoint === "spaceImage" && "object-cover rounded-full",
            endpoint === "messageFile" && "object-cover rounded-md border"
          )}
          sizes="24vw"
        />
        <button
          onClick={() => onChange("")}
          className={cn(
            "bg-red-700 hover:bg-red-800 rounded-full text-white p-1 absolute shadow-md",
            endpoint === "spaceImage" && " top-0 right-0",
            endpoint === "messageFile" && " -top-2 -right-2"
          )}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="flex items-center p-2 mt-2 relative rounded-md bg-background/10">
        <FileText className="h-10 w-10 fill-gray-50 stroke-gray-800" />
        <a
          href={value}
          className="ml-2 text-sm text-gray-800 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-red-700 hover:bg-red-800 rounded-full text-white p-1 absolute -top-2 -right-2 shadow-md"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log("error:", error);
        }}
        appearance={{
          container: "dark:border-zinc-200 border-2 rounded-lg",
          label: "text-black dark:text-zinc-100",
          allowedContent: "text-zinc-500 dark:text-zinc-400",
          button: "bg-gray-700 dark:bg-gray-600",
        }}
      />
    </>
  );
}
