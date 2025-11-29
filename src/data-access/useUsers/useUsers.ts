import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { UsersResponse } from "./types";

export const USERS_QUERY_KEY = "users";

export const useUsers = () => {
  const queryResult = useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async () => {
      const response = await api.get<UsersResponse>("/users");
      return response.data;
    },
  });

  return {
    ...queryResult,
    users: queryResult.data ?? [],
  };
};
