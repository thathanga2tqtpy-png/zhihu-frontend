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
      .select("*, book_genres(genres(*)), book_tags(tags(id, name)), chapters(id, title, chapter_number, view_count)")
      .eq("slug", slug)
      .single();
    
    // Sắp xếp chapters theo chapter_number
    if (data && data.chapters) {
      data.chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number);
    }
    
    return { data: data as Book | null, error };
  },

  getChapterBySlugAndNumber: async (slug: string, chapterNumber: number) => {
    // 1. Fetch book id and its chapters
    const { data: book } = await supabase.from("books").select("id, name, slug, book_genres(genre_id, genres(slug, name)), chapters(id, chapter_number, title)").eq("slug", slug).single();
    if (!book) return { data: null, error: "Book not found" };

    if (book.chapters) {
      book.chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number);
    }

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

  searchBooks: async (keyword?: string, genreSlugs?: string[], page: number = 1, limit: number = 50) => {
    let query = supabase.from("books").select("*, book_genres!inner(genres(*))", { count: 'exact' }).eq("publication_status", "published");
    
    if (keyword) {
      query = query.ilike("name", `%${keyword}%`);
    }
    
    if (genreSlugs && genreSlugs.length > 0) {
      let validBookIds: string[] = [];
      
      for (let i = 0; i < genreSlugs.length; i++) {
        const { data } = await supabase
          .from("book_genres")
          .select("book_id, genres!inner(slug)")
          .eq("genres.slug", genreSlugs[i]);
          
        const ids = data?.map(d => d.book_id) || [];
        
        if (i === 0) {
          validBookIds = ids;
        } else {
          validBookIds = validBookIds.filter(id => ids.includes(id));
        }
        
        // Nếu không có sách nào thỏa mãn, thoát sớm
        if (validBookIds.length === 0) break;
      }
      
      if (validBookIds.length === 0) {
        return { data: [], error: null, count: 0 };
      }
      
      query = query.in("id", validBookIds);
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to).order('created_at', { ascending: false });
    
    const { data, error, count } = await query;
    return { data: data as Book[] | null, error, count };
  },

  getBooksByGenre: async (genreSlug: string, limit: number = 6) => {
    const { data: genreData } = await supabase.from("genres").select("id").eq("slug", genreSlug).single();
    if (!genreData) return { data: null, error: null };

    const { data: bgData } = await supabase.from("book_genres").select("book_id").eq("genre_id", genreData.id);
    const bookIds = bgData?.map(bg => bg.book_id) || [];

    if (bookIds.length === 0) return { data: [], error: null };

    const { data, error } = await supabase
      .from("books")
      .select("*, book_genres(genres(*))")
      .eq("publication_status", "published")
      .in("id", bookIds)
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
  },

  getLatestComments: async (limit: number = 5) => {
    const { data, error } = await supabase
      .from("book_comments")
      .select("*, users(display_name), books(name, slug)")
      .order("created_at", { ascending: false })
      .limit(limit);
      
    return { data, error };
  },

  getRankingsByTime: async (period: 'day' | 'week' | 'month' | 'all', limit: number = 8) => {
    if (period === 'all') {
      const { data, error } = await supabase
        .from("books")
        .select(`
          id, name, slug, cover_image_url, author_name, view_count, description, updated_at,
          book_genres (
            genres (
              id, name, slug
            )
          )
        `)
        .order("view_count", { ascending: false })
        .limit(limit);
      return { data, error };
    }

    // For day, week, month, we query book_views
    let startDate = new Date();
    // Chuyển sang múi giờ Việt Nam (UTC+7) để xác định đúng ngày
    const offset = 7 * 60 * 60 * 1000;
    const localDate = new Date(startDate.getTime() + offset);

    if (period === 'day') {
      // Chỉ lấy trong ngày hôm nay
    } else if (period === 'week') {
      localDate.setDate(localDate.getDate() - 7);
    } else if (period === 'month') {
      localDate.setMonth(localDate.getMonth() - 1);
    }

    const dateStr = localDate.toISOString().split('T')[0];

    const { data: viewsData, error: viewsError } = await supabase
      .from('book_views')
      .select('book_id, count')
      .gte('date', dateStr);

    if (viewsError || !viewsData) return { data: [], error: viewsError };

    // Group by book_id and sum counts
    const countsMap = new Map<string, number>();
    viewsData.forEach(row => {
      countsMap.set(row.book_id, (countsMap.get(row.book_id) || 0) + row.count);
    });

    if (countsMap.size === 0) return { data: [], error: null };

    // Sort by total views descending and take top N
    const sortedBookIds = Array.from(countsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(entry => entry[0]);

    // Fetch book details
    const { data: booksData, error: booksError } = await supabase
      .from("books")
      .select(`
        id, name, slug, cover_image_url, author_name, view_count, description, updated_at,
        book_genres (
          genres (
            id, name, slug
          )
        )
      `)
      .in('id', sortedBookIds);

    if (booksError || !booksData) return { data: [], error: booksError };

    // Sort booksData according to sortedBookIds order and inject period views
    const books = sortedBookIds
      .map(id => {
        const b = booksData.find(b => b.id === id);
        if (b) {
          return { ...b, period_view_count: countsMap.get(id) };
        }
        return null;
      })
      .filter(Boolean);

    return { data: books, error: null };
  }
};
