import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";

export const useSession = () => {
  const { data, status, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.getSession,
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/whoami");

        if (!res.ok) {
          return null;
        }

        const data = (await res.json()) as {
          id: number;
          email: string;
          preferedLocation: string;
        };

        return data;
      } catch (e) {
        return null;
      }
    },
    staleTime: Infinity,
    initialData: null,
    initialDataUpdatedAt: 0,
  });

  return { session: data, status, isLoggedIn: data !== null, isLoading: isLoading || isFetching };
};
