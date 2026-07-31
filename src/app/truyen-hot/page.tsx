import { BookService } from "@/services/book.service";
import { BookList } from "@/components/book-list";

export const metadata = {
  title: "Truyện nổi bật | Niềm Vui Thoáng Qua",
  description: "Danh sách những truyện ngắn có lượt đọc cao nhất.",
};

export default async function HotBooksPage() {
  const { data: books } = await BookService.getTopViewedBooks(48);

  return (
    <BookList 
      books={books} 
      title="Truyện Hot Nhất" 
      description="Những tác phẩm được cộng đồng yêu thích và đọc nhiều nhất" 
    />
  );
}
