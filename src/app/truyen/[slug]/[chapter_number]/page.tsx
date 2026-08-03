import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookService } from "@/services/book.service";
import { ReadingSettings } from "@/components/reading-settings";
import { ChapterNavigator } from "@/components/chapter-navigator";
import Link from "next/link";
import { ChevronLeft, List } from "lucide-react";
import { AdultGate } from "@/components/adult-gate";
import { ViewCounter } from "@/components/view-counter";
import { obfuscateText } from "@/lib/utils";
import { CommentSection } from "@/components/comment-section";
import { RelatedBooks } from "@/components/related-books";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, chapter_number: string }> }): Promise<Metadata> {
  const { slug, chapter_number } = await params;
  const { data } = await BookService.getChapterBySlugAndNumber(slug, parseInt(chapter_number, 10));

  if (!data) {
    return {
      title: "Không tìm thấy chương | Niềm Vui Thoáng Qua",
    };
  }

  return {
    title: `Chương ${data.chapter.chapter_number}: ${data.chapter.title} - ${data.book.name} | Niềm Vui Thoáng Qua`,
    description: `Đọc Chương ${data.chapter.chapter_number}: ${data.chapter.title} của truyện ${data.book.name} trên Niềm Vui Thoáng Qua.`,
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string, chapter_number: string }> }) {
  const { slug, chapter_number } = await params;
  
  const { data } = await BookService.getChapterBySlugAndNumber(slug, parseInt(chapter_number, 10));

  if (!data) notFound();

  const { book, chapter } = data;
  
  const genres = book.book_genres?.map((bg: any) => bg.genres).filter(Boolean) || [];
  
  const adultSlugs = ['h', 'co-h', '18+', 'sac'];
  const adultNames = ['h', 'có h', '18+', 'sắc'];
  const isAdultBook = genres.some((g: any) => adultSlugs.includes(g.slug) || adultNames.includes(g.name.toLowerCase()));

  return (
    <AdultGate isAdult={isAdultBook}>
      <ViewCounter bookId={book.id} chapterId={chapter.id} />
      <div className="max-w-3xl mx-auto py-4 sm:py-8 px-2 sm:px-4 relative">
      <ReadingSettings />
      
      {/* 🟢 AREA 1: Breadcrumb & Title */}
      <div className="mb-8 flex items-center justify-between text-muted-foreground">
        <Link 
          href={`/truyen/${book.slug}`} 
          className="flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại truyện
        </Link>
        <div className="text-sm">
           {book.name}
        </div>
      </div>

      <article id="reading-container" className="transition-all duration-500 rounded-2xl px-4 sm:px-6 md:px-12 pt-4 sm:pt-6 md:pt-6 pb-8 md:pb-12 shadow-md border border-border/40 bg-card text-card-foreground min-h-[70vh]">
        <ChapterNavigator book={book as any} currentChapter={chapter.chapter_number} className="mb-2 pb-2 border-b border-border/30" />

        <header className="mb-4 text-left">
          <h1 className="text-xl md:text-2xl font-bold font-serif leading-tight text-foreground/90">
            Chương {chapter.chapter_number}: {chapter.title}
          </h1>
        </header>

        <div 
          id="reading-content" 
          className="max-w-none whitespace-pre-wrap transition-all duration-300 mx-auto"
        >
          {obfuscateText(chapter.content)}
        </div>
        
        {/* Navigation buttons */}
        <ChapterNavigator book={book as any} currentChapter={chapter.chapter_number} className="mt-4 border-t border-border/30 pt-4" />
      </article>

      {/* Tương tác và Liên quan */}
      <div className="mt-12 space-y-12">
        <CommentSection bookId={book.id} />
        <RelatedBooks 
          genreId={(book.book_genres as any)?.[0]?.genre_id || null} 
          currentBookId={book.id} 
        />
      </div>
    </div>
    </AdultGate>
  );
}
