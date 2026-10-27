import { ThemeMode } from "@/contexts/theme.context";
import { cookies } from "next/headers";

export const getTheme = async (): Promise<ThemeMode> => {
  "use server";
  const cookieStore = await cookies();
  return (cookieStore.get("theme")?.value as ThemeMode | undefined) || "light";
};
