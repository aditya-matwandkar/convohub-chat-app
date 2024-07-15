"use client";

import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

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

import axios from "axios";
import ButtonSpinner from "../loaders/button-spinner/button-spinner";

export default function DeleteSpaceModal() {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteSpace";

  const { space } = data;
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteSpace = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/spaces/${space?.id}`);

      onClose();
      toast({
        title: `Channel '${space?.name}' deleted`,
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal error",
        description: "Failed to delete the space.",
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
            Delete '{space?.name}' Space
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 dark:text-zinc-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-emerald-700 dark:text-emerald-500">
              {space?.name}
            </span>
            ? This action cannot be undone.
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
              onClick={handleDeleteSpace}
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? <ButtonSpinner /> : "Delete Space"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
