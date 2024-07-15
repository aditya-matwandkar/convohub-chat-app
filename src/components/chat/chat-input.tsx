"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal-store";
import { Textarea } from "../ui/textarea";

import EmojiInput from "../emoji-input";
import { ChatInputSchema } from "@/schemas/chat-input-schema";
import queryString from "query-string";
import axios from "axios";

import { Plus, SendHorizonal } from "lucide-react";
import "@/style/custom-scrollbar.css";
import { useToast } from "../ui/use-toast";

interface ChatInputProps {
  apiURL: string;
  query: Record<string, any>;
}

export default function ChatInput({ apiURL, query }: ChatInputProps) {
  const { toast } = useToast();
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof ChatInputSchema>>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      content: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ChatInputSchema>) => {
    try {
      form.reset();
      const url = queryString.stringifyUrl({
        url: apiURL,
        query,
      });

      values.content = values.content.trim();

      const response = await axios.post(url, values);
    } catch (error) {
      console.log("Error while sending message", error);
      toast({
        title: "Internal error",
        description: "Failed to send the message.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleEnterKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };

    window.addEventListener("keypress", handleEnterKeyPress);

    return () => {
      window.removeEventListener("keypress", handleEnterKeyPress);
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="p-4 pb-6 relative">
                  <button
                    type="button"
                    className="h-6 w-6 p-1 flex items-center justify-center absolute top-7 left-8 rounded-full bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition"
                    onClick={() => onOpen("messageFile", { apiURL, query })}
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Textarea
                    className="pl-14 pr-[82px] pt-[12.5px] bg-zinc-200/90 dark:bg-[#1e242a]  text-zinc-600 dark:text-zinc-200 border-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 input-custom-scrollbar"
                    placeholder="Type a message"
                    autoComplete="off"
                    disabled={isSubmitting}
                    {...field}
                  />
                  <div className="flex absolute top-7 right-8 gap-x-3">
                    <EmojiInput
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                    <button type="submit">
                      <SendHorizonal className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition" />
                    </button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
