import { supabase } from "@/lib/supabase";

export const ProfileService = {
  getProfileData: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  updateProfileData: async (userId: string, data: any) => {
    const { error } = await supabase
      .from("profiles")
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
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    return { count, error };
  }
};
