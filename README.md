# Niềm Vui Thoáng Qua - Tạp chí Truyện Ngắn & Tản Văn

Dự án trang web đọc truyện ngắn phong cách báo chí tối giản, tập trung vào trải nghiệm cảm xúc và sự tĩnh lặng.

## 🚀 Bắt đầu nhanh

### 1. Cấu hình biến môi trường
Tạo tệp `.env.local` từ `.env.example`:
```bash
cp .env.example .env.local
```
Cập nhật các thông số kết nối Supabase của bạn.

### 2. Cài đặt và Chạy
```bash
npm install
npm run dev
```

## 📂 Cấu trúc thư mục
- `src/app`: Định nghĩa route và trang (Next.js App Router).
- `src/components`: Các UI components (Header, Footer, UI Kit).
- `src/lib`: Các cấu hình dùng chung (Supabase client, utils).
- `src/services`: Logic xử lý dữ liệu từ Database.
- `src/types`: Định nghĩa kiểu dữ liệu TypeScript.
- `src/styles`: CSS toàn cục và cấu hình Tailwind.

## 🛠 Phân tách môi trường
- **Development (`npm run dev`)**: Sử dụng biến môi trường từ `.env.local`. Hỗ trợ Hot Reload và báo lỗi chi tiết.
- **Production (`npm run build && npm run start`)**: Tối ưu hóa hiệu năng, nén mã nguồn. Yêu cầu cấu hình biến môi trường đầy đủ trên hosting (ví dụ: Vercel).

## 📄 Tài liệu liên quan
- [GEMINI.md](./GEMINI.md): Quy chuẩn lập trình và kiến trúc hệ thống.
- [database.sql](./database.sql): Cấu trúc Database (Supabase/PostgreSQL).
