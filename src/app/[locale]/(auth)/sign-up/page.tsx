import { buildMetadata } from "@/libs/seo/metadata";
import SignUpPage from "@/modules/auth/ui/pages/sign-up.page";
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
    title: t("Sign up"),
    description: t("Sign up to create your TaskFlow account"),
    path: "/sign-up",
  });
}

const SignUp = () => {
  return <SignUpPage />;
};

export default SignUp;
