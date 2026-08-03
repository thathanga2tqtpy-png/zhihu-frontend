-- 1. Hàm tính tổng view của tất cả các chương và cập nhật vào bảng books
CREATE OR REPLACE FUNCTION public.update_book_view_count_from_chapters()
RETURNS TRIGGER AS $$
BEGIN
  -- Cập nhật view_count của sách bằng tổng view_count của các chương
  UPDATE public.books
  SET view_count = (
    SELECT COALESCE(SUM(view_count), 0)
    FROM public.chapters
    WHERE book_id = NEW.book_id
  )
  WHERE id = NEW.book_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Tạo trigger chạy sau khi có sự cập nhật ở cột view_count của bảng chapters
DROP TRIGGER IF EXISTS trigger_update_book_view_count ON public.chapters;

CREATE TRIGGER trigger_update_book_view_count
AFTER UPDATE OF view_count ON public.chapters
FOR EACH ROW
WHEN (OLD.view_count IS DISTINCT FROM NEW.view_count)
EXECUTE FUNCTION public.update_book_view_count_from_chapters();

-- 3. Vì đã có Trigger tự tính tổng, ta cần sửa lại hàm increment_chapter_view_count để nó không cộng dồn dư thừa
CREATE OR REPLACE FUNCTION public.increment_chapter_view_count(p_chapter_id UUID, p_book_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Chỉ cần tăng view ở chương, Trigger sẽ lo việc cộng dồn cho sách!
  UPDATE public.chapters
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_chapter_id;

  -- Lưu ý: Vẫn cần ghi nhận view hàng ngày cho bảng book_views
  INSERT INTO public.book_views (book_id, date, count)
  VALUES (p_book_id, CURRENT_DATE, 1)
  ON CONFLICT (book_id, date)
  DO UPDATE SET count = book_views.count + 1;
END;
$$;
