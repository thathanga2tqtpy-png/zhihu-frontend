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
          display_name: fullName,
          full_name: fullName, // Keep for fallback or trigger mapping
        },
      },
    });
  },

  signInWithOAuth: async (provider: 'google' | 'github', redirectTo?: string) => {
    return await supabase.auth.signInWithOAuth({ 
      provider,
      options: {
        redirectTo: redirectTo
      }
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  updateUser: async (data: any) => {
    return await supabase.auth.updateUser(data);
  }
};
