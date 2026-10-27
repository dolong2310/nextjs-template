import QueryProvider from "@/components/providers/query.provider";
import ThemeProvider from "@/components/providers/theme.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  locale: string;
};

const Providers = ({ children, locale }: Props) => {
  return (
    <NextIntlClientProvider locale={locale}>
      <QueryProvider>
        <NuqsAdapter>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </QueryProvider>
    </NextIntlClientProvider>
  );
};

export default Providers;
