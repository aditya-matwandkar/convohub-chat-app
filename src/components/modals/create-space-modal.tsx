"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal-store";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import FileUpload from "../file-upload";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createSpaceSchema } from "@/schemas/create-space-schema";
import axios from "axios";
import ButtonSpinner from "../loaders/button-spinner/button-spinner";

export default function CreateSpaceModel() {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "createSpace";

  const form = useForm({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: "",
      imageURL: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof createSpaceSchema>) => {
    try {
      const response = await axios.post("/api/spaces", values);
      const result = response.data;
      form.reset();
      onClose();
      router.push(`/spaces/${result.id}`);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal error",
        description: "Failed to create the space.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-50 dark:bg-[#2b2f38] text-black dark:text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Your Space
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 dark:text-zinc-400">
            Bring your space to life with a name and an image. You can always
            change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="imageURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="spaceImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-100">
                      Space Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter space name"
                        autoComplete="off"
                        className="bg-zinc-300/50 dark:bg-[#1e242a] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-zinc-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="dark:text-[#EE4E4E]" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4 bg-gray-100 dark:bg-[#1e242a]">
              <Button
                disabled={isSubmitting}
                variant="primary"
                className="min-w-24"
              >
                {isSubmitting ? <ButtonSpinner /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
