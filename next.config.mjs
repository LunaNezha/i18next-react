// Only the Pages build is mounted under the repository name.
const basePath = process.env.GITHUB_PAGES === "true" ? "/i18next-react" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // All locale pages are generated at build time; no middleware or server redirects.
  output: "export",
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
