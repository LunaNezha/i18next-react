import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Github,
  Globe2,
  Layers3,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";
import LanguageSwitcher from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DemoWorkspace,
  IntegrationExamples,
  ShowcaseCards,
} from "@/components/demo/showcase";
import { getTranslation } from "@/lib/i18n/server";
import { fallbackLng, isLocale, languages } from "@/lib/i18n/config";
import { getResources } from "@/lib/i18n/resources";
import { getDemoFormats } from "@/lib/i18n/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const repository = "https://github.com/LunaNezha/i18next-react";

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function Home({ params }: { params: { lng: string } }) {
  const { lng } = params;
  if (!isLocale(lng)) notFound();
  const { t } = await getTranslation(lng);
  const resources = await getResources(lng);
  const contentLocale = resources[lng] ? lng : fallbackLng;
  const formats = getDemoFormats(contentLocale);

  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <a
        href="#main-content"
        className="focus-ring fixed start-4 top-4 z-50 -translate-y-24 rounded-lg bg-accent px-5 py-3 text-sm text-accent-foreground focus:translate-y-0"
      >
        {t("site.skip")}
      </a>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[650px]"
      >
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 top-0 mx-auto h-96 max-w-4xl bg-[radial-gradient(ellipse_at_top,rgb(var(--accent)/0.08),transparent_65%)]" />
      </div>

      <header className="mx-auto flex min-h-24 max-w-[1184px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href={`/${lng}`}
          aria-label={t("site.home")}
          className="focus-ring flex shrink-0 items-center gap-2.5 rounded-lg"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Globe2 className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span
            className="text-xl font-semibold tracking-[-0.06em]"
            lang="en"
            dir="ltr"
          >
            locale<span className="text-accent">.</span>
          </span>
          <span
            className="ms-1 hidden rounded-md border border-line bg-surface/60 px-1.5 py-0.5 font-mono text-[9px] text-subtle sm:inline"
            lang="en"
          >
            / i18n
          </span>
        </Link>
        <nav
          aria-label={t("site.navigation")}
          className="hidden items-center gap-7 text-xs font-medium text-subtle md:flex"
        >
          <a
            href="#playground"
            className="focus-ring rounded-sm transition-colors hover:text-ink"
          >
            {t("site.playground")}
          </a>
          <a
            href="#integration"
            className="focus-ring rounded-sm transition-colors hover:text-ink"
          >
            {t("site.integration")}
          </a>
          <a
            href={repository}
            className="focus-ring flex items-center gap-1 rounded-sm transition-colors hover:text-ink"
          >
            {t("site.github")}
            <ArrowUpRight
              className="size-3.5 rtl:-rotate-90"
              aria-hidden="true"
            />
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          <Suspense
            fallback={
              <span
                aria-hidden="true"
                className="h-11 w-28 rounded-xl border border-line bg-surface"
              />
            }
          >
            <LanguageSwitcher />
          </Suspense>
          <ThemeSwitcher />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="outline-none">
        <section
          aria-labelledby="hero-heading"
          className="mx-auto max-w-4xl px-5 pb-12 pt-12 text-center sm:px-8 sm:pb-14 sm:pt-16"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-2 text-[10px] font-medium text-subtle shadow-sm">
            <span
              className="size-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            {t("hero.badge")}
            <span aria-hidden="true" className="mx-0.5 h-3 w-px bg-line" />
            <span className="text-accent">{t("hero.badgeEnd")}</span>
          </div>
          <h1
            id="hero-heading"
            className="text-balance text-[clamp(2.5rem,6vw,4.75rem)] font-medium leading-[1.12] tracking-[-0.055em] rtl:leading-[1.5] rtl:tracking-normal"
          >
            {t("hero.title")}
            <br />
            <span className="text-accent ltr:font-serif ltr:italic ltr:tracking-[-0.045em]">
              {t("hero.titleAccent")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[510px] text-sm leading-7 text-subtle sm:text-[15px] sm:leading-8">
            {t("hero.description")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#playground"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2.5 text-xs shadow-sm",
              )}
            >
              {t("hero.primary")}
              <ArrowDown className="size-3.5" aria-hidden="true" />
            </a>
            <a
              href={repository}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2.5 text-xs",
              )}
            >
              <Github className="size-4" aria-hidden="true" />
              {t("hero.secondary")}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] text-subtle">
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-accent" aria-hidden="true" />
              {t("hero.benefitOne")}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-accent" aria-hidden="true" />
              {t("hero.benefitTwo")}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-accent" aria-hidden="true" />
              {t("hero.benefitThree")}
            </span>
          </div>
        </section>

        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <section
            id="playground"
            aria-label={t("demo.workspaceLabel")}
            className="scroll-mt-8"
          >
            <DemoWorkspace formats={formats} />
          </section>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-8 font-mono text-[10px] text-subtle sm:gap-x-9">
            <span className="text-[9px] uppercase tracking-[0.14em]">
              {t("site.builtWith")}
            </span>
            <span lang="en">Next.js</span>
            <span lang="en">React</span>
            <span lang="en">TypeScript</span>
            <span lang="en">i18next</span>
            <span lang="en">Tailwind CSS</span>
          </div>

          <section
            aria-labelledby="features-heading"
            className="border-t border-line pb-16 pt-12 sm:pb-20 sm:pt-16"
          >
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent rtl:tracking-normal">
                  <Layers3 className="size-3.5" aria-hidden="true" />
                  {t("features.eyebrow")}
                </p>
                <h2
                  id="features-heading"
                  className="text-balance text-2xl font-medium tracking-[-0.035em] sm:text-[30px] rtl:tracking-normal"
                >
                  {t("features.title")}
                </h2>
              </div>
              <p className="max-w-xs text-xs leading-6 text-subtle">
                {t("features.description")}
              </p>
            </div>
            <ShowcaseCards formats={formats} />
          </section>

          <section
            id="integration"
            aria-labelledby="integration-heading"
            className="grid gap-8 border-t border-line py-14 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12"
          >
            <div className="pt-2">
              <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent rtl:tracking-normal">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {t("code.eyebrow")}
              </p>
              <h2
                id="integration-heading"
                className="text-balance text-[30px] font-medium leading-tight tracking-[-0.04em] sm:text-4xl rtl:leading-relaxed rtl:tracking-normal"
              >
                {t("code.title")}
                <span className="mt-1 block text-accent ltr:font-serif ltr:italic">
                  {t("code.titleAccent")}
                </span>
              </h2>
              <p className="mt-5 max-w-sm text-xs leading-7 text-subtle">
                {t("code.description")}
              </p>
              <ul className="mt-7 space-y-4 text-xs text-subtle">
                <li className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {t("code.benefitOne")}
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {t("code.benefitTwo")}
                </li>
                <li className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {t("code.benefitThree")}
                </li>
              </ul>
              <a
                href={repository}
                className="focus-ring mt-8 inline-flex min-h-11 items-center gap-2 rounded-md text-xs font-semibold text-accent"
              >
                {t("code.repository")}
                <ArrowUpRight
                  className="size-3.5 rtl:-rotate-90"
                  aria-hidden="true"
                />
              </a>
            </div>
            <IntegrationExamples />
          </section>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-5 px-5 py-7 sm:px-8">
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-accent" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight" lang="en">
              locale.
            </span>
            <span aria-hidden="true" className="mx-2 h-3 w-px bg-line" />
            <span className="text-[10px] text-subtle">{t("site.footer")}</span>
          </div>
          <a
            href={repository}
            className="focus-ring flex min-h-11 items-center gap-2 rounded-md text-[10px] text-subtle hover:text-ink"
          >
            <Github className="size-3.5" aria-hidden="true" />
            {t("site.openSource")}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
