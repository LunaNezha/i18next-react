/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/gc-capital-framer",
  assetPrefix: "/gc-capital-framer/",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
