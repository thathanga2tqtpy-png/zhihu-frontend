# Kiến trúc hệ thống

## 1. Cấu trúc thư mục (Dự kiến)
```text
/src
  /app           # Next.js App Router
  /components    # Các UI component (Header, Footer, ReadingArea)
  /components/ui # Shadcn UI components
  /styles        # CSS thuần (Global + Tailwind configuration)
  /lib           # Database client, logic xử lý, utils
  /types         # TypeScript definitions
```

## 2. Thiết kế giao diện (Phong cách Báo chí)
- **Framework UI:** Sử dụng [Shadcn UI](https://ui.shadcn.com/) để xây dựng các component cơ bản, kết hợp Tailwind CSS để tùy chỉnh phong cách báo chí.
- **Typography:** Ưu tiên font serif cho nội dung truyện để tạo cảm giác đọc sách/báo.
- **Layout:** Cột đơn (single column) cho bài viết, khoảng cách rộng rãi, typography rõ ràng.
- **Màu sắc:** Tối giản (đen, trắng, xám trung tính), tránh các yếu tố gây mất tập trung.

## 3. Luồng dữ liệu (Database Mapping)
- Tương tác chính qua `books` table.
- Sử dụng `slug` để tạo URL thân thiện (ví dụ: /truyen/ten-truyen-ngan).
- Tagging hệ thống qua `book_tags` và `tags` table.
