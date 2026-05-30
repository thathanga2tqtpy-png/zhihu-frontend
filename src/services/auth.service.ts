import { supabase } from "@/lib/supabase";

export const AuthService = {
  getUser: async () => {
    return await supabase.auth.getUser();
  },
  
  signInWithPassword: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signUp: async (email: string, password: string, fullName: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  },

  signInWithOAuth: async (provider: 'google' | 'github') => {
    return await supabase.auth.signInWithOAuth({ provider });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  updateUser: async (data: any) => {
    return await supabase.auth.updateUser(data);
  }
};
