import { supabase } from "@/lib/supabase";
import { Book } from "@/types";

export const BookService = {
  getTopViewedBooks: async (limit: number = 10) => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("publication_status", "published")
      .order("view_count", { ascending: false })
      .limit(limit);
    return { data: data as Book[] | null, error };
  },

  getLatestBooks: async (limit: number = 12) => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("publication_status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);
    return { data: data as Book[] | null, error };
  },

  getBookBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("slug", slug)
      .single();
    return { data: data as Book | null, error };
  },

  getAllPublishedBooks: async () => {
    const { data, error } = await supabase
      .from("books")
      .select("slug, updated_at")
      .eq("publication_status", "published");
    return { data, error };
  },

  searchBooks: async (keyword?: string, genre?: string) => {
    let query = supabase.from("books").select("*").eq("publication_status", "published");
    
    if (keyword) {
      query = query.ilike("name", `%${keyword}%`);
    }
    
    if (genre) {
      query = query.ilike("genre", `%${genre}%`);
    }
    
    const { data, error } = await query;
    return { data: data as Book[] | null, error };
  }
};
