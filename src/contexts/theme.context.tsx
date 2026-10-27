"use client";

import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme: ThemeMode | undefined;
}

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeToDocument(theme: ThemeMode) {
  const html = document.documentElement;

  if (theme === "dark") {
    html.classList.add("dark");
    html.classList.remove("light");
    html.style.colorScheme = "dark";
    html.setAttribute("data-theme", "dark");
  } else {
    html.classList.add("light");
    html.classList.remove("dark");
    html.style.colorScheme = "light";
    html.setAttribute("data-theme", "light");
  }
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = Cookies.get("theme") as ThemeMode | undefined;
    return defaultTheme ?? savedTheme ?? "light";
  });

  useEffect(() => {
    Cookies.set("theme", theme, { expires: 365 });
    applyThemeToDocument(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
