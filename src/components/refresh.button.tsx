"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/style.util";
import { useGlobalStoreActions } from "@/stores/global/global.selector";
import { useQueryClient } from "@tanstack/react-query";
import { VariantProps } from "class-variance-authority";
import { RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export enum RefreshQueryKeys {
  Users = "users",
}

interface Props {
  invalidateKey?: RefreshQueryKeys;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

const RefreshButton = ({
  invalidateKey,
  variant = "default",
  size = "sm",
}: Props) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const { setLoadingGlobal } = useGlobalStoreActions();

  const [loading, setLoading] = useState(false);

  const iconSize = useMemo(() => {
    switch (size) {
      case "sm":
      case "icon":
        return "size-4";
      case "lg":
        return "size-5";
      default:
        return "size-5";
    }
  }, [size]);

  const invalidateQuery = () => {
    let queryKey: string[] | null = null;

    switch (invalidateKey) {
      case RefreshQueryKeys.Users:
        queryKey = ["users"];
        break;

      default:
        break;
    }

    if (!queryKey) return;
    queryClient.invalidateQueries({ queryKey });
  };

  const handleRefresh = () => {
    setLoading(true);
    setLoadingGlobal(true);
    invalidateQuery();
    setTimeout(() => {
      setLoading(false);
      setLoadingGlobal(false);
    }, 500);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="shrink-0"
          disabled={loading}
          onClick={handleRefresh}
        >
          <RefreshCwIcon
            className={cn(
              "transition-transform duration-500",
              iconSize,
              loading && "animate-spin",
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t("Refresh")}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RefreshButton;
