import { Metadata } from "next";
import { BookService } from "@/services/book.service";
import { RelatedBooks } from "@/components/related-books";
import { CommentSection } from "@/components/comment-section";
import { notFound } from "next/navigation";
import { Eye, Tag, User, List } from "lucide-react";
import { FollowButton } from "@/components/follow-button";
import { ViewCounter } from "@/components/view-counter";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: book } = await BookService.getBookBySlug(slug);

  if (!book) {
    return {
      title: "Không tìm thấy truyện | Niềm Vui Thoáng Qua",
    };
  }

  return {
    title: `${book.name} - ${book.author_name} | Niềm Vui Thoáng Qua`,
    description: book.description || `Đọc truyện ${book.name} của tác giả ${book.author_name} trên Niềm Vui Thoáng Qua.`,
    openGraph: {
      title: book.name,
      description: book.description || `Đọc truyện ${book.name} của tác giả ${book.author_name}.`,
      images: book.cover_image_url ? [{ url: book.cover_image_url }] : [],
    },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: book } = await BookService.getBookBySlug(slug);

  if (!book) notFound();

  const genres = book.book_genres?.map(bg => bg.genres).filter(Boolean) || [];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative">
      <ViewCounter bookId={book.id} />
      
      {/* 🟢 AREA 1: Book Info */}
      <article className="rounded-2xl p-6 md:p-10 mb-12 shadow-sm border border-border/10 bg-background text-foreground">
        <header className="mb-10 space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold font-serif leading-tight">{book.name}</h1>
            <div className="flex items-center gap-2">
              <FollowButton bookId={book.id} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-[13px] text-muted-foreground border-y py-6 border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                <User className="w-4 h-4 text-primary/70" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 leading-none mb-1">Cây bút</span>
                <span className="font-serif font-black text-foreground text-lg leading-none">{book.author_name}</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-border/40 hidden sm:block" />

            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 leading-none">Chủ đề</span>
              <div className="flex items-center gap-2 text-foreground/90 font-medium italic flex-wrap">
                <Tag className="w-3 h-3 text-primary/60" />
                {genres.length > 0 ? genres.map(g => (
                  <span key={g.id} className="bg-primary/5 px-2 py-0.5 rounded text-xs">{g.name}</span>
                )) : <span className="text-xs">Chưa cập nhật</span>}
              </div>
            </div>

            <div className="h-8 w-px bg-border/40 hidden sm:block" />

            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 leading-none">Tương tác</span>
              <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
                <Eye className="w-3.5 h-3.5 text-primary/60" />
                <span>{book.view_count?.toLocaleString()} lượt xem</span>
              </div>
            </div>
          </div>
        </header>

        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mb-10 font-serif leading-relaxed text-muted-foreground">
          {book.description ? (
             <div dangerouslySetInnerHTML={{ __html: book.description.replace(/\n/g, '<br/>') }} />
          ) : (
            <p className="italic opacity-60">Chưa có mô tả cho truyện này.</p>
          )}
        </div>

        {/* 🟢 AREA 2: Chapters List */}
        <div className="mt-12 border-t border-border/20 pt-8">
          <h2 className="text-2xl font-bold font-serif mb-6 flex items-center gap-2">
            <List className="w-5 h-5 text-primary/70" />
            Danh sách chương
          </h2>
          
          {book.chapters && book.chapters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {book.chapters.map((chapter) => (
                <Link 
                  key={chapter.id} 
                  href={`/truyen/${book.slug}/${chapter.chapter_number}`}
                  className="flex items-center p-3 rounded-lg border border-border/30 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                >
                  <span className="font-semibold text-primary/60 mr-3 w-16 group-hover:text-primary transition-colors">
                    Chương {chapter.chapter_number}
                  </span>
                  <span className="truncate text-foreground/80 group-hover:text-foreground transition-colors">
                    {chapter.title}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed rounded-lg border-border/50 text-muted-foreground">
              Truyện này hiện chưa có chương nào.
            </div>
          )}
        </div>
      </article>

      {/* ⚪️ AREA 3: System Area */}
      <div className="border-t pt-12 border-border/40">
        <CommentSection bookId={book.id} />
        <RelatedBooks genreId={genres[0]?.id || null} currentBookId={book.id} />
      </div>
    </div>
  );
}
