"use client";

import * as React from "react";
import { Moon, Sun, Coffee } from "lucide-react";
import { useTheme } from "next-themes";
export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    const current = theme === 'system' ? resolvedTheme : theme;

    if (current === 'light') {
      setTheme('coffee');
    } else if (current === 'coffee') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-background hover:bg-muted focus:outline-none transition-colors overflow-hidden cursor-pointer"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 coffee:-rotate-90 coffee:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 coffee:rotate-90 coffee:scale-0" />
      <Coffee className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-primary dark:-rotate-90 dark:scale-0 coffee:rotate-0 coffee:scale-100" />
      <span className="sr-only">Đổi giao diện</span>
    </button>
  );
}
