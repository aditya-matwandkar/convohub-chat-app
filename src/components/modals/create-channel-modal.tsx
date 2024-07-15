"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal-store";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import queryString from "query-string";
import { channelSchema } from "@/schemas/channel-schema";
import axios from "axios";
import ButtonSpinner from "../loaders/button-spinner/button-spinner";

export default function CreateChannelModel() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "createChannel";
  const { channelType } = data;

  const form = useForm({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channelType) {
      form.setValue("type", channelType);
    } else {
      form.setValue("type", ChannelType.TEXT);
    }
  }, [channelType, form]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof channelSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: "/api/channels",
        query: {
          spaceId: params?.spaceId,
        },
      });

      const response = await axios.post(url, values);
      form.reset();
      onClose();

      toast({
        title: "Channel created",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal error",
        description: "Failed to create the channel.",
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
            Create Channel
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-100">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter channel name"
                        autoComplete="off"
                        className="bg-zinc-300/50 dark:bg-[#1e242a] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-zinc-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="dark:text-[#EE4E4E]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-100">
                      Channel Type
                    </FormLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 dark:bg-[#1e242a] text-black dark:text-zinc-50 capitalize border-0 focus:ring-0 focus:ring-offset-0 outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            className="capitalize"
                            value={type}
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4 bg-gray-100 dark:bg-[#1e242a]">
              <Button
                disabled={isSubmitting}
                variant="primary"
                className="min-w-24"
                type="submit"
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
