import { Metadata } from "next";
import { BookService } from "@/services/book.service";
import { CommentSection } from "@/components/comment-section";
import { ReadingSettings } from "@/components/reading-settings";
import { notFound } from "next/navigation";
import { Eye, BookmarkPlus, Tag, User } from "lucide-react";
import { FollowButton } from "@/components/follow-button";
import { ViewCounter } from "@/components/view-counter";

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

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 relative">
      <ViewCounter bookId={book.id} />
      <ReadingSettings />
      
      {/* 🟢 AREA 1: Themed Reading Area */}
      <article id="reading-container" className="transition-all duration-500 rounded-2xl p-6 md:p-10 mb-12 shadow-sm border border-border/10 bg-background text-foreground">
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

            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 leading-none">Chủ đề</span>
              <div className="flex items-center gap-1.5 text-foreground/90 font-medium italic">
                <Tag className="w-3 h-3 text-primary/60" />
                <span className="lowercase">{book.genre?.split('(')[0].trim()}</span>
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

        <div 
          id="reading-content" 
          className="max-w-none whitespace-pre-wrap transition-all duration-300"
        >
          {book.content}
        </div>
      </article>

      {/* ⚪️ AREA 2: System Area (Not affected by reading themes usually, but let's keep it clean) */}
      <div className="border-t pt-12 border-border/40">
        <CommentSection bookId={book.id} />
      </div>
    </div>
  );
}
