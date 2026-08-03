"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";

export function TrendingCarousel({ books }: { books: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const children = el.children;
      if (children.length === 0) return;

      if (Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 2) {
        // We reached the end, loop back to start
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      // Scroll to next child
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (child.offsetLeft > el.scrollLeft + 10) {
          el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
          break;
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar {
          display: none;
        }
      `}} />
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-10 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        {books.map((book) => (
        <article
          key={book.id}
          className="w-[calc((100%-32px)/3)] md:w-[calc((100%-200px)/6)] shrink-0 snap-start group"
        >
          <a href={`/truyen/${book.slug}`} className="flex flex-col space-y-1.5 w-full">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted shadow-sm mb-1.5">
              {book.cover_image_url && (
                <Image
                  src={book.cover_image_url}
                  alt={book.name}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs md:text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors h-8 md:h-10">
                {book.name}
              </h3>
              <div className="flex flex-wrap gap-1 h-[18px] overflow-hidden">
                {book.book_genres?.slice(0, 2).map((bg: any, i: number) => (
                  <span
                    key={i}
                    className="text-[8px] px-1 py-0.5 rounded-sm bg-muted text-muted-foreground font-medium border border-border/50"
                  >
                    {bg.genres?.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider gap-1.5">
                <span className="truncate flex-1 font-medium">
                  {book.author_name}
                </span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Eye className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  {book.view_count > 1000
                    ? `${(book.view_count / 1000).toFixed(1)}k`
                    : book.view_count}
                </span>
              </div>
            </div>
          </a>
        </article>
      ))}
      </div>
    </>
  );
}
