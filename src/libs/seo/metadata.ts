import { siteConfig } from "@/config/site.config";
import { absoluteUrl, getBaseUrl } from "@/libs/seo/url";
import type { Metadata } from "next";

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

const DEFAULT_DESCRIPTION = siteConfig.description;
const DEFAULT_IMAGE = siteConfig.ogImage;

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: BuildMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: getBaseUrl(),

    title,
    description,

    alternates: {
      canonical: url,
    },

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type,
      locale: siteConfig.locale,
      url,
      title: title ?? siteConfig.title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title ?? siteConfig.name,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title: title ?? siteConfig.title,
      description,
      images: [imageUrl],
      creator: siteConfig.creator,
    },
  };
}
