"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ReadingSettings() {
  const [settings, setSettings] = useState({ fontSize: "text-lg", font: "font-serif" });

  const applySettings = (newSettings: any) => {
    document.body.className = `antialiased ${newSettings.fontSize} ${newSettings.font}`;
    setSettings(newSettings);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer">
        Tùy chỉnh
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-4 space-y-4">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Cấu hình đọc</DropdownMenuLabel>
          <Select onValueChange={(v) => applySettings({ ...settings, fontSize: v })}>
            <SelectTrigger><SelectValue placeholder="Cỡ chữ" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="text-base">Nhỏ</SelectItem>
              <SelectItem value="text-lg">Trung bình</SelectItem>
              <SelectItem value="text-xl">Lớn</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => applySettings({ ...settings, font: v })}>
            <SelectTrigger><SelectValue placeholder="Font chữ" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="font-serif">Serif (Báo chí)</SelectItem>
              <SelectItem value="font-sans">Sans (Hiện đại)</SelectItem>
            </SelectContent>
          </Select>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
