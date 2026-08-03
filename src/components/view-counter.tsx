"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export function ViewCounter({ bookId, chapterId }: { bookId: string, chapterId?: string }) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;

    const timer = setTimeout(async () => {
      if (hasIncremented.current) return;
      
      // Tăng view_count sử dụng RPC
      let error;
      if (chapterId) {
        const { error: rpcError } = await supabase.rpc('increment_chapter_view_count', { p_chapter_id: chapterId, p_book_id: bookId });
        error = rpcError;
      } else {
        const { error: rpcError } = await supabase.rpc('increment_view_count', { p_book_id: bookId });
        error = rpcError;
      }

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
            // Cố gắng insert vào book_views, nếu lỗi thì bỏ qua
            const today = new Date().toISOString().split('T')[0];
            await supabase.from('book_views').upsert(
              { book_id: bookId, date: today, count: 1 }, 
              { onConflict: 'book_id,date' } // Lưu ý: Upsert trong Supabase Javascript hơi phức tạp để cộng dồn, nên RPC là tốt nhất. 
              // Đây chỉ là fallback cơ bản.
            );
          }
        }

        // Tương tự fallback cho chapter_id nếu cần thiết
        if (chapterId) {
          const { data: currentChapter } = await supabase.from("chapters").select("view_count").eq("id", chapterId).single();
          if (currentChapter) {
            await supabase.from("chapters").update({ view_count: (currentChapter.view_count || 0) + 1 }).eq("id", chapterId);
          }
        }
      }
    }, 30000); // 30 giây

    return () => clearTimeout(timer);
  }, [bookId, chapterId]);

  return null;
}
