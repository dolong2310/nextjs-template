"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/libs/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  token: string;
};

const resetPasswordFormSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = ({ token }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (values: { token: string; password: string }) => {
      return Promise.resolve(values);
    },
    onSuccess: async (data) => {
      toast.success(t("Password reset successfully!"));
      router.push("/");
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordFormSchema>) => {
    if (!token) {
      toast.error(t("Invalid or missing token"));
      return;
    }

    resetPasswordMutation.mutate({
      token,
      password: values.password,
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8 p-4 lg:py-16 lg:px-20"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <h1 className="text-3xl font-heading">{t("Reset your password")}</h1>
          <p className="mt-4 text-muted-foreground">
            {t("Enter your new password below")}
          </p>
        </div>

        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">{t("Password")}</FormLabel>
              <FormControl>
                <Input {...field} className="shadow-shadow" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                {t("Confirm Password")}
              </FormLabel>
              <FormControl>
                <Input {...field} className="shadow-shadow" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending
            ? `${t("Resetting")}...`
            : t("Reset Password")}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordPage;
