"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookDescription({ text }: { text: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return <p className="italic opacity-60">Chưa có mô tả cho truyện này.</p>;
  }

  const lines = text.split('\n');
  const isLong = lines.length > 4 || text.length > 300;

  return (
    <div className="relative mb-10">
      <div className="bg-muted/60 rounded-xl p-5 md:p-6 border border-border/80 shadow-sm">
        <div 
          className={`prose prose-sm md:prose-base dark:prose-invert max-w-none font-serif leading-relaxed text-muted-foreground transition-all duration-300 ${
            !isExpanded && isLong ? "line-clamp-[6]" : ""
          }`}
        >
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
            {/* If line is empty string (was \n\n), it will render a <br> and the span is empty, effectively causing a double br */}
          </span>
        ))}
        </div>
      </div>
      
      {!isExpanded && isLong && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      )}
      
      {isLong && (
        <div className={`flex justify-center ${isExpanded ? "mt-6" : "-mt-4 relative z-10"}`}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded-full px-6 shadow-sm bg-background hover:bg-muted"
          >
            {isExpanded ? (
              <>Thu gọn <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Xem thêm <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
