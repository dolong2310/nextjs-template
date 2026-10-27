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
import { Link } from "@/libs/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

const ForgotPasswordPage = () => {
  const t = useTranslations();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const [isEmailSent, setIsEmailSent] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: (values: z.infer<typeof forgotPasswordSchema>) => {
      return Promise.resolve(values);
    },
    onSuccess: () => {
      setIsEmailSent(true);
      toast.success(t("Reset email sent! Check your inbox"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    forgotPasswordMutation.mutate(values);
  };

  if (isEmailSent) {
    return (
      <div className="flex flex-col gap-8 p-4 lg:py-16 lg:px-20">
        <div className="text-center">
          <h1 className="text-3xl font-heading">{t("Check your email")}</h1>
          <p className="mt-4 text-muted-foreground">
            {t("We've sent a password reset link to your email address")}
          </p>
        </div>

        <Button asChild variant="neutral" className="w-full">
          <Link href="/sign-in">{t("Back to Sign In")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8 p-4 lg:py-16 lg:px-20"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <h1 className="text-3xl font-heading">
            {t("Forgot your password?")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t(
              "Enter your email address and we'll send you a link to reset your password",
            )}
          </p>
        </div>

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">{t("Email")}</FormLabel>
              <FormControl>
                <Input {...field} className="shadow-shadow" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending
            ? `${t("Sending")}...`
            : t("Send Reset Link")}
        </Button>

        <div className="text-center">
          <Link href="/sign-in" className="text-base border-none underline">
            {t("Back to Sign In")}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordPage;
