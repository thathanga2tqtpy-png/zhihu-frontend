-- 1. Thêm cột reading_settings vào bảng users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS reading_settings JSONB DEFAULT '{
  "fontSize": "text-lg",
  "font": "font-serif"
}'::jsonb;

-- 2. Thêm cột view_count vào bảng books
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- 3. Đảm bảo ràng buộc Foreign Key cho bảng book_comments
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'book_comments_user_id_fkey') THEN
    ALTER TABLE public.book_comments
    ADD CONSTRAINT book_comments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id);
  END IF;
END $$;

-- 4. Bảng lịch sử đọc
CREATE TABLE IF NOT EXISTS public.reading_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  book_id uuid NOT NULL,
  last_position integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reading_history_pkey PRIMARY KEY (id),
  CONSTRAINT reading_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reading_history_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id)
);

ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
