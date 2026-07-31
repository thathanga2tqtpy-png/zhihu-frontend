-- Migration Date: 2026-07-31
-- Description: Thay đổi cấu trúc cơ sở dữ liệu để hỗ trợ truyện có nhiều chương và thể loại tách biệt.

-- 1. Bảng `genres` (Thể loại)
CREATE TABLE IF NOT EXISTS public.genres (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT genres_pkey PRIMARY KEY (id)
);

ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép tất cả mọi người đọc thể loại" ON public.genres FOR SELECT USING (true);

-- 2. Bảng `book_genres` (Liên kết nhiều-nhiều giữa truyện và thể loại)
CREATE TABLE IF NOT EXISTS public.book_genres (
  book_id uuid NOT NULL,
  genre_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT book_genres_pkey PRIMARY KEY (book_id, genre_id),
  CONSTRAINT book_genres_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE,
  CONSTRAINT book_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE
);

ALTER TABLE public.book_genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép tất cả mọi người đọc liên kết thể loại" ON public.book_genres FOR SELECT USING (true);

-- 3. Bảng `chapters` (Chương truyện)
CREATE TABLE IF NOT EXISTS public.chapters (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL,
  chapter_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chapters_pkey PRIMARY KEY (id),
  CONSTRAINT chapters_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép tất cả mọi người đọc chương" ON public.chapters FOR SELECT USING (true);

-- Đảm bảo mỗi chương của một truyện có số thứ tự duy nhất
ALTER TABLE public.chapters ADD CONSTRAINT unique_chapter_number_per_book UNIQUE (book_id, chapter_number);

-- 4. Xóa cột `content` khỏi bảng `books` (Người dùng đồng ý xóa luôn không cần giữ lại)
ALTER TABLE public.books DROP COLUMN IF EXISTS content;
-- Và xóa cột `genre` chuỗi cũ
ALTER TABLE public.books DROP COLUMN IF EXISTS genre;

-- 5. Cập nhật bảng `reading_history`
-- Xóa bảng cũ và tạo lại với `chapter_id` hoặc thêm khóa phụ (ở đây ta thay `last_position` bằng `chapter_id`)
-- Tuy nhiên, có thể giữ `book_id` để biết lịch sử truyện nào, và thêm `chapter_id` để biết đang đọc chương nào.
ALTER TABLE public.reading_history ADD COLUMN IF NOT EXISTS chapter_id uuid;
ALTER TABLE public.reading_history ADD CONSTRAINT reading_history_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE;
