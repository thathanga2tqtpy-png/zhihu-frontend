import { supabase } from "@/lib/supabase";

export const ProfileService = {
  getProfileData: async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  updateProfileData: async (userId: string, data: any) => {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);
    return { error };
  },

  getBookmarkCount: async (userId: string) => {
    const { count, error } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    return { count, error };
  },

  getCommentCount: async (userId: string) => {
    const { count, error } = await supabase
      .from("book_comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    return { count, error };
  }
};
