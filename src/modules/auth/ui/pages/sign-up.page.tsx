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
import { cn } from "@/utils/style.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Poppins } from "next/font/google";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number",
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive hyphens",
    )
    .transform((val) => val.toLowerCase()),
  email: z.string().email(),
  password: z.string(),
});

const SignUpPage = () => {
  const t = useTranslations();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (values: z.infer<typeof registerSchema>) => {
      return Promise.resolve(values);
    },
    onSuccess: async (data) => {
      setShowVerificationMessage(true);
      toast.success(
        t(
          "Registration successful! Please check your email to verify your account",
        ),
      );
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(values);
  };

  if (showVerificationMessage) {
    return (
      <div className="flex flex-col gap-8 p-4 lg:py-16 lg:px-20">
        <div className="text-center">
          <h1 className="text-3xl font-heading">{t("Check your email")}</h1>
          <p className="mt-4 text-muted-foreground">
            {t(
              "We've sent a verification link to your email address Please click the link to verify your account",
            )}
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
        className="flex flex-col gap-8 p-4 lg:p-16"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <span className={cn("text-2xl font-semibold", poppins.className)}>
              TaskFlow
            </span>
          </Link>

          <Link
            prefetch
            href="/sign-in"
            className="text-base border-none underline"
          >
            {t("Sign in")}
          </Link>
        </div>

        <h1 className="text-4xl font-medium">
          {t("Manage your tasks with TaskFlow")}
        </h1>

        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">{t("Username")}</FormLabel>
              <FormControl>
                <Input {...field} className="shadow-shadow" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={registerMutation.isPending}
        >
          {t("Create account")}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpPage;
