"use client";

import React, { useEffect } from "react";
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

import axios from "axios";
import { createSpaceSchema } from "@/schemas/create-space-schema";
import ButtonSpinner from "../loaders/button-spinner/button-spinner";

export default function EditSpaceModal() {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose, type, data } = useModal();
  const { space } = data;

  const isModalOpen = isOpen && type === "editSpace";

  const form = useForm({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: "",
      imageURL: "",
    },
  });

  useEffect(() => {
    if (space) {
      form.setValue("name", space.name);
      form.setValue("imageURL", space.imageURL);
    }
  }, [space, form]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof createSpaceSchema>) => {
    try {
      const response = await axios.patch(
        `/api/spaces/${space?.id}/edit`,
        values
      );
      const result = response.data;
      form.reset();
      onClose();

      toast({
        title: `Space updated`,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal error",
        description: "Failed to update the space.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-50 dark:bg-[#2b2f38] text-black dark:text-white overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Space
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
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
                      <FormMessage className="dark:text-[#EE4E4E]" />
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
                {isSubmitting ? <ButtonSpinner /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
