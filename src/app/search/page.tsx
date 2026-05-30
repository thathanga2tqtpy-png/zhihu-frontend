"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookService } from "@/services/book.service";
import { Book } from "@/types";
import { GENRES } from "@/types/genres";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";

function SearchContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get("genre");

  useEffect(() => {
    fetchBooks();
  }, [search, activeGenre]);

  const fetchBooks = async () => {
    setLoading(true);
    const { data } = await BookService.searchBooks(search, activeGenre || undefined);
    setBooks(data || []);
    setLoading(false);
  };

  return (
    <>
      <div className="space-y-6 mb-12">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Tìm theo tên truyện..."
            className="pl-10 h-12 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/search">
            <Badge variant={!activeGenre ? "default" : "outline"} className="cursor-pointer">Tất cả</Badge>
          </Link>
          {GENRES.map((genre) => (
            <Link key={genre} href={`/search?genre=${encodeURIComponent(genre)}`}>
              <Badge variant={activeGenre === genre ? "default" : "outline"} className="cursor-pointer">
                {genre}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="border p-4 rounded-lg hover:border-primary transition-colors">
              <Link href={`/truyen/${book.slug}`}>
                <h3 className="font-bold text-lg mb-1">{book.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{book.author_name} • {book.genre}</p>
                <p className="text-sm line-clamp-3">{book.description}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Tìm kiếm & Phân loại</h1>
      <Suspense fallback={<p className="text-center">Đang tải bộ lọc...</p>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
