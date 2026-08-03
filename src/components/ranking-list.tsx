"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

type RankingPeriod = "day" | "week" | "month" | "all";

export function RankingList({
  dayRankings,
  weekRankings,
  monthRankings,
  allRankings
}: {
  dayRankings: any[];
  weekRankings: any[];
  monthRankings: any[];
  allRankings: any[];
}) {
  const [activeTab, setActiveTab] = useState<RankingPeriod>("all");

  const getCurrentList = () => {
    switch (activeTab) {
      case "day": return dayRankings;
      case "week": return weekRankings;
      case "month": return monthRankings;
      case "all": return allRankings;
      default: return allRankings;
    }
  };

  const list = getCurrentList();

  return (
    <div className="border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm md:text-base uppercase tracking-widest text-muted-foreground">
          Bảng xếp hạng
        </h3>
      </div>

      <div className="flex items-center gap-4 mb-6 border-b border-border/40 pb-2">
        {[
          { id: "day", label: "Ngày" },
          { id: "week", label: "Tuần" },
          { id: "month", label: "Tháng" },
          { id: "all", label: "Tất cả" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as RankingPeriod)}
            className={`text-xs md:text-sm font-bold uppercase tracking-wide transition-colors pb-2 -mb-[9px] border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {list && list.length > 0 ? (
          list.map((book, index) => (
            <div key={book.id} className="flex items-center gap-3 group">
              <span
                className={`text-xl md:text-2xl font-black w-6 text-center shrink-0 ${
                  index < 3 ? "text-primary" : "text-muted-foreground/30"
                }`}
              >
                {index + 1}
              </span>
              
              <Link href={`/truyen/${book.slug}`} className="block shrink-0">
                <div className="relative w-10 h-14 bg-muted rounded overflow-hidden shadow-sm">
                  {book.cover_image_url && (
                    <Image
                      src={book.cover_image_url}
                      alt={book.name}
                      fill
                      sizes="40px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/truyen/${book.slug}`} className="block">
                  <h4 className="font-bold text-xs md:text-sm truncate group-hover:text-primary transition-colors">
                    {book.name}
                  </h4>
                </Link>
                <p className="text-[10px] md:text-[11px] text-muted-foreground truncate uppercase mt-1.5 tracking-tight flex items-center gap-1.5">
                  <span className="truncate">{book.book_genres?.[0]?.genres?.name || "Khác"}</span>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Eye className="w-3 h-3"/> 
                    {book.view_count > 1000 ? `${(book.view_count/1000).toFixed(1)}k` : book.view_count}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8 italic">
            Chưa có đủ dữ liệu xếp hạng.
          </div>
        )}
      </div>
    </div>
  );
}
