"use client";

import LocaleButton from "@/components/locale.button";
import ThemeButton from "@/components/theme.button";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function Home() {
  const t = useTranslations();

  return (
    <div>
      {t("hello")}
      <LocaleButton />
      <ThemeButton />
      <Button onClick={() => toast.success("Hello")}>Hello</Button>
    </div>
  );
}
