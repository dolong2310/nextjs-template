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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const resendVerificationSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

const VerifyEmailPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof resendVerificationSchema>>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const { mutate: verifyEmail } = useMutation({
    mutationFn: (values: { token: string }) => {
      return Promise.resolve({
        message: "Email verified successfully",
        requiresLogin: true,
      });
    },
    onSuccess: (data) => {
      setVerificationStatus("success");
      toast.success(t(data.message));

      if (data.requiresLogin) {
        setTimeout(() => {
          router.push("/sign-in?message=verification-success");
        }, 3000);
      }
    },
    onError: (error) => {
      setVerificationStatus("error");
      setErrorMessage(error.message);
      toast.error(t(error.message));
    },
  });

  const resendMutation = useMutation({
    mutationFn: (values: z.infer<typeof resendVerificationSchema>) => {
      return Promise.resolve(values);
    },
    onSuccess: () => {
      toast.success(t("Verification email sent! Please check your inbox"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (values: z.infer<typeof resendVerificationSchema>) => {
    resendMutation.mutate({ email: values.email });
  };

  useEffect(() => {
    if (!token) return;

    // Auto verify
    verifyEmail({ token });
  }, [token, verifyEmail]);

  const displayedStatus = token ? verificationStatus : "error";

  const displayedErrorMessage = token
    ? errorMessage
    : t("The verification link is invalid or has expired");

  if (displayedStatus === "loading") {
    return (
      <div className="flex flex-col gap-8 p-4 lg:py-16 lg:px-20">
        <div className="flex justify-center">
          <LoaderIcon className="size-12 animate-spin" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-heading">
            {t("Verifying your email")}...
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t("Please wait while we verify your email address")}
          </p>
        </div>
      </div>
    );
  }

  if (displayedStatus === "success") {
    return (
      <div className="flex flex-col gap-8 p-4 lg:py-16 lg:px-20">
        <div className="text-center">
          <h1 className="text-3xl font-heading">{t("Email Verified!")}</h1>
          <p className="mt-4 text-muted-foreground">
            {t(
              "Your email has been successfully verified You will be redirected to the sign in shortly",
            )}
          </p>
        </div>

        <Button asChild variant="neutral" className="w-full">
          <Link href="/sign-in">{t("Back to Sign In")}</Link>
        </Button>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col gap-8 p-4 lg:py-16 lg:px-20">
      <div className="text-center">
        <h1 className="text-3xl font-heading">{t("Verification Failed")}</h1>
        <p className="mt-4 text-muted-foreground">{displayedErrorMessage}</p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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

          <div className="space-y-4">
            <Button
              type="submit"
              variant="default"
              disabled={resendMutation.isPending}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              {resendMutation.isPending
                ? `${t("Sending")}...`
                : t("Resend Verification Email")}
            </Button>

            <Button asChild variant="neutral" className="w-full">
              <Link href="/sign-in">{t("Back to Sign In")}</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VerifyEmailPage;
