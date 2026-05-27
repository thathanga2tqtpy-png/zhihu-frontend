"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Eye, Trash2, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarkedBooks, setBookmarkedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .select(`
        id,
        created_at,
        books (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarks:", error.message);
    } else {
      setBookmarkedBooks(data || []);
    }
    setLoading(false);
  };

  const removeBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Không thể xóa truyện đã lưu");
    } else {
      setBookmarkedBooks(bookmarkedBooks.filter(item => item.id !== id));
      toast.success("Đã xóa khỏi danh sách theo dõi");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      <div className="flex items-center justify-between border-b pb-6 border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bookmark className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Truyện đã lưu</h1>
        </div>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
          {bookmarkedBooks.length} bộ truyện
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : bookmarkedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarkedBooks.map((item) => {
            const book = item.books;
            return (
              <div key={item.id} className="group relative">
                <Card className="overflow-hidden border-border/40 hover:border-primary/20 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-xl">
                  <CardContent className="p-0 flex flex-col sm:flex-row h-full">
                    {/* Image Area */}
                    <div className="w-full sm:w-32 aspect-[2/3] sm:aspect-auto bg-muted overflow-hidden flex-shrink-0 relative">
                      {book.cover_image_url ? (
                        <img src={book.cover_image_url} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-8 h-8 text-muted-foreground/20" /></div>
                      )}
                      <div className="absolute top-2 left-2 md:hidden">
                        <Badge className="bg-black/70 text-white border-none text-[8px]">{book.genre?.split('(')[0]}</Badge>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0 bg-background">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <Link href={`/truyen/${book.slug}`} className="flex-1 min-w-0">
                            <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">{book.name}</h3>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50 -mt-1 -mr-2"
                            onClick={() => removeBookmark(item.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">{book.author_name}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-4">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {book.view_count?.toLocaleString()}</span>
                          <span className="opacity-30">•</span>
                          <span className="text-primary/70 font-bold">{book.genre?.split('(')[0].trim()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground pt-3 border-t border-border/40">
                         <Clock className="w-3 h-3" />
                         <span>Đã lưu vào {new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/40">
          <Bookmark className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-muted-foreground">Danh sách còn trống</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-8">Bạn chưa lưu bất kỳ bộ truyện nào để theo dõi.</p>
          <Button onClick={() => router.push("/search")} className="rounded-full px-8">
            Khám phá truyện mới ngay
          </Button>
        </div>
      )}
    </div>
  );
}
