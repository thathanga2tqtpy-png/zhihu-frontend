-- Run this query in the Supabase SQL Editor to add chapter view tracking

CREATE OR REPLACE FUNCTION public.increment_chapter_view_count(p_chapter_id UUID, p_book_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Increment total views in chapters table
  UPDATE public.chapters
  SET view_count = view_count + 1
  WHERE id = p_chapter_id;

  -- Reuse the existing function to increment book views and daily views
  PERFORM public.increment_view_count(p_book_id);
END;
$$;
