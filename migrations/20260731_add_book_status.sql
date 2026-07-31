-- Migration Date: 2026-07-31
-- Description: Thêm cột status vào bảng books để quản lý tình trạng truyện

ALTER TABLE public.books ADD COLUMN IF NOT EXISTS status text DEFAULT 'ongoing';

-- Cập nhật các truyện cũ chưa có status
UPDATE public.books SET status = 'ongoing' WHERE status IS NULL;
