# Dự án Zhihu Frontend - Quy chuẩn & Kiến trúc

Tài liệu này dành cho các nhà phát triển và AI Agent để đảm bảo tính nhất quán của mã nguồn.

## 🏛 Kiến trúc Hệ thống
- **Frontend**: Next.js (App Router), React 19.
- **UI Framework**: Shadcn UI + Tailwind CSS 4.
- **Backend**: Supabase (Database, Auth, Storage).

## 📐 Quy chuẩn Lập trình
1. **Thư mục**: Luôn đặt mã nguồn trong `src/`.
2. **Components**:
   - UI chung đặt trong `src/components/ui`.
   - Các component theo tính năng đặt trực tiếp trong `src/components`.
3. **Services**: Không viết logic gọi Supabase trực tiếp trong Page. Hãy chuyển vào `src/services`.
4. **Styling**: Sử dụng phong cách **Báo chí (Journalism)**:
   - Font Serif cho nội dung văn bản.
   - Khoảng cách (spacing) rộng rãi.
   - Màu sắc tối giản.

## 🚀 Lộ trình Phát triển
- [x] Tái cấu trúc thư mục `src/`.
- [ ] Hoàn thiện hệ thống Authentication (Google/Password).
- [ ] Tính năng lưu lịch sử đọc tự động.
- [ ] Tối ưu hóa SEO và tốc độ tải trang.
