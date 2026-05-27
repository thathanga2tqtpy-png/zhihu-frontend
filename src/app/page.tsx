import { supabase } from "@/lib/supabase";
import { Book } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Clock, TrendingUp } from "lucide-react";

export default async function Home() {
  // 1. Lấy Top lượt xem
  const { data: topViewed } = await supabase
    .from("books")
    .select("*")
    .eq("publication_status", "published")
    .order("view_count", { ascending: false })
    .limit(10);

  // 2. Lấy Truyện mới nhất
  const { data: latestBooks } = await supabase
    .from("books")
    .select("*")
    .eq("publication_status", "published")
    .order("created_at", { ascending: false })
    .limit(12);

  const typedTopViewed = topViewed as Book[] | null;
  const typedLatest = latestBooks as Book[] | null;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 space-y-16 overflow-x-hidden">
      {/* Section 1: Top Trending / Featured Small Cards */}
      <section>
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Thịnh hành
            </h2>
          </div>
          <a
            href="/search"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Xem tất cả
          </a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-4 md:gap-10">
          {typedTopViewed?.slice(0, 6).map((book) => (
            <article key={book.id} className="w-full group">
              <a
                href={`/truyen/${book.slug}`}
                className="flex flex-col space-y-3"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted shadow-sm">
                  {book.cover_image_url && (
                    <img
                      src={book.cover_image_url}
                      alt={book.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* Genre Badge on Top Overlay */}
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20">
                    <Badge className="bg-black/70 text-white border-none text-[8px] md:text-[10px] px-1.5 md:px-2 h-4 md:h-5 backdrop-blur-md shadow-lg">
                      {book.genre?.split("(")[0].trim()}
                    </Badge>
                  </div>
                </div>

                {/* Information below image */}
                <div className="space-y-1.5">
                  <h3 className="text-xs md:text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors h-8 md:h-10">
                    {book.name}
                  </h3>
                  <div className="flex items-center justify-between text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider">
                    <span className="truncate max-w-[50px] md:max-w-[70px] font-medium">
                      {book.author_name}
                    </span>
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Eye className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      {book.view_count > 1000
                        ? `${(book.view_count / 1000).toFixed(1)}k`
                        : book.view_count}
                    </span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      <Separator />

      {/* Section 2: Main Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* Left: Latest Updates List (Compact) */}
        <div className="lg:col-span-3 space-y-10">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Mới cập nhật
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-16 gap-y-3 md:gap-y-3">
            {typedLatest?.map((book) => (
              <div
                key={book.id}
                className="flex gap-4 md:gap-4 group pb-2 border-b border-border/40 last:border-0"
              >
                <div className="w-20 h-28 bg-muted flex-shrink-0 overflow-hidden rounded-sm">
                  {book.cover_image_url && (
                    <img
                      src={book.cover_image_url}
                      alt={book.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-start py-1 min-w-0">
                  <a href={`/truyen/${book.slug}`}>
                    <h4 className="font-bold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                      {book.name}
                    </h4>
                  </a>
                  <div className="flex items-center gap-2 md:gap-3 mt-2 text-[9px] md:text-[11px] text-muted-foreground uppercase tracking-wide overflow-hidden">
                    <span className="font-semibold truncate max-w-[80px] md:max-w-[100px]">
                      {book.author_name}
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="text-primary/80 font-bold truncate">
                      {book.genre?.split("(")[0].trim()}
                    </span>
                    <span className="opacity-40 hidden md:inline">•</span>
                    <span className="hidden md:flex items-center gap-1 whitespace-nowrap">
                      <Eye className="w-3.5 h-3.5" />
                      {book.view_count.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed italic font-serif">
                    {book.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rankings / Top Viewed List */}
        <aside className="space-y-10">
          <div className="border rounded-xl p-6">
            <h3 className="font-bold text-sm md:text-base mb-6 flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
              Bảng xếp hạng
            </h3>
            <div className="space-y-6">
              {typedTopViewed?.slice(0, 8).map((book, index) => (
                <div key={book.id} className="flex items-center gap-4 group">
                  <span
                    className={`text-xl md:text-2xl font-black w-8 text-center ${index < 3 ? "text-primary" : "text-muted-foreground/30"}`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <a href={`/truyen/${book.slug}`} className="block">
                      <h4 className="font-bold text-xs md:text-sm truncate group-hover:underline">
                        {book.name}
                      </h4>
                    </a>
                    <p className="text-[10px] md:text-[11px] text-muted-foreground truncate uppercase mt-1 tracking-tight">
                      {book.genre?.split("(")[0].trim()} •{" "}
                      {book.view_count.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
            <h4 className="font-bold text-sm mb-3">Thông báo</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chào mừng bạn đến với hệ thống đọc truyện ngắn phong cách mới.
              Chúc bạn có những giây phút thư giãn!
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
