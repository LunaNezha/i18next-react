"use client";

import { Check, Copy, FileCode2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

function highlight(code: string) {
  return code
    .split(
      /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:import|from|export|default|async|await|const|function|return|if|new)\b|\b\d+\b)/g,
    )
    .map((token, index) => {
      const color = /^["']/.test(token)
        ? "text-[#b4d9a7]"
        : /^(import|from|export|default|async|await|const|function|return|if|new)$/.test(
              token,
            )
          ? "text-[#cab5eb]"
          : /^\d+$/.test(token)
            ? "text-[#e3c28c]"
            : undefined;
      return (
        <span key={index} className={color}>
          {token}
        </span>
      );
    });
}

type Props = { code: string; filename: string; className?: string };

export function CodeBlock({ code, filename, className }: Props) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
    "idle",
  );
  const codeElement = useRef<HTMLElement>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (status !== "copied" && status !== "error") return;
    const timer = window.setTimeout(
      () => setStatus("idle"),
      status === "error" ? 6000 : 2500,
    );
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copyCode() {
    setStatus("copying");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(code);
      if (mounted.current) setStatus("copied");
    } catch {
      if (!mounted.current) return;
      if (codeElement.current) {
        const range = document.createRange();
        range.selectNodeContents(codeElement.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus("error");
    }
  }

  return (
    <div
      dir="ltr"
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#121b16] text-[#dce6dd]",
        className,
      )}
    >
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-white/10 px-4">
        <span className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-[#9aaa9e]">
          <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate" lang="en">
            {filename}
          </span>
        </span>
        <button
          type="button"
          onClick={copyCode}
          disabled={status === "copying"}
          aria-label={t("code.copyLabel", { filename })}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-2 text-[11px] text-[#c6d3c8] outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#b4d9a7] disabled:opacity-50"
        >
          {status === "copied" ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          {status === "copied"
            ? t("code.copied")
            : status === "copying"
              ? t("code.copying")
              : t("code.copy")}
        </button>
      </div>
      <div className="flex gap-4 px-4 py-5 text-xs leading-7 sm:text-[12px]">
        <div
          aria-hidden="true"
          className="select-none text-end font-mono text-[#708275]"
        >
          {code.split("\n").map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
        <pre
          tabIndex={0}
          aria-label={filename}
          className="min-w-0 flex-1 overflow-x-auto rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#b4d9a7]"
        >
          <code ref={codeElement} lang="en" className="font-mono">
            {highlight(code)}
          </code>
        </pre>
      </div>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          status === "error"
            ? "border-t border-white/10 px-4 py-3 text-xs leading-5 text-[#e3c28c]"
            : "sr-only"
        }
      >
        {status === "error"
          ? t("code.copyError")
          : status === "copied"
            ? t("code.copied")
            : ""}
      </p>
    </div>
  );
}
