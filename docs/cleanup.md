# Cleanup inventory

This inventory records removals made during the visual identity and maintenance
cleanup. Existing uncommitted i18n/UI work was preserved. Earlier staged or working
tree deletions under `app/i18n`, `@types`, `constants`, and `enums` predated this task;
this cleanup removed their remaining empty directories.

## Files and folders removed

- `.DS_Store`
- `@types`
- `app/[lng]/favicon.ico`
- `app/i18n`
- `constants`
- `enums`
- `features`
- `public/.DS_Store`
- `public/fonts/IranYekan/eot`
- `public/fonts/IranYekan/eot/black.eot`
- `public/fonts/IranYekan/eot/bold.eot`
- `public/fonts/IranYekan/eot/extrablack.eot`
- `public/fonts/IranYekan/eot/extrabold.eot`
- `public/fonts/IranYekan/eot/light.eot`
- `public/fonts/IranYekan/eot/medium.eot`
- `public/fonts/IranYekan/eot/regular.eot`
- `public/fonts/IranYekan/eot/thin.eot`
- `public/fonts/IranYekan/svg`
- `public/fonts/IranYekan/svg/black.svg`
- `public/fonts/IranYekan/svg/bold.svg`
- `public/fonts/IranYekan/svg/extrablack.svg`
- `public/fonts/IranYekan/svg/extrabold.svg`
- `public/fonts/IranYekan/svg/light.svg`
- `public/fonts/IranYekan/svg/medium.svg`
- `public/fonts/IranYekan/svg/regular.svg`
- `public/fonts/IranYekan/svg/thin.svg`
- `public/fonts/IranYekan/ttf`
- `public/fonts/IranYekan/ttf/black.ttf`
- `public/fonts/IranYekan/ttf/bold.ttf`
- `public/fonts/IranYekan/ttf/extrablack.ttf`
- `public/fonts/IranYekan/ttf/extrabold.ttf`
- `public/fonts/IranYekan/ttf/light.ttf`
- `public/fonts/IranYekan/ttf/medium.ttf`
- `public/fonts/IranYekan/ttf/regular.ttf`
- `public/fonts/IranYekan/ttf/thin.ttf`
- `public/fonts/IranYekan/woff/black.woff`
- `public/fonts/IranYekan/woff/extrablack.woff`
- `public/fonts/IranYekan/woff/extrabold.woff`
- `public/fonts/IranYekan/woff/light.woff`
- `public/fonts/IranYekan/woff/thin.woff`
- `public/fonts/Montserrat/Montserrat-Black.ttf`
- `public/fonts/Montserrat/Montserrat-ExtraBold.ttf`
- `public/fonts/Montserrat/Montserrat-ExtraLight.ttf`
- `public/fonts/Montserrat/Montserrat-Light.ttf`
- `public/fonts/Montserrat/Montserrat-Thin.ttf`
- `public/images`
- `public/images/.DS_Store`
- `public/images/header-bg.png`
- `public/images/header.png`
- `public/images/iran.png`
- `public/images/screenshot.png`
- `public/images/united-states.png`
- `public/styles/font-families.module.css`

## Generated local assets removed after verification

- `.next/` — regenerated for the successful production build and browser checks, then removed.
- `tsconfig.tsbuildinfo` — disposable TypeScript incremental cache.

`node_modules/` remains available for local development and is already ignored by Git.
Run `npm run build` again before `npm start`.

## Dependency and code cleanup

Removed unused runtime dependencies `accept-language`,
`i18next-browser-languagedetector`, `i18next-resources-to-backend`, and `react-cookie`,
including orphaned lockfile entries. Moved Prettier, its Tailwind plugin, and the
optional translation-interface generator into development dependencies.

Removed unused dropdown submenu, checkbox, group, label, separator, portal alias,
and shortcut wrappers and their icon imports. Kept the used primitives and
intentional button variants. No duplicate application components were found.

Replaced duplicate font-face declarations and legacy EOT/TTF Persian fallbacks
with the retained WOFF files; removed unused font weights. Retained Montserrat
400/500/600/700 and Persian 400/500/700, including bold fallback for semibold text.
The old Montserrat ExtraBold declaration incorrectly shared the bold weight.

Enabled unused-symbol checks in TypeScript and ESLint, corrected editor locale
paths, and removed Tailwind scan paths for nonexistent source directories and
public assets. Kept active framework, PostCSS, formatter, and shadcn configuration.

Replaced the unrelated manifest and its broken asset URLs with Locale branding.
The old localized favicon was replaced by a shared root app favicon.

## Verification

- Translation validation: both locale dictionaries pass with 95 keys each.
- TypeScript, ESLint, and production build passed.
- Browser checks passed for greetings, plural quantities, direction overrides,
  currency selection, keyboard tabs, persisted themes, query-preserving language
  navigation, and 390px/320px layouts, with no browser or hydration errors.
- Icon, Apple icon, SVG, manifest, and manifest icon URLs returned HTTP 200;
  rendered head links were checked.
- Repository formatting and Git whitespace checks passed.
