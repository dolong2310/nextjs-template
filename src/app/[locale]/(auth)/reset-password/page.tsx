import { buildMetadata } from "@/libs/seo/metadata";
import ResetPasswordPage from "@/modules/auth/ui/pages/reset-password.page";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/reset-password">): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale });

  return buildMetadata({
    title: t("Reset Password"),
    description: t("Reset your password"),
    path: "/reset-password",
  });
}

const ResetPassword = async ({
  searchParams,
}: PageProps<"/[locale]/reset-password">) => {
  const { token } = await searchParams;

  if (!token || typeof token !== "string") {
    redirect("/sign-in", "replace");
  }

  return <ResetPasswordPage token={token} />;
};

export default ResetPassword;
