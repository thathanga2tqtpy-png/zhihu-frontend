import { supabase } from "@/lib/supabase";
import { BookService } from "@/services/book.service";
import Image from "next/image";
import Link from "next/link";
import { Eye, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { data: genre } = await supabase.from("genres").select("*").eq("slug", resolvedParams.slug).single();
  
  if (!genre) return { title: "Thể loại không tồn tại" };
  
  return {
    title: `Truyện ${genre.name} | Niềm Vui Thoáng Qua`,
    description: genre.description || `Danh sách truyện thuộc thể loại ${genre.name}`,
  };
}

export default async function GenreSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Fetch genre info
  const { data: genre } = await supabase.from("genres").select("*").eq("slug", slug).single();
  
  if (!genre) {
    notFound();
  }

  // 2. Fetch books
  const { data: books } = await BookService.getBooksByGenre(slug, 48);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      <div className="mb-12 border-b pb-6">
        <h1 className="text-3xl md:text-4xl font-serif italic font-bold mb-3 text-primary">
          Thể loại: {genre.name}
        </h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          {genre.description || "Khám phá những câu chuyện đặc sắc"}
        </p>
      </div>

      {!books || books.length === 0 ? (
        <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-serif font-semibold text-muted-foreground">Chưa có truyện nào thuộc thể loại này.</h2>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
          {books.map((book) => (
            <div key={book.id} className="group flex flex-col space-y-3">
              <Link href={`/truyen/${book.slug}`} className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted shadow-sm block border group-hover:border-primary/50 transition-colors">
                {book.cover_image_url && (
                  <Image
                    src={book.cover_image_url}
                    alt={book.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </Link>

              <div className="space-y-1.5 flex-1 flex flex-col">
                <Link href={`/truyen/${book.slug}`}>
                  <h3 className="text-xs md:text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {book.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider mt-auto pt-2">
                  <span className="truncate max-w-[70px] md:max-w-[100px] font-medium">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
