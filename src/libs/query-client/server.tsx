import "server-only";

import { makeQueryClient } from "@/libs/query-client";
import { cache } from "react";

export const getQueryClient = cache(makeQueryClient);
