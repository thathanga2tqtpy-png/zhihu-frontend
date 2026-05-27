"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export function ViewCounter({ bookId }: { bookId: string }) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;

    const timer = setTimeout(async () => {
      if (hasIncremented.current) return;
      
      // Tăng view_count sử dụng RPC (Atomic Increment)
      const { error } = await supabase
        .rpc('increment_view_count', { book_id: bookId });

      if (!error) {
        hasIncremented.current = true;
      } else {
        // Fallback nếu chưa tạo RPC function hoặc gặp lỗi quyền
        const { data: currentBook } = await supabase
          .from("books")
          .select("view_count")
          .eq("id", bookId)
          .single();

        if (currentBook) {
          const { error: updateError } = await supabase
            .from("books")
            .update({ view_count: (currentBook.view_count || 0) + 1 })
            .eq("id", bookId);
          
          if (!updateError) {
            hasIncremented.current = true;
          }
        }
      }
    }, 30000); // Khôi phục 30 giây như yêu cầu ban đầu

    return () => clearTimeout(timer);
  }, [bookId]);

  return null;
}
