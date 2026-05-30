import { supabase } from "@/lib/supabase";

export const BookmarkService = {
  getUserBookmarks: async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select(`
        id,
        created_at,
        book_id,
        books (
          id,
          name,
          slug,
          author_name,
          cover_image_url,
          genre
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  removeBookmark: async (bookmarkId: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId);
    return { error };
  }
};
