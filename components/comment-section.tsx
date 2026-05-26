"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CommentSection({ bookId }: { bookId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetchComments();
  }, [bookId]);

  async function fetchComments() {
    const { data } = await supabase
      .from("book_comments")
      .select("*, users(display_name)")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });
    if (data) setComments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập để bình luận");

    await supabase.from("book_comments").insert({
      book_id: bookId,
      user_id: user.id,
      content: newComment,
    });
    setNewComment("");
    fetchComments();
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6">Bình luận</h3>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="mb-4"
          />
          <Button type="submit">Gửi bình luận</Button>
        </form>
      ) : (
        <p className="mb-8 text-muted-foreground">Vui lòng đăng nhập để tham gia thảo luận.</p>
      )}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <p className="font-bold text-sm">{comment.users?.display_name || "Người dùng ẩn danh"}</p>
            <p className="text-muted-foreground text-sm">{new Date(comment.created_at).toLocaleDateString()}</p>
            <p className="mt-2 leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
