"use client";

import { makeQueryClient } from "@/libs/query-client";
import { type QueryClient, environmentManager } from "@tanstack/react-query";

let browserQueryClient: QueryClient;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
