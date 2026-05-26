# Kế hoạch phát triển tính năng nâng cao

## 1. Xác thực (Authentication)
- **Phương thức:** Username/Password (tích hợp `auth.users` của Supabase) và OAuth Google.
- **Quản lý:** Trang cá nhân (`/profile`) để người dùng cập nhật thông tin và mật khẩu.

## 2. Hệ thống Bình luận (Comments)
- **Giao diện:** Form bình luận đơn giản phía dưới nội dung truyện.
- **Backend:** Sử dụng `book_comments` table với quan hệ `book_id` và `user_id`. Hỗ trợ comment phân cấp (parent_comment_id).

## 3. Cá nhân hóa trải nghiệm (Customization)
- **Lưu trữ:** Thêm cột `reading_settings` (JSONB) trong bảng `users` để lưu:
  - `font_family`: serif | sans
  - `font_size`: small | medium | large
  - `line_height`: 1.5 | 1.8 | 2.0
  - `theme`: light | dark | sepia
- **Giao diện:** Một bảng điều khiển nhỏ (Control Panel) xuất hiện khi đang đọc truyện để người dùng tùy chỉnh trực tiếp.
