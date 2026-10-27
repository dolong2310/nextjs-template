import { envConfig } from "@/config/env.config";
import { siteConfig } from "@/config/site.config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  if (!envConfig.isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
