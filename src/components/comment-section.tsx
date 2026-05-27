"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, MessageSquare, Send, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CommentSection({ bookId }: { bookId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Lấy thông tin user hiện tại
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Lắng nghe thay đổi Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchComments();

    return () => subscription.unsubscribe();
  }, [bookId]);

  async function fetchComments() {
    setFetching(true);
    const { data, error } = await supabase
      .from("book_comments")
      .select("*, users(display_name)")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching comments:", error.message);
    } else {
      setComments(data || []);
    }
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vui lòng đăng nhập để gửi bình luận");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Nội dung bình luận không được để trống");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("book_comments").insert({
      book_id: bookId,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (error) {
      toast.error("Lỗi khi gửi bình luận: " + (error.message || "Lỗi không xác định"));
      console.error("Submit error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      toast.success("Đã gửi bình luận của bạn!");
      setNewComment("");
      await fetchComments(); // Tải lại danh sách
    }
    setLoading(false);
  }

  return (
    <div className="mt-16 space-y-10">
      <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold tracking-tight">Thảo luận</h3>
      </div>

      {/* Comment Form */}
      <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 shadow-sm transition-all duration-300">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Đang bình luận với tên: <span className="text-foreground">{user.user_metadata?.display_name || user.email?.split('@')[0]}</span>
              </span>
            </div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ cảm nghĩ của bạn về tác phẩm này..."
              className="min-h-[120px] bg-background border-none focus-visible:ring-1 focus-visible:ring-primary/30 text-base resize-none"
              disabled={loading}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2 rounded-full px-6">
                <Send className="w-4 h-4" />
                {loading ? "Đang gửi..." : "Gửi bình luận"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Bạn cần đăng nhập để tham gia bình luận.</p>
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {fetching ? (
          <div className="space-y-6">
             {[1, 2].map((i) => (
               <div key={i} className="animate-pulse flex gap-4">
                 <div className="w-10 h-10 bg-muted rounded-full" />
                 <div className="flex-1 space-y-2">
                   <div className="h-4 bg-muted w-24 rounded" />
                   <div className="h-3 bg-muted w-full rounded" />
                 </div>
               </div>
             ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center border border-border/50">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">
                    {comment.users?.display_name || "Độc giả ẩn danh"}
                  </h4>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider font-medium">
                    <Clock className="w-3 h-3" />
                    {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="bg-muted/20 p-4 rounded-2xl rounded-tl-none border border-border/30 group-hover:border-primary/20 transition-colors">
                  <p className="text-[15px] leading-[1.6] text-foreground/90 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border/40 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground italic">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm xúc!</p>
          </div>
        )}
      </div>
    </div>
  );
}
