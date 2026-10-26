"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type TabDefinition = { value: string; label: string; content: ReactNode };

type Props = {
  label: string;
  tabs: readonly [TabDefinition, ...TabDefinition[]];
  leading?: ReactNode;
  className?: string;
};

export function DemoTabs({ label, tabs, leading, className }: Props) {
  const id = useId();
  const [value, setValue] = useState(tabs[0].value);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const direction =
      getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1;
    let nextIndex: number;
    if (event.key === "ArrowRight")
      nextIndex = (index + direction + tabs.length) % tabs.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - direction + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    setValue(tabs[nextIndex].value);
    buttons.current[nextIndex]?.focus();
  }

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-6">
        {leading}
        <div
          role="tablist"
          aria-label={label}
          aria-orientation="horizontal"
          className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-canvas p-1"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              id={`${id}-tab-${tab.value}`}
              type="button"
              role="tab"
              aria-selected={value === tab.value}
              aria-controls={`${id}-panel-${tab.value}`}
              tabIndex={value === tab.value ? 0 : -1}
              onClick={() => setValue(tab.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "focus-ring min-h-11 shrink-0 rounded-md px-4 text-xs font-medium transition-colors motion-reduce:transition-none",
                value === tab.value
                  ? "bg-surface text-ink shadow-sm ring-1 ring-line"
                  : "text-subtle hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.value}
          id={`${id}-panel-${tab.value}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${tab.value}`}
          hidden={value !== tab.value}
          tabIndex={0}
          className="focus-ring rounded-b-2xl"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
