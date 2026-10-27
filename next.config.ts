import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  reactStrictMode: false,
};

const withNextIntl = createNextIntlPlugin("./src/libs/i18n/request.ts");

export default withNextIntl(nextConfig);
