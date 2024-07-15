"use client";

import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import queryString from "query-string";
import axios from "axios";

export default function DeleteMessageModal() {
  const { toast } = useToast();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";

  const { apiURL, query } = data;
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteChannel = async () => {
    try {
      setIsLoading(true);

      const url = queryString.stringifyUrl({
        url: apiURL || "",
        query,
      });

      const response = await axios.delete(url);

      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal error",
        description: "Failed to delete the message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-50 dark:bg-[#2b2f38] text-black dark:text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 dark:text-zinc-400">
            Are you sure you want to delete this message?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 bg-gray-100 dark:bg-[#1e242a]">
          <div className="w-full flex items-center justify-end gap-4">
            <Button
              variant="ghost"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-zinc-300 hover:text-black"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteChannel}
              disabled={isLoading}
              className="min-w-24"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
