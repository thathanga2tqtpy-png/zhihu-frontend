import { supabase } from "@/lib/supabase";
import { Book } from "@/types";

export const BookService = {
  getTopViewedBooks: async (limit: number = 10) => {
    const { data, error } = await supabase
      .from("books")
      .select("*, book_genres(genres(*))")
      .eq("publication_status", "published")
      .order("view_count", { ascending: false })
      .limit(limit);
    return { data: data as Book[] | null, error };
  },

  getLatestBooks: async (limit: number = 12) => {
    const { data, error } = await supabase
      .from("books")
      .select("*, book_genres(genres(*))")
      .eq("publication_status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);
    return { data: data as Book[] | null, error };
  },

  getCompletedBooks: async (limit: number = 12) => {
    const { data, error } = await supabase
      .from("books")
      .select("*, book_genres(genres(*))")
      .eq("publication_status", "published")
      .eq("status", "completed")
      .order("updated_at", { ascending: false })
      .limit(limit);
    return { data: data as Book[] | null, error };
  },

  getBookBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from("books")
      .select("*, book_genres(genres(*)), chapters(id, title, chapter_number, view_count)")
      .eq("slug", slug)
      .single();
    
    // Sắp xếp chapters theo chapter_number
    if (data && data.chapters) {
      data.chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number);
    }
    
    return { data: data as Book | null, error };
  },

  getChapterBySlugAndNumber: async (slug: string, chapterNumber: number) => {
    // 1. Fetch book id
    const { data: book } = await supabase.from("books").select("id, name, slug").eq("slug", slug).single();
    if (!book) return { data: null, error: "Book not found" };

    // 2. Fetch chapter
    const { data: chapter, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("book_id", book.id)
      .eq("chapter_number", chapterNumber)
      .single();

    if (chapter) {
      return { data: { book, chapter }, error: null };
    }
    return { data: null, error };
  },

  getAllPublishedBooks: async () => {
    const { data, error } = await supabase
      .from("books")
      .select("slug, updated_at")
      .eq("publication_status", "published");
    return { data, error };
  },

  searchBooks: async (keyword?: string, genreId?: string) => {
    let query = supabase.from("books").select("*, book_genres!inner(genre_id, genres(*))").eq("publication_status", "published");
    
    if (keyword) {
      query = query.ilike("name", `%${keyword}%`);
    }
    
    if (genreId) {
      query = query.eq("book_genres.genre_id", genreId);
    }
    
    const { data, error } = await query;
    return { data: data as Book[] | null, error };
  },

  getBooksByGenre: async (genreSlug: string, limit: number = 6) => {
    const { data: genreData } = await supabase.from("genres").select("id").eq("slug", genreSlug).single();
    if (!genreData) return { data: null, error: null };

    const { data, error } = await supabase
      .from("books")
      .select("*, book_genres!inner(genre_id, genres(*))")
      .eq("publication_status", "published")
      .eq("book_genres.genre_id", genreData.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    return { data: data as Book[] | null, error };
  },

  getRelatedBooks: async (genreId: string | null, excludeId: string) => {
    let fetchSameGenre: any = Promise.resolve({ data: [] });
    if (genreId) {
      fetchSameGenre = supabase.from("books").select("*, book_genres!inner(genre_id, genres(*))").eq("publication_status", "published").eq("book_genres.genre_id", genreId).neq("id", excludeId).limit(10);
    }
    
    const fetchTopView = supabase.from("books").select("*, book_genres(genres(*))").eq("publication_status", "published").neq("id", excludeId).order("view_count", { ascending: false }).limit(10);
    const fetchLatest = supabase.from("books").select("*, book_genres(genres(*))").eq("publication_status", "published").neq("id", excludeId).order("created_at", { ascending: false }).limit(10);

    const [sameGenreRes, topViewRes, latestRes] = await Promise.all([fetchSameGenre, fetchTopView, fetchLatest]);

    let mix: Book[] = [];
    const shuffle = (array: any[]) => array.sort(() => 0.5 - Math.random());

    if (sameGenreRes.data) mix.push(...shuffle(sameGenreRes.data).slice(0, 2));
    if (topViewRes.data) mix.push(...shuffle(topViewRes.data).slice(0, 1));
    if (latestRes.data) mix.push(...shuffle(latestRes.data).slice(0, 1));

    mix = mix.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

    return { data: mix };
  }
};
