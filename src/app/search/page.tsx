"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookService } from "@/services/book.service";
import { Book, Genre } from "@/types";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, BookOpen, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function SearchContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const genresParam = searchParams.get("genres");
  const activeGenreSlugs = genresParam ? genresParam.split(",") : [];
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      const { data } = await supabase.from("genres").select("*").order("name");
      if (data) setGenres(data);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, genresParam]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, count } = await BookService.searchBooks(
        debouncedSearch, 
        activeGenreSlugs.length > 0 ? activeGenreSlugs : undefined, 
        page, 
        50
      );
      setBooks(data || []);
      setTotalPages(Math.ceil((count || 0) / 50) || 1);
      setLoading(false);
    };
    fetchBooks();
  }, [debouncedSearch, genresParam, page]);

  const toggleGenre = (slug: string) => {
    let newSlugs = [...activeGenreSlugs];
    if (newSlugs.includes(slug)) {
      newSlugs = newSlugs.filter(s => s !== slug);
    } else {
      newSlugs.push(slug);
    }
    
    if (newSlugs.length > 0) {
      router.push(`/search?genres=${newSlugs.join(",")}`);
    } else {
      router.push(`/search`);
    }
  };

  const clearGenres = () => {
    router.push(`/search`);
  };

  return (
    <>
      <div className="space-y-6 mb-12">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Tìm theo tên truyện hoặc tác giả..."
            className="pl-10 h-12 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={activeGenreSlugs.length === 0 ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={clearGenres}
          >
            Tất cả
          </Badge>
          {genres.map((genre) => (
            <Badge 
              key={genre.id}
              variant={activeGenreSlugs.includes(genre.slug) ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => toggleGenre(genre.slug)}
            >
              {genre.name}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length === 0 && <p className="col-span-full text-center text-muted-foreground">Không tìm thấy truyện nào.</p>}
          {books.map((book) => (
            <Link 
              key={book.id} 
              href={`/truyen/${book.slug}`}
              className="border p-4 rounded-xl hover:border-primary/50 transition-colors bg-card shadow-sm flex gap-4 group cursor-pointer"
            >
              <div className="flex-shrink-0">
                <div className="relative w-20 h-28 bg-muted overflow-hidden rounded-md border border-border/40">
                  {book.cover_image_url ? (
                    <Image src={book.cover_image_url} alt={book.name} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><BookOpen className="w-6 h-6"/></div>
                  )}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-bold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">{book.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                  <span className="truncate max-w-[80px] font-semibold">{book.author_name}</span>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {book.view_count > 1000 ? `${(book.view_count/1000).toFixed(1)}k` : book.view_count}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 italic">{book.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => {
              setPage(p => p - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Trang trước
          </Button>
          <span className="text-sm font-medium">Trang {page} / {totalPages}</span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => {
              setPage(p => p + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Trang sau
          </Button>
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
