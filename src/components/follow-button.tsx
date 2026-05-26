"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function FollowButton({ bookId }: { bookId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkStatus();
  }, [bookId]);

  const checkStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .single();

    if (data) setIsFollowing(true);
  };

  const toggleFollow = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vui lòng đăng nhập để theo dõi truyện");
      router.push("/login");
      return;
    }

    setLoading(true);
    if (isFollowing) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("book_id", bookId);
      setIsFollowing(false);
      toast.success("Đã bỏ theo dõi");
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, book_id: bookId });
      setIsFollowing(true);
      toast.success("Đã theo dõi truyện");
    }
    setLoading(false);
  };

  return (
    <Button 
      variant={isFollowing ? "secondary" : "outline"} 
      size="sm" 
      className="gap-2 rounded-full"
      onClick={toggleFollow}
      disabled={loading}
    >
      {isFollowing ? (
        <BookmarkCheck className="w-4 h-4 text-primary" />
      ) : (
        <BookmarkPlus className="w-4 h-4" />
      )}
      {isFollowing ? "Đang theo dõi" : "Follow"}
    </Button>
  );
}
