import { ThemeProvider as Provider } from "@/contexts/theme.context";
import { getTheme } from "@/utils/theme.util";
import React from "react";

const ThemeProvider = async ({ children }: { children: React.ReactNode }) => {
  const defaultTheme = await getTheme();

  return <Provider defaultTheme={defaultTheme}>{children}</Provider>;
};

export default ThemeProvider;
