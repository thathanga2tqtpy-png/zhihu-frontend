"use client";

import { useState, useEffect } from "react";
import { 
  Type, 
  AlignLeft, 
  Sun, 
  Moon, 
  Coffee, 
  Settings2,
  X,
  Type as TypeIcon,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FONT_SIZES = [
  { label: "A-", value: "text-base" },
  { label: "A", value: "text-lg" },
  { label: "A+", value: "text-xl" },
  { label: "A++", value: "text-2xl" },
];

const LINE_HEIGHTS = [
  { label: "1.5", value: "leading-[1.5]" },
  { label: "1.8", value: "leading-[1.8]" },
  { label: "2.0", value: "leading-[2.0]" },
];

const THEMES = [
  { id: "light", icon: Sun, class: "theme-light" },
  { id: "sepia", icon: Coffee, class: "theme-sepia" },
  { id: "dark", icon: Moon, class: "dark" },
];

export function ReadingSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [settings, setSettings] = useState({
    fontSize: "text-lg",
    fontFamily: "font-serif",
    lineHeight: "leading-[1.8]",
    theme: "theme-light"
  });

  useEffect(() => {
    // Apply settings on load
    const saved = localStorage.getItem("reading-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      applyToDOM(parsed);
    }
  }, []);

  const applyToDOM = (s: any) => {
    const body = document.body;
    const content = document.getElementById("reading-content");

    // 1. Apply Theme to the entire Body
    body.classList.remove("theme-light", "theme-sepia", "dark");
    if (s.theme) {
      body.classList.add(s.theme);
    } else {
      body.classList.add("theme-light");
    }

    // 2. Apply Typography ONLY to the reading content
    if (content) {
      const fontSizes = FONT_SIZES.map(f => f.value);
      const lineHeights = LINE_HEIGHTS.map(l => l.value);
      content.classList.remove(...fontSizes, ...lineHeights, "font-serif", "font-sans");
      content.classList.add(s.fontSize, s.fontFamily, s.lineHeight);
    }
  };

  const updateSetting = (key: string, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applyToDOM(newSettings);
    localStorage.setItem("reading-settings", JSON.stringify(newSettings));
  };

  const SettingsPanel = () => (
    <div className="space-y-6 p-4">
      {/* Theme Section */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Màu nền</span>
        <div className="flex gap-2">
          {THEMES.map((t) => (
            <Button
              key={t.id}
              variant={settings.theme === t.class ? "default" : "outline"}
              size="icon"
              className="rounded-full w-10 h-10"
              onClick={() => updateSetting("theme", t.class)}
            >
              <t.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Font Size Section */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cỡ chữ</span>
        <div className="grid grid-cols-4 gap-1">
          {FONT_SIZES.map((f) => (
            <Button
              key={f.value}
              variant={settings.fontSize === f.value ? "default" : "secondary"}
              size="sm"
              className="text-xs h-8"
              onClick={() => updateSetting("fontSize", f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Font Family Section */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phông chữ</span>
        <div className="flex gap-2">
          <Button
            variant={settings.fontFamily === "font-serif" ? "default" : "outline"}
            className="flex-1 text-xs font-serif h-9"
            onClick={() => updateSetting("fontFamily", "font-serif")}
          >
            Serif
          </Button>
          <Button
            variant={settings.fontFamily === "font-sans" ? "default" : "outline"}
            className="flex-1 text-xs font-sans h-9"
            onClick={() => updateSetting("fontFamily", "font-sans")}
          >
            Sans
          </Button>
        </div>
      </div>

      {/* Line Height Section */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Giãn dòng</span>
        <div className="flex gap-2">
          {LINE_HEIGHTS.map((l) => (
            <Button
              key={l.value}
              variant={settings.lineHeight === l.value ? "default" : "outline"}
              size="sm"
              className="flex-1 text-[10px] h-8"
              onClick={() => updateSetting("lineHeight", l.value)}
            >
              {l.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Version: Sticky Sidebar / Toggle Icon */}
      <div className="hidden lg:block fixed right-8 bottom-8 z-40 transition-all duration-300">
        {isDesktopOpen ? (
          <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl w-56 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-primary/5 px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">Tùy chỉnh</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary"
                onClick={() => setIsDesktopOpen(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <SettingsPanel />
          </div>
        ) : (
          <Button 
            size="icon" 
            className="w-12 h-12 rounded-full shadow-2xl bg-background border border-border/50 text-primary hover:scale-110 transition-all group"
            onClick={() => setIsDesktopOpen(true)}
          >
            <Settings2 className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </Button>
        )}
      </div>

      {/* Mobile Version: Bottom Sheet Trigger */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button 
          size="icon" 
          className="w-12 h-12 rounded-full shadow-2xl ring-4 ring-background"
          onClick={() => setIsOpen(true)}
        >
          <Settings2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Bottom Sheet Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3 mb-2" />
            <div className="flex justify-between items-center px-6 pt-2">
              <h3 className="text-lg font-bold">Cài đặt đọc</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SettingsPanel />
            <div className="h-8" /> {/* Safe area for mobile home bar */}
          </div>
        </div>
      )}
    </>
  );
}
