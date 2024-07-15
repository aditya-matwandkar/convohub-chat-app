import { useEffect } from "react";
import { useSocket } from "@/components/providers/socket-provider";

import { useQueryClient } from "@tanstack/react-query";
import { MessageWithMembersWithProfile } from "@/types";

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: {
  addKey: string;
  updateKey: string;
  queryKey: string;
}) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMembersWithProfile) => {
      queryClient.setQueryData([queryKey], (prevData: any) => {
        if (!prevData || !prevData.pages || prevData.pages.length === 0) {
          return prevData;
        }

        const newData = prevData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMembersWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        return {
          ...prevData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (message: MessageWithMembersWithProfile) => {
      queryClient.setQueryData([queryKey], (prevData: any) => {
        if (!prevData || !prevData.pages || prevData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = [...prevData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...prevData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(updateKey);
      socket.off(addKey);
    };
  }, [queryClient, updateKey, addKey, socket, queryKey]);
};
