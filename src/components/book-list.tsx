import Image from "next/image";
import Link from "next/link";
import { Eye, BookOpen } from "lucide-react";
import { Book } from "@/types";
import { Badge } from "@/components/ui/badge";

export function BookList({ books, title, description }: { books: Book[] | null, title: string, description: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 min-h-screen">
      <div className="mb-12 border-b pb-6">
        <h1 className="text-3xl md:text-4xl font-serif italic font-bold mb-3 text-primary">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          {description}
        </p>
      </div>

      {!books || books.length === 0 ? (
        <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-serif font-semibold text-muted-foreground">Chưa có truyện nào trong danh sách.</h2>
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
                {book.status === 'completed' && (
                  <div className="absolute top-2 left-2 z-20">
                    <Badge className="bg-primary text-primary-foreground border-none text-[9px] px-1.5 h-4 shadow-md font-bold uppercase tracking-wider">
                      Full
                    </Badge>
                  </div>
                )}
                {book.status === 'ongoing' && (
                  <div className="absolute top-2 left-2 z-20">
                    <Badge className="bg-blue-500/80 text-white border-none text-[9px] px-1.5 h-4 shadow-md font-bold uppercase tracking-wider backdrop-blur-sm">
                      Đang ra
                    </Badge>
                  </div>
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
