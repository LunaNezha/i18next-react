# Visual asset maintenance

The README previews are real browser captures, stored as WebP to keep the repository small.
The editable icon source is `public/brand/globe.svg`; all raster sizes share that source.

## Regenerate icons

Use Node.js 22+ (for the built-in WebSocket client) and an installed Google Chrome.
The application itself retains its Node.js 20+ requirement.

```bash
node scripts/visual-assets.mjs --icons-only
```

The script defaults to Chrome's macOS application path. On another platform, set
`CHROME_PATH` to your Chrome/Chromium executable. It uses an isolated temporary
profile and removes it on exit. It does not require a browser automation dependency.

## Refresh screenshots

```bash
npm run build
node scripts/visual-assets.mjs
```

Ports 3137 (production preview) and 9223 (Chrome debugging) must be available.
Generate icons before building after changing the SVG so the production favicon
matches the source. Full mode also regenerates icons, captures the four README
screenshots, and checks live greetings, plural counts, direction overrides,
currency formats, keyboard tabs, saved themes, locale navigation with queries,
mobile overflow at 390px/320px, browser errors, and metadata asset responses.

Desktop captures use a 1440px viewport, wait for fonts, and disable motion. The four
files show English/Persian in light/dark mode; mobile checks do not create extra assets.
Review images after capture and commit them alongside documentation changes.
