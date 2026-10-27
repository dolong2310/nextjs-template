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
import { Link, useRouter } from "@/libs/i18n/navigation";
import { cn } from "@/utils/style.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Poppins } from "next/font/google";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const SignInPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: (values: z.infer<typeof loginSchema>) => {
      return Promise.resolve(values);
    },
    onSuccess: async (data) => {
      router.push("/");
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

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
            href="/sign-up"
            className="text-base border-none underline"
          >
            {t("Sign up")}
          </Link>
        </div>

        <h1 className="text-4xl font-medium">{t("Welcome back to TaskFlow")}</h1>

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
          disabled={loginMutation.isPending}
        >
          {t("Login")}
        </Button>

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-base border-none underline"
          >
            {t("Forgot your password?")}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignInPage;
