"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "system";
const storageKey = "locale-demo-theme";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.dataset.theme = theme;
}

export function ThemeSwitcher() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<Theme>("system");
  const currentTheme = useRef<Theme>("system");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (isTheme(saved)) {
        currentTheme.current = saved;
        setTheme(saved);
      }
    } catch {
      currentTheme.current = "system";
    }
    applyTheme(currentTheme.current);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystem = () => applyTheme(currentTheme.current);
    const updateStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      const nextTheme = isTheme(event.newValue) ? event.newValue : "system";
      currentTheme.current = nextTheme;
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };
    media.addEventListener("change", updateSystem);
    window.addEventListener("storage", updateStorage);
    return () => {
      media.removeEventListener("change", updateSystem);
      window.removeEventListener("storage", updateStorage);
    };
  }, []);

  function changeTheme(value: string) {
    if (!isTheme(value)) return;
    currentTheme.current = value;
    setTheme(value);
    applyTheme(value);
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      return;
    }
  }

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <DropdownMenu dir={i18n.dir()}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("theme.label")}
          title={t("theme.label")}
        >
          <Icon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        aria-label={t("theme.label")}
        className="motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none"
      >
        <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
          <DropdownMenuRadioItem
            value="light"
            className="min-h-11 cursor-pointer focus:bg-accent-soft focus:text-ink"
          >
            <Sun className="me-2 size-4" aria-hidden="true" />
            {t("theme.light")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            className="min-h-11 cursor-pointer focus:bg-accent-soft focus:text-ink"
          >
            <Moon className="me-2 size-4" aria-hidden="true" />
            {t("theme.dark")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            className="min-h-11 cursor-pointer focus:bg-accent-soft focus:text-ink"
          >
            <Monitor className="me-2 size-4" aria-hidden="true" />
            {t("theme.system")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
