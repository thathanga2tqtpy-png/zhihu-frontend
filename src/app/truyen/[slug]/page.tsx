import { Metadata } from "next";
import { BookService } from "@/services/book.service";
import { RelatedBooks } from "@/components/related-books";
import { CommentSection } from "@/components/comment-section";
import { notFound } from "next/navigation";
import { FollowButton } from "@/components/follow-button";
import { BookDescription } from "@/components/book-description";
import { Eye, Tag, User, List, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdultGate } from "@/components/adult-gate";

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
  
  const adultSlugs = ['h', 'co-h', '18+', 'sac'];
  const adultNames = ['h', 'có h', '18+', 'sắc'];
  const isAdultBook = genres.some(g => adultSlugs.includes(g.slug) || adultNames.includes(g.name.toLowerCase()));

  return (
    <AdultGate isAdult={isAdultBook}>
      <div className="max-w-4xl mx-auto py-6 md:py-12 px-2 sm:px-4 relative">
      
      {/* 🟢 AREA 1: Book Info */}
      <article className="rounded-2xl p-4 sm:p-6 md:p-10 mb-8 md:mb-12 shadow-sm border border-border/10 bg-card text-card-foreground">
        <header className="mb-8 md:mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            {/* Poster */}
            <div className="w-32 md:w-44 shrink-0 relative aspect-[2/3] bg-muted rounded-xl overflow-hidden shadow-md border border-border/20">
              {book.cover_image_url ? (
                <Image src={book.cover_image_url} alt={book.name} fill sizes="(max-width: 768px) 192px, 224px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><BookOpen className="w-12 h-12" /></div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 mb-8 text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold font-serif leading-tight">{book.name}</h1>
                <div className="flex items-center gap-2 shrink-0">
                  <FollowButton bookId={book.id} />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-4 gap-x-8 text-[13px] text-muted-foreground border-y py-6 border-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                    <User className="w-4 h-4 text-primary/70" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 leading-none mb-1">Cây bút</span>
                    <span className="font-serif font-black text-foreground text-lg leading-none">{book.author_name}</span>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-border/40 hidden sm:block" />

                <div className="flex flex-col gap-2 text-left">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 leading-none">Chủ đề</span>
              <div className="flex items-center gap-2 text-foreground/90 font-medium italic flex-wrap">
                <Tag className="w-3 h-3 text-primary/60" />
                {genres.length > 0 ? genres.map(g => (
                  <span key={g.id} className="bg-primary/5 px-2 py-0.5 rounded text-xs">{g.name}</span>
                )) : null}
                
                {book.book_tags && book.book_tags.map(bt => bt.tags).filter(Boolean).map(tag => (
                  <span key={tag.id} className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground border border-border/40">#{tag.name}</span>
                ))}
                
                {genres.length === 0 && (!book.book_tags || book.book_tags.length === 0) && (
                  <span className="text-xs">Chưa cập nhật</span>
                )}
              </div>
            </div>

                <div className="h-8 w-px bg-border/40 hidden sm:block" />

                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 leading-none">Tương tác</span>
                  <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
                    <Eye className="w-3.5 h-3.5 text-primary/60" />
                    <span>{book.view_count?.toLocaleString()} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <BookDescription text={book.description} />

        {/* 🟢 AREA 2: Chapters List */}
        <div className="mt-12 border-t border-border/20 pt-8">
          <h2 className="text-2xl font-bold font-serif mb-6 flex items-center gap-2">
            <List className="w-5 h-5 text-primary/70" />
            Danh sách chương
          </h2>
          
          {book.chapters && book.chapters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {book.chapters.map((chapter) => (
                <Link 
                  key={chapter.id} 
                  href={`/truyen/${book.slug}/${chapter.chapter_number}`}
                  className="flex items-center p-2.5 rounded-md border border-border/30 hover:border-primary/40 hover:bg-primary/5 transition-colors group text-sm"
                >
                  <span className="font-semibold text-primary/60 mr-2 shrink-0 whitespace-nowrap group-hover:text-primary transition-colors">
                    Chương {chapter.chapter_number}
                  </span>
                  <span className="truncate text-foreground/80 group-hover:text-foreground transition-colors text-xs">
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

      {/* JSON-LD for Book */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": book.name,
            "author": {
              "@type": "Person",
              "name": book.author_name
            },
            "description": book.description,
            "image": book.cover_image_url || "",
            "genre": genres.map(g => g.name),
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://niemvuithoangqua.vn'}/truyen/${book.slug}`
          })
        }}
      />
    </AdultGate>
  );
}
