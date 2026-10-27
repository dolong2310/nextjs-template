import { ApiError } from "@/libs/error/api-error";
import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof ApiError && !error.isUnauthorized) {
          toast.error(error.message);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (error instanceof ApiError && !error.isUnauthorized) {
          toast.error(error.message);
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retryDelay: (attemptIndex) => {
          // min: 1s, max: 30s => step: 2^n * 1s
          return Math.min(1000 * 2 ** attemptIndex, 30000);
        },
        retry: (failureCount, error) => {
          // skip retry for 4xx errors
          if (error instanceof ApiError && error.status && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => {
          return (
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending"
          );
        },
        shouldRedactErrors: () => {
          return false;
        },
      },
    },
  });
}
