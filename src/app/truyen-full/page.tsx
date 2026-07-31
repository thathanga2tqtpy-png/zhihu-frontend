import { BookService } from "@/services/book.service";
import { BookList } from "@/components/book-list";

export const metadata = {
  title: "Truyện đã hoàn thành (Full) | Niềm Vui Thoáng Qua",
  description: "Danh sách những truyện ngắn đã ra trọn bộ.",
};

export default async function FullBooksPage() {
  const { data: books } = await BookService.getCompletedBooks(48);

  return (
    <BookList 
      books={books} 
      title="Truyện Đã Hoàn Thành" 
      description="Thưởng thức trọn vẹn những câu chuyện không dang dở" 
    />
  );
}
