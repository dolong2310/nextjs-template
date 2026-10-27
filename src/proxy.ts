import { routing } from "@/libs/i18n/routing";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  return intlMiddleware(req);
}
