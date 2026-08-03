import Image from "next/image";
import { BookService } from "@/services/book.service";
import { Book, Genre } from "@/types";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Clock, TrendingUp, Sparkles } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { RankingList } from "@/components/ranking-list";
import { TrendingCarousel } from "@/components/trending-carousel";

export const revalidate = 60; // ISR cache 60 giây

export default async function Home() {
  // 1. Lấy Truyện Thịnh hành (Hot tháng)
  const { data: typedTopViewed } = await BookService.getRankingsByTime('month', 10);

  // 2. Lấy Truyện mới nhất
  const { data: typedLatest } = await BookService.getLatestBooks(12);

  // 3. Chọn 3 danh mục ngẫu nhiên
  const { data: allGenres } = await supabase.from("genres").select("*");
  const shuffledGenres = allGenres ? [...allGenres].sort(() => 0.5 - Math.random()).slice(0, 3) : [];
  
  // 4. Lấy bình luận mới nhất
  const { data: recentComments } = await BookService.getLatestComments(5);
  
  // 5. Fetch Ranking Data
  const [{ data: dayRankings }, { data: weekRankings }, { data: monthRankings }] = await Promise.all([
    BookService.getRankingsByTime('day', 8),
    BookService.getRankingsByTime('week', 8),
    BookService.getRankingsByTime('month', 8)
  ]);
  
  // 6. Fetch truyện cho 3 danh mục này
  const categoryBooksPromises = shuffledGenres.map(async (genre) => {
    const { data } = await BookService.getBooksByGenre(genre.slug, 6);
    return { genre, books: data || [] };
  });
  
  const categories = await Promise.all(categoryBooksPromises);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 space-y-16 overflow-x-hidden">
      {/* Section 1: Top Trending / Featured Small Cards */}
      <section>
        <div className="flex items-center justify-between mb-2 md:mb-3">
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
        <div className="w-full">
          <TrendingCarousel books={typedTopViewed || []} />
        </div>
      </section>

      <Separator />

      {/* Section 2: Main Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Latest Updates List (Compact) */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Mới cập nhật
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-16 gap-y-3 md:gap-y-3">
            {typedLatest?.map((book) => (
              <a
                href={`/truyen/${book.slug}`}
                key={book.id}
                className="group relative flex gap-4 p-3 rounded-xl border border-border/40 bg-muted/10 hover:border-border/80 hover:bg-muted/30 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex flex-col flex-shrink-0 w-20">
                  <div className="relative w-20 h-28 bg-muted overflow-hidden rounded-sm">
                    {book.cover_image_url && (
                      <Image
                        src={book.cover_image_url}
                        alt={book.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[8px] md:text-[9px] text-muted-foreground mt-1.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span className="truncate">{timeAgo(book.updated_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-start py-1 min-w-0">
                    <h4 className="font-bold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                      {book.name}
                    </h4>
                  <div className="flex items-center gap-2 md:gap-3 mt-2 text-[9px] md:text-[11px] text-muted-foreground uppercase tracking-wide overflow-hidden">
                    <span className="font-semibold truncate max-w-[120px] md:max-w-[160px]">
                      {book.author_name}
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Eye className="w-3.5 h-3.5" />
                      {book.view_count > 1000 ? `${(book.view_count/1000).toFixed(1)}k` : book.view_count}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {book.book_genres?.slice(0, 4).map((bg: any, i: number) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-medium border border-border/50">
                        {bg.genres?.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed italic font-serif">
                    {book.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Rankings / Top Viewed List */}
        <aside className="space-y-10">
          <RankingList 
            dayRankings={dayRankings || []}
            weekRankings={weekRankings || []}
            monthRankings={monthRankings || []}
          />

          <div className="border rounded-xl p-6">
            <h3 className="font-bold text-sm md:text-base mb-6 flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
              Bình luận mới
            </h3>
            <div className="space-y-5">
              {recentComments && recentComments.length > 0 ? (
                recentComments.map((comment: any) => (
                  <div key={comment.id} className="text-sm pb-5 border-b border-border/40 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-primary truncate max-w-[120px]">{comment.users?.display_name || "Ẩn danh"}</span>
                      <span className="text-[10px] text-muted-foreground">{timeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-3 italic mb-2 leading-relaxed text-[13px] font-serif">&quot;{comment.content}&quot;</p>
                    <a href={`/truyen/${comment.books?.slug}`} className="text-[11px] font-semibold hover:text-primary transition-colors truncate block px-2 py-1 bg-muted/50 rounded inline-block max-w-full">
                      <span className="text-muted-foreground font-normal">Truyện:</span> {comment.books?.name}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">Chưa có bình luận nào.</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Section 3: Random Categories */}
      {categories.map((cat, idx) => (
        <section key={idx} className="pt-8 border-t border-border/40 mt-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight uppercase font-serif italic">
                {cat.genre.name}
              </h2>
            </div>
            <a
              href={`/search?genres=${cat.genre.slug}`}
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Xem tất cả
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cat.books.map((book) => (
              <a href={`/truyen/${book.slug}`} key={book.id} className="group relative flex gap-4 p-3 rounded-xl border border-border/40 bg-muted/10 hover:border-border/80 hover:bg-muted/30 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex flex-col flex-shrink-0 w-16 sm:w-20">
                  <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-md overflow-hidden shadow-sm block">
                    {book.cover_image_url ? (
                      <Image
                        src={book.cover_image_url}
                        alt={book.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[8px] md:text-[9px] text-muted-foreground mt-1.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span className="truncate">{timeAgo(book.updated_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0 py-1">
                    <h4 className="font-bold text-sm sm:text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {book.name}
                    </h4>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-wider">
                     <span className="font-medium text-foreground/80 truncate max-w-[150px]">{book.author_name}</span>
                     <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                     <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {book.view_count > 1000 ? `${(book.view_count/1000).toFixed(1)}k` : book.view_count}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {book.book_genres?.slice(0, 4).map((bg: any, i: number) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-medium border border-border/50">
                        {bg.genres?.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 italic font-serif leading-relaxed">
                     {book.description || "Đang cập nhật nội dung..."}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Niềm Vui Thoáng Qua",
            "url": "https://niemvuithoangqua.vn",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://niemvuithoangqua.vn/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </div>
  );
}
