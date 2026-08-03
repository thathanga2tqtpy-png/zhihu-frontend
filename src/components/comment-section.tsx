"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, MessageSquare, Send, Clock, Reply, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CommentSection({ bookId }: { bookId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

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
      .order("created_at", { ascending: true }); // Get all, sort by oldest first to maintain thread order
    
    if (error) {
      console.error("Error fetching comments:", error.message);
    } else {
      setComments(data || []);
    }
    setFetching(false);
  }

  // Build tree structure
  const parentComments = comments.filter(c => !c.parent_comment_id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); // Newest parents first
  
  const getReplies = (parentId: string) => {
    return comments.filter(c => c.parent_comment_id === parentId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); // Oldest replies first
  };

  async function handleSubmit(e: React.FormEvent, parentId: string | null = null) {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vui lòng đăng nhập để gửi bình luận");
      return;
    }

    const content = parentId ? replyContent : newComment;

    if (!content.trim()) {
      toast.error("Nội dung bình luận không được để trống");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("book_comments").insert({
      book_id: bookId,
      user_id: user.id,
      parent_comment_id: parentId,
      content: content.trim(),
    });

    if (error) {
      toast.error("Lỗi khi gửi bình luận: " + (error.message || "Lỗi không xác định"));
    } else {
      toast.success("Đã gửi bình luận của bạn!");
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
      await fetchComments();
    }
    setLoading(false);
  }

  const renderCommentForm = (parentId: string | null = null) => {
    if (!user) return null;
    
    const isReply = parentId !== null;
    const value = isReply ? replyContent : newComment;
    const setValue = isReply ? setReplyContent : setNewComment;

    return (
      <form onSubmit={(e) => handleSubmit(e, parentId)} className={cn("relative overflow-hidden", isReply ? "mt-4" : "")}>
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 pb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex-shrink-0 flex items-center justify-center border border-primary/20 shadow-inner">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-2">
              <span>{user.user_metadata?.display_name || user.email?.split('@')[0]}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isReply ? "Viết câu trả lời..." : "Chia sẻ góc nhìn của bạn về tác phẩm..."}
              className="min-h-[80px] w-full bg-transparent border border-border/50 rounded-xl focus-visible:ring-1 focus-visible:ring-primary text-sm resize-none p-3 text-foreground placeholder:text-muted-foreground/50"
              disabled={loading}
              autoFocus={isReply}
            />
          </div>
        </div>
        
        <div className="flex justify-end items-center px-4 sm:px-5 pb-3 sm:pb-4 pt-2 gap-2">
          {isReply && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent("");
              }}
              className="rounded-full px-4 text-xs"
            >
              Hủy
            </Button>
          )}
          <Button 
            type="submit" 
            size="sm"
            disabled={loading || !value.trim()} 
            className={cn(
              "gap-2 rounded-full px-6 shadow-sm transition-all duration-300",
              value.trim() ? "hover:shadow-md hover:scale-105 active:scale-95" : "opacity-50"
            )}
          >
            <Send className="w-3 h-3" />
            {loading ? "Đang gửi..." : "Gửi"}
          </Button>
        </div>
      </form>
    );
  };

  const renderComment = (comment: any, isReply = false) => {
    const replies = !isReply ? getReplies(comment.id) : [];

    return (
      <div key={comment.id} className={cn("group flex gap-3 sm:gap-4", isReply ? "mt-4" : "")}>
        <div className={cn(
          "rounded-full bg-muted flex-shrink-0 flex items-center justify-center border border-border/50",
          isReply ? "w-8 h-8" : "w-10 h-10"
        )}>
          <User className={cn("text-muted-foreground", isReply ? "w-4 h-4" : "w-5 h-5")} />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-foreground">
              {comment.users?.display_name || "Độc giả ẩn danh"}
            </h4>
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] uppercase tracking-wider font-medium">
              <span>•</span>
              {new Date(comment.created_at).toLocaleDateString('vi-VN')}
            </div>
          </div>
          <div className={cn("bg-muted/20 p-3 sm:p-4 rounded-2xl rounded-tl-none border border-border/30 transition-colors inline-block", isReply ? "bg-muted/30" : "")}>
            <p className="text-[14px] leading-[1.6] text-foreground/90 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center gap-4 pt-1">
            <button 
              onClick={() => {
                if (!user) {
                  toast.error("Vui lòng đăng nhập để trả lời");
                  return;
                }
                // If replying to a reply, attach to the parent instead to keep it 1-level deep
                setReplyingTo(isReply ? comment.parent_comment_id : comment.id);
                setReplyContent("");
              }}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Reply className="w-3 h-3" /> Trả lời
            </button>
          </div>

          {replyingTo === (isReply ? comment.parent_comment_id : comment.id) && !isReply && (
            <div className="mt-4 bg-muted/10 rounded-2xl border border-border/50">
               {renderCommentForm(comment.id)}
            </div>
          )}

          {/* Render Replies */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-4 relative">
              <div className="absolute left-[-22px] top-0 bottom-0 w-px bg-border/50 hidden sm:block"></div>
              {replies.map(reply => (
                <div key={reply.id} className="relative">
                  <div className="absolute left-[-22px] top-[14px] w-4 h-px bg-border/50 hidden sm:block"></div>
                  {renderComment(reply, true)}
                </div>
              ))}
            </div>
          )}
          
          {/* Edge case: User clicked reply on a nested comment, show form at the end of the replies list */}
          {replyingTo === comment.id && isReply && (
             <div className="mt-4 bg-muted/10 rounded-2xl border border-border/50">
               {renderCommentForm(comment.parent_comment_id)}
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-16 space-y-10">
      <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold tracking-tight">Thảo luận</h3>
      </div>

      {/* Main Comment Form */}
      <div className="group relative bg-card rounded-3xl border border-border/60 shadow-sm focus-within:shadow-md focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-500">
        {user ? (
          renderCommentForm()
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
        ) : parentComments.length > 0 ? (
          parentComments.map((comment) => renderComment(comment))
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
