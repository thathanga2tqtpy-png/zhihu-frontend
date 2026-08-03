import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookService } from "@/services/book.service";
import { ReadingSettings } from "@/components/reading-settings";
import Link from "next/link";
import { ChevronLeft, List } from "lucide-react";
import { AdultGate } from "@/components/adult-gate";
import { ViewCounter } from "@/components/view-counter";

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
      <div className="max-w-4xl mx-auto py-8 px-4 relative">
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

      <article id="reading-container" className="transition-all duration-500 rounded-2xl p-6 md:p-12 shadow-sm border border-border/10 bg-background text-foreground min-h-[70vh]">
        <header className="mb-12 text-center border-b border-border/30 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif leading-tight mb-4">
            Chương {chapter.chapter_number}: {chapter.title}
          </h1>
        </header>

        <div 
          id="reading-content" 
          className="max-w-none whitespace-pre-wrap transition-all duration-300 mx-auto"
        >
          {chapter.content}
        </div>
        
        {/* Navigation buttons */}
        <div className="mt-16 flex justify-between items-center border-t border-border/30 pt-8">
          <Link 
            href={`/truyen/${book.slug}/${chapter.chapter_number > 1 ? chapter.chapter_number - 1 : chapter.chapter_number}`}
            className={`px-4 py-2 rounded border border-border/50 hover:bg-primary/5 transition-colors ${chapter.chapter_number <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
          >
            Chương trước
          </Link>
          
          <Link href={`/truyen/${book.slug}`} className="p-2 border border-border/50 rounded-full hover:bg-primary/5 text-muted-foreground">
            <List className="w-5 h-5" />
          </Link>
          
          <Link 
            href={`/truyen/${book.slug}/${chapter.chapter_number + 1}`}
            className="px-4 py-2 rounded border border-border/50 hover:bg-primary/5 transition-colors"
          >
            Chương sau
          </Link>
        </div>
      </article>
    </div>
    </AdultGate>
  );
}
