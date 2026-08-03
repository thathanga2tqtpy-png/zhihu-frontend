"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import { BookmarkService } from "@/services/bookmark.service";
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
    const { data: { user } } = await AuthService.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await BookmarkService.getUserBookmarks(user.id);

    if (error) {
      console.error("Error fetching bookmarks:", error.message);
    } else {
      setBookmarkedBooks(data || []);
    }
    setLoading(false);
  };

  const removeBookmark = async (id: string) => {
    const { error } = await BookmarkService.removeBookmark(id);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarkedBooks.map((item) => {
            const book = item.books;
            const genres = book.book_genres?.map((bg: any) => bg.genres?.name).filter(Boolean) || [];

            return (
              <div key={item.id} className="group relative">
                <Card className="overflow-hidden border-border/30 hover:border-primary/40 transition-all duration-500 rounded-xl shadow-sm hover:shadow-lg bg-card/50">
                  <CardContent className="p-0 flex h-40 sm:h-48">
                    {/* Image Area */}
                    <Link href={`/truyen/${book.slug}`} className="w-28 sm:w-32 h-full flex-shrink-0 relative overflow-hidden bg-muted/30">
                      {book.cover_image_url ? (
                        <Image 
                          src={book.cover_image_url} 
                          alt={book.name} 
                          fill 
                          sizes="(max-width: 640px) 112px, 128px" 
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>

                    {/* Content Area */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <Link href={`/truyen/${book.slug}`} className="flex-1 min-w-0">
                            <h3 className="font-bold font-serif text-lg sm:text-xl line-clamp-1 group-hover:text-primary transition-colors">{book.name}</h3>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-2 shrink-0 transition-colors"
                            onClick={() => removeBookmark(item.id)}
                            title="Bỏ lưu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                          {book.author_name}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {genres.length > 0 ? (
                            genres.slice(0, 3).map((genre: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0 bg-primary/5 text-primary/80 hover:bg-primary/10 border-primary/10 font-medium">
                                {genre}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-muted text-muted-foreground font-medium">
                              Chưa phân loại
                            </Badge>
                          )}
                          {genres.length > 3 && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-muted text-muted-foreground font-medium">
                              +{genres.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/30 mt-auto">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                          <Eye className="w-3.5 h-3.5 text-primary/50" />
                          <span>{book.view_count?.toLocaleString()} lượt đọc</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground italic">
                           <Clock className="w-3 h-3" />
                           <span>Lưu ngày {new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
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
