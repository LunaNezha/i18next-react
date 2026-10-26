"use client";

import {
  ArrowRight,
  Braces,
  Check,
  Code2,
  FileCode2,
  Globe2,
  Hand,
  LayoutTemplate,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { localeDetails } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import type { Currency, DemoFormats } from "@/types/demo";
import { CodeBlock } from "./code-block";
import { DemoTabs } from "./demo-tabs";
import { clientSnippet, formatSnippet, serverSnippet } from "./snippets";

function LivePreview({ formats }: { formats: DemoFormats }) {
  const { t } = useTranslation();
  const [name, setName] = useState(() => t("demo.defaultName"));
  const id = useId();
  const displayName = name.trim() || t("demo.friend");

  return (
    <div className="grid min-w-0 gap-7 p-5 sm:p-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
      <div className="flex min-w-0 flex-col justify-center">
        <div className="mb-5 flex items-center gap-2 text-xs font-medium text-subtle">
          <span
            className="size-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          {t("demo.liveLabel")}
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-accent-soft/50 p-6 sm:p-7">
          <div
            aria-hidden="true"
            className="absolute -end-6 -top-8 size-40 rounded-full bg-accent/5"
          />
          <div className="relative mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-surface text-accent shadow-sm">
                <Globe2 className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold">{t("demo.yourApp")}</span>
            </div>
            <span
              className="rounded-md border border-line bg-surface/80 px-2 py-1 font-mono text-[10px] text-subtle"
              dir="ltr"
            >
              /{formats.locale}
            </span>
          </div>
          <Hand
            className="mb-3 size-7 text-accent"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p
            aria-live="polite"
            aria-atomic="true"
            className="relative break-words text-2xl font-semibold leading-snug tracking-tight sm:text-[28px]"
          >
            {t("demo.greeting", { name: displayName })}
          </p>
          <p className="mt-3 max-w-sm text-xs leading-6 text-subtle">
            {t("demo.welcomeDescription")}
          </p>
          <div className="mt-6 flex items-center gap-2 text-[11px] font-medium text-accent">
            <Check className="size-3.5" aria-hidden="true" />
            {t("demo.synced")}
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor={id} className="mb-2 block text-xs font-medium">
            {t("demo.nameLabel")}
          </label>
          <div className="flex items-center gap-3">
            <input
              id={id}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={32}
              autoComplete="off"
              spellCheck={false}
              placeholder={t("demo.namePlaceholder")}
              aria-describedby={`${id}-hint`}
              className="focus-ring h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm placeholder:text-subtle"
            />
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas text-accent">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
          </div>
          <p
            id={`${id}-hint`}
            className="mt-2 text-[11px] leading-5 text-subtle"
          >
            {t("demo.nameHint")}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-4">
        <CodeBlock code={clientSnippet} filename="components/welcome.tsx" />
        <p className="flex items-start gap-2 px-1 text-[11px] leading-5 text-subtle">
          <Braces className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {t("demo.codeHint")}
        </p>
      </div>
    </div>
  );
}

export function DemoWorkspace({ formats }: { formats: DemoFormats }) {
  const { t } = useTranslation();

  return (
    <div className="relative rounded-[22px] border border-line bg-surface/90 shadow-[0_24px_80px_-35px_rgba(24,55,32,0.24)] backdrop-blur-xl">
      <DemoTabs
        label={t("demo.workspaceLabel")}
        leading={
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md border border-line text-subtle">
              <Code2 className="size-3.5" aria-hidden="true" />
            </span>
            <span className="text-xs font-medium">
              {t("demo.workspaceTitle")}
            </span>
            <span className="rounded-full bg-accent-soft px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-accent">
              {t("demo.live")}
            </span>
          </div>
        }
        tabs={[
          {
            value: "preview",
            label: t("demo.preview"),
            content: <LivePreview formats={formats} />,
          },
          {
            value: "source",
            label: t("demo.source"),
            content: (
              <div className="p-5 sm:p-7">
                <CodeBlock code={serverSnippet} filename="app/[lng]/page.tsx" />
              </div>
            ),
          },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-[22px] border-t border-line bg-canvas/60 px-5 py-3 sm:px-6">
        <span className="flex items-center gap-2 text-[10px] text-subtle">
          <Globe2 className="size-3.5" aria-hidden="true" />
          <span lang={formats.locale}>
            {localeDetails[formats.locale].label}
          </span>
          <span aria-hidden="true">/</span>
          <span>
            {localeDetails[formats.locale].direction === "rtl"
              ? t("demo.rightToLeft")
              : t("demo.leftToRight")}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-subtle">
          <span
            className="size-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          {t("demo.serverReady")}
        </span>
      </div>
    </div>
  );
}

export function ShowcaseCards({ formats }: { formats: DemoFormats }) {
  const { t } = useTranslation();
  const [count, setCount] = useState(2);
  const [direction, setDirection] = useState<"auto" | "ltr" | "rtl">("auto");
  const [currency, setCurrency] = useState<Currency>("USD");
  const selectId = useId();
  const previewDirection =
    direction === "auto" ? localeDetails[formats.locale].direction : direction;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <article className="demo-card flex flex-col">
        <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-line bg-canvas text-accent">
          <Braces className="size-[18px]" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold tracking-tight">
          {t("features.text.title")}
        </h3>
        <p className="mt-2 text-xs leading-6 text-subtle">
          {t("features.text.description")}
        </p>
        <div className="my-6 rounded-xl border border-line bg-canvas p-4">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <ShoppingBag className="size-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium">{t("features.text.cart")}</p>
              <output
                aria-live="polite"
                aria-atomic="true"
                className="mt-1 block text-[11px] text-subtle"
              >
                {t("features.text.items", { count })}
              </output>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-subtle" dir="ltr">
              count: {count}
            </span>
            <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setCount((value) => Math.max(0, value - 1))}
                disabled={count === 0}
                aria-label={t("features.text.decrease")}
                className="focus-ring flex size-11 items-center justify-center rounded-md text-subtle hover:bg-accent-soft disabled:opacity-30"
              >
                <Minus className="size-3.5" aria-hidden="true" />
              </button>
              <span
                className="min-w-6 text-center text-sm font-medium"
                aria-hidden="true"
              >
                {count}
              </span>
              <button
                type="button"
                onClick={() => setCount((value) => Math.min(99, value + 1))}
                disabled={count === 99}
                aria-label={t("features.text.increase")}
                className="focus-ring flex size-11 items-center justify-center rounded-md text-subtle hover:bg-accent-soft disabled:opacity-30"
              >
                <Plus className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-auto flex items-center gap-2 text-[10px] font-medium text-accent">
          <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
          {t("features.text.note")}
        </p>
      </article>

      <article className="demo-card flex flex-col">
        <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-line bg-canvas text-accent">
          <LayoutTemplate className="size-[18px]" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold tracking-tight">
          {t("features.direction.title")}
        </h3>
        <p className="mt-2 text-xs leading-6 text-subtle">
          {t("features.direction.description")}
        </p>
        <div className="my-6 rounded-xl border border-line bg-canvas p-4">
          <div
            dir={previewDirection}
            data-direction-preview={previewDirection}
            className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <FileCode2 className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 text-start">
              <p className="text-xs font-medium">
                {t("features.direction.project")}
              </p>
              <p className="mt-1 text-[10px] text-subtle">
                {t("features.direction.projectHint")}
              </p>
            </div>
            <ArrowRight
              className={cn(
                "size-4 shrink-0 text-subtle",
                previewDirection === "rtl" && "rotate-180",
              )}
              aria-hidden="true"
            />
          </div>
          <div
            role="group"
            aria-label={t("features.direction.controlLabel")}
            className="mt-4 grid grid-cols-3 gap-1 rounded-lg border border-line bg-surface p-1"
          >
            {(["auto", "ltr", "rtl"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={direction === value}
                onClick={() => setDirection(value)}
                className={cn(
                  "focus-ring min-h-11 rounded-md px-2 text-[10px] font-medium",
                  direction === value
                    ? "bg-accent-soft text-accent"
                    : "text-subtle hover:text-ink",
                )}
              >
                {value === "auto" ? (
                  t("features.direction.auto")
                ) : (
                  <span dir="ltr">{value.toUpperCase()}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-auto flex items-center gap-2 text-[10px] font-medium text-accent">
          <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
          {t("features.direction.note")}
        </p>
      </article>

      <article className="demo-card flex flex-col">
        <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-line bg-canvas text-accent">
          <Globe2 className="size-[18px]" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold tracking-tight">
          {t("features.format.title")}
        </h3>
        <p className="mt-2 text-xs leading-6 text-subtle">
          {t("features.format.description")}
        </p>
        <div className="my-6 rounded-xl border border-line bg-canvas p-4">
          <dl className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <dt className="text-[10px] text-subtle">
                {t("features.format.date")}
              </dt>
              <dd className="text-xs font-medium">
                <bdi>{formats.date}</bdi>
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <dt className="text-[10px] text-subtle">
                {t("features.format.number")}
              </dt>
              <dd className="text-xs font-medium">
                <bdi>{formats.number}</bdi>
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
              <dt className="text-[10px] text-subtle">
                {t("features.format.currency")}
              </dt>
              <dd
                aria-live="polite"
                aria-atomic="true"
                className="text-lg font-semibold tracking-tight text-accent"
              >
                <bdi>{formats.currencies[currency]}</bdi>
              </dd>
            </div>
          </dl>
          <label htmlFor={selectId} className="sr-only">
            {t("features.format.selectCurrency")}
          </label>
          <div className="relative mt-4">
            <select
              id={selectId}
              value={currency}
              onChange={(event) => {
                const next = event.target.value;
                if (next === "USD" || next === "EUR" || next === "JPY")
                  setCurrency(next);
              }}
              className="focus-ring h-11 w-full appearance-none rounded-lg border border-line bg-surface pe-9 ps-3 text-xs"
            >
              <option value="USD">USD — {t("features.format.usd")}</option>
              <option value="EUR">EUR — {t("features.format.eur")}</option>
              <option value="JPY">JPY — {t("features.format.jpy")}</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute end-3 top-1/2 size-3.5 -translate-y-1/2 text-subtle"
              aria-hidden="true"
            />
          </div>
        </div>
        <p className="mt-auto text-[10px] leading-5 text-subtle">
          {t("features.format.note")}
        </p>
      </article>
    </div>
  );
}

export function IntegrationExamples() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <DemoTabs
        label={t("code.examplesLabel")}
        leading={
          <span className="flex items-center gap-2 text-xs text-subtle">
            <Code2 className="size-4" aria-hidden="true" />
            {t("code.ready")}
          </span>
        }
        tabs={[
          {
            value: "client",
            label: t("code.client"),
            content: (
              <div className="p-3 sm:p-5">
                <CodeBlock
                  code={clientSnippet}
                  filename="components/welcome.tsx"
                />
              </div>
            ),
          },
          {
            value: "server",
            label: t("code.server"),
            content: (
              <div className="p-3 sm:p-5">
                <CodeBlock code={serverSnippet} filename="app/[lng]/page.tsx" />
              </div>
            ),
          },
          {
            value: "format",
            label: t("code.formatting"),
            content: (
              <div className="p-3 sm:p-5">
                <CodeBlock code={formatSnippet} filename="lib/format.ts" />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
