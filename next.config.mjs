/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/i18next-react",
  assetPrefix: "/i18next-react/",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
