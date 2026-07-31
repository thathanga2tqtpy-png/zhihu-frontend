import { BookService } from "@/services/book.service";
import Link from "next/link";
import Image from "next/image";
import { Eye, BookOpen } from "lucide-react";

export async function RelatedBooks({ genreId, currentBookId }: { genreId: string | null, currentBookId: string }) {
  const { data: relatedBooks } = await BookService.getRelatedBooks(genreId, currentBookId);

  if (!relatedBooks || relatedBooks.length === 0) return null;

  return (
    <div className="mt-16 mb-8 border-t border-border/40 pt-12">
      <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" /> Có thể bạn sẽ thích
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedBooks.slice(0, 4).map((book) => (
          <Link key={book.id} href={`/truyen/${book.slug}`} className="group block space-y-3">
            <div className="relative aspect-[2/3] w-full bg-muted overflow-hidden rounded-lg shadow-sm border border-border/40 hover:border-primary/50 transition-colors">
              {book.cover_image_url ? (
                <Image 
                  src={book.cover_image_url} 
                  alt={book.name} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                  <BookOpen className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {book.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                <span className="truncate max-w-[80px]">{book.author_name}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {book.view_count > 1000 ? `${(book.view_count/1000).toFixed(1)}k` : book.view_count}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
