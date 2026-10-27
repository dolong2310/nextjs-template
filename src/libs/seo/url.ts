import { siteConfig } from "@/config/site.config";

export function getBaseUrl() {
  return new URL(siteConfig.url);
}

export function absoluteUrl(path = "/") {
  const baseUrl = getBaseUrl();

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path, baseUrl).toString();
}
