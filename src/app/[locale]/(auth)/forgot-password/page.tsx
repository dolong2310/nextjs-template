import { buildMetadata } from "@/libs/seo/metadata";
import ForgotPasswordPage from "@/modules/auth/ui/pages/forgot-password.page";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale });

  return buildMetadata({
    title: t("Forgot Password"),
    description: t("Forgot your TaskFlow password"),
    path: "/forgot-password",
  });
}

const ForgotPassword = () => {
  return <ForgotPasswordPage />;
};

export default ForgotPassword;
