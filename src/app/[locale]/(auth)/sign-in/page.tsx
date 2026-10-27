import { buildMetadata } from "@/libs/seo/metadata";
import SignInPage from "@/modules/auth/ui/pages/sign-in.page";
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
    title: t("Sign in"),
    description: t("Sign in to your TaskFlow account"),
    path: "/sign-in",
  });
}

const SignIn = async () => {
  return <SignInPage />;
};

export default SignIn;
