import Providers from "@/components/providers";
import TopBarLoader from "@/components/top-bar-loader";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site.config";
import { routing } from "@/libs/i18n/routing";
import { buildMetadata } from "@/libs/seo/metadata";
import { getTheme } from "@/utils/theme.util";
import type { Metadata } from "next";
import { hasLocale, Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DM_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";

import "@/styles/globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap", // Prevent FOIT (Flash of Invisible Text)
  preload: true, // Preload font for better performance
  fallback: ["system-ui", "arial", "sans-serif"], // Fallback fonts
  adjustFontFallback: true, // Adjust fallback font metrics to minimize layout shift
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    ...buildMetadata({
      title: siteConfig.title,
      description: t(siteConfig.description),
      path: "/",
      image: siteConfig.ogImage,
    }),

    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },

    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },

    manifest: "/site.webmanifest",

    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const defaultTheme = await getTheme();

  return (
    <html
      lang="en"
      className={twMerge(defaultTheme, `${dmSans.variable} h-full antialiased`)}
      suppressHydrationWarning
      // data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <Providers locale={locale}>
          <TopBarLoader />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
