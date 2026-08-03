-- Run this query in the Supabase SQL Editor

-- 1. Create book_views table for tracking daily views
CREATE TABLE IF NOT EXISTS public.book_views (
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (book_id, date)
);

-- 2. Create or replace the RPC function for incrementing views
CREATE OR REPLACE FUNCTION public.increment_view_count(p_book_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Increment total views in books table
  UPDATE public.books
  SET view_count = view_count + 1
  WHERE id = p_book_id;

  -- Upsert daily views in book_views table
  INSERT INTO public.book_views (book_id, date, count)
  VALUES (p_book_id, CURRENT_DATE, 1)
  ON CONFLICT (book_id, date)
  DO UPDATE SET count = book_views.count + 1;
END;
$$;
