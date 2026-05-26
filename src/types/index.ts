export interface Book {
  id: string;
  name: string;
  author_name: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  genre: string;
  total_words: number;
  view_count: number;
  publication_status: 'draft' | 'published' | 'archived';
  content: string;
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
