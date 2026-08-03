-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  display_name text,
  phone text,
  date_of_birth date,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  reading_settings jsonb DEFAULT '{"font": "font-serif", "fontSize": "text-lg"}'::jsonb,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.books (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  owner_user_id uuid NOT NULL,
  name text NOT NULL,
  author_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  cover_image_url text,
  description text,
  publication_status text DEFAULT 'published'::text,
  last_published_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  total_words integer DEFAULT 0,
  view_count integer DEFAULT 0,
  status text DEFAULT 'ongoing'::text,
  CONSTRAINT books_pkey PRIMARY KEY (id),
  CONSTRAINT books_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id)
);
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);
CREATE TABLE public.book_tags (
  book_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT book_tags_pkey PRIMARY KEY (book_id, tag_id),
  CONSTRAINT book_tags_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
  CONSTRAINT book_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
CREATE TABLE public.book_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL,
  user_id uuid NOT NULL,
  parent_comment_id uuid,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT book_comments_pkey PRIMARY KEY (id),
  CONSTRAINT book_comments_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
  CONSTRAINT book_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT book_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.book_comments(id)
);
CREATE TABLE public.book_follows (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  book_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT book_follows_pkey PRIMARY KEY (id),
  CONSTRAINT book_follows_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT book_follows_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id)
);
CREATE TABLE public.book_ratings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating_value integer NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
  review_text text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT book_ratings_pkey PRIMARY KEY (id),
  CONSTRAINT book_ratings_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
  CONSTRAINT book_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.api_keys (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE,
  gmail text NOT NULL,
  is_active boolean DEFAULT true,
  last_used_at timestamp with time zone DEFAULT now(),
  usage_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT api_keys_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reading_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  book_id uuid NOT NULL,
  last_position integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  chapter_id uuid,
  CONSTRAINT reading_history_pkey PRIMARY KEY (id),
  CONSTRAINT reading_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reading_history_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
  CONSTRAINT reading_history_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id)
);
CREATE TABLE public.bookmarks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  book_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookmarks_pkey PRIMARY KEY (id),
  CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT bookmarks_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id)
);
CREATE TABLE public.genres (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT genres_pkey PRIMARY KEY (id)
);
CREATE TABLE public.book_genres (
  book_id uuid NOT NULL,
  genre_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT book_genres_pkey PRIMARY KEY (book_id, genre_id),
  CONSTRAINT book_genres_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
  CONSTRAINT book_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id)
);
CREATE TABLE public.chapters (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL,
  chapter_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chapters_pkey PRIMARY KEY (id),
  CONSTRAINT chapters_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id)
);