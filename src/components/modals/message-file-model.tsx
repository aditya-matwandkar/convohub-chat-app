"use client";

import React from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

import { MessageFileSchema } from "@/schemas/chat-input-schema";
import queryString from "query-string";
import axios from "axios";

export default function MessageFileModal() {
  const router = useRouter();

  const { isOpen, onClose, data, type } = useModal();

  const isModalOpen = isOpen && type === "messageFile";
  const { apiURL, query } = data;

  const form = useForm({
    resolver: zodResolver(MessageFileSchema),
    defaultValues: {
      fileURL: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof MessageFileSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: apiURL || "",
        query,
      });

      const response = await axios.post(url, {
        ...values,
        content: values.fileURL,
      });

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
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
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 dark:text-zinc-400">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="fileURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="px-6 py-4 bg-gray-100 dark:bg-[#1e242a]">
              <Button
                disabled={isSubmitting}
                variant="primary"
                className="min-w-24"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
