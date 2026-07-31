export interface Book {
  id: string;
  name: string;
  author_name: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  total_words: number;
  view_count: number;
  publication_status: 'draft' | 'published' | 'archived';
  status: 'ongoing' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
  book_genres?: { genres: Genre }[];
  chapters?: Chapter[];
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  content: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  book_id: string;
  user_id: string;
  content: string;
  created_at: string;
  users?: {
    display_name: string;
  };
}
