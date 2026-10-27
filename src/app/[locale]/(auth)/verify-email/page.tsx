import { buildMetadata } from "@/libs/seo/metadata";
import VerifyEmailPage from "@/modules/auth/ui/pages/verify-email.page";
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
    title: t("Verify Email"),
    description: t("Verify your email address"),
    path: "/verify-email",
  });
}

const VerifyEmail = () => {
  return <VerifyEmailPage />;
};

export default VerifyEmail;
