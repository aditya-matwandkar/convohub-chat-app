import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";

import queryString from "query-string";
import axios from "axios";

interface UseChatQueryProps {
  queryKey: string;
  apiURL: string;
  paramKey: "channelId" | "chatId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiURL,
  paramKey,
  paramValue,
}: UseChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = queryString.stringifyUrl(
      {
        url: apiURL,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const response = await axios.get(url);
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
