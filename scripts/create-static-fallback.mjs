import { readFile, writeFile } from "node:fs/promises";
import nextConfig from "../next.config.mjs";

// GitHub Pages serves this file for paths that were not statically generated.
// Read the built route list so this stays in sync with generateStaticParams.
const manifest = JSON.parse(
  await readFile(
    new URL("../.next/prerender-manifest.json", import.meta.url),
    "utf8",
  ),
);
const locales = Object.keys(manifest.routes)
  .filter((route) => /^\/[^/.]+\/?$/.test(route))
  .map((route) => route.split("/")[1]);
const basePath = nextConfig.basePath;
const destination = `${basePath}/en/`;

await writeFile(
  new URL("../out/404.html", import.meta.url),
  `<!doctype html>
<html lang="en" dir="ltr">
<head><meta charset="utf-8"><title>Page not found</title></head>
<body>
<script>
  const basePath = ${JSON.stringify(basePath)};
  const path = window.location.pathname;
  if (!basePath || path === basePath || path.startsWith(basePath + "/")) {
    const segment = path.slice(basePath.length).split("/")[1];
    if (!${JSON.stringify(locales)}.includes(segment)) {
      window.location.replace(${JSON.stringify(destination)} + window.location.search + window.location.hash);
    }
  }
</script>
<h1>Page not found</h1>
<a href="${destination}">Continue in English</a>
</body>
</html>
`,
);
