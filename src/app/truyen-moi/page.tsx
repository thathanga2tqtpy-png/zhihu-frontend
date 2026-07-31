import { BookService } from "@/services/book.service";
import { BookList } from "@/components/book-list";

export const metadata = {
  title: "Truyện mới cập nhật | Niềm Vui Thoáng Qua",
  description: "Danh sách những truyện ngắn mới được cập nhật gần đây.",
};

export default async function NewBooksPage() {
  const { data: books } = await BookService.getLatestBooks(48);

  return (
    <BookList 
      books={books} 
      title="Truyện Mới Cập Nhật" 
      description="Những câu chuyện mới nhất vừa được gửi đến bạn" 
    />
  );
}
