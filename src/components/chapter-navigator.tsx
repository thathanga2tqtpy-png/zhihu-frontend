"use client";

import Link from "next/link";
import { List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { Chapter } from "@/types";
import { cn } from "@/lib/utils";

interface ChapterNavigatorProps {
  book: {
    slug: string;
    chapters?: Chapter[];
  };
  currentChapter: number;
  className?: string;
}

export function ChapterNavigator({ book, currentChapter, className }: ChapterNavigatorProps) {
  const chapters = book.chapters || [];
  const currentIndex = chapters.findIndex((c) => c.chapter_number === currentChapter);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex !== -1 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  
  const hasPrev = !!prevChapter;
  const hasNext = !!nextChapter;

  return (
    <div className={`flex justify-between items-center gap-2 ${className || ""}`}>
      {hasPrev ? (
        <Link 
          href={`/truyen/${book.slug}/${prevChapter.chapter_number}`}
          className={cn(
            buttonVariants({ variant: "secondary", size: "default" }),
            "rounded-full px-5 sm:px-7 shadow-sm hover:shadow-md transition-all font-semibold text-sm sm:text-[15px]"
          )}
        >
          Chương trước
        </Link>
      ) : (
        <span 
          className={cn(
            buttonVariants({ variant: "secondary", size: "default" }),
            "rounded-full px-5 sm:px-7 shadow-sm transition-all font-semibold text-sm sm:text-[15px] opacity-50 pointer-events-none"
          )}
        >
          Chương trước
        </span>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger className="h-10 w-10 sm:h-11 sm:w-11 border border-border/60 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground transition-all focus:outline-none flex items-center justify-center cursor-pointer shadow-sm bg-background">
          <List className="w-4 h-4 sm:w-5 sm:h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="max-h-64 overflow-y-auto w-64 p-1">
          {chapters.length > 0 ? (
            chapters.map((ch) => (
              <DropdownMenuItem key={ch.id} className="p-0 cursor-pointer mb-0.5 outline-none">
                <Link 
                  href={`/truyen/${book.slug}/${ch.chapter_number}`}
                  className={`w-full flex items-center px-2 py-2 rounded-md transition-colors text-sm ${
                    ch.chapter_number === currentChapter 
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                      : "hover:bg-muted text-foreground/80"
                  }`}
                >
                  <span className="truncate">Chương {ch.chapter_number}: {ch.title}</span>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">Không có danh sách chương</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {hasNext ? (
        <Link 
          href={`/truyen/${book.slug}/${nextChapter.chapter_number}`}
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "rounded-full px-5 sm:px-7 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-all font-semibold text-sm sm:text-[15px]"
          )}
        >
          Chương sau
        </Link>
      ) : (
        <span 
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "rounded-full px-5 sm:px-7 shadow-sm transition-all font-semibold text-sm sm:text-[15px] opacity-50 pointer-events-none"
          )}
        >
          Chương sau
        </span>
      )}
    </div>
  );
}
