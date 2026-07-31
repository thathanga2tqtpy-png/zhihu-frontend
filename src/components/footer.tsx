import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-12 mt-20 bg-muted/10 text-muted-foreground">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="font-serif italic text-2xl font-bold text-primary mb-4">Niềm Vui Thoáng Qua</h3>
          <p className="text-sm leading-relaxed max-w-sm">
            Không gian lưu giữ những cảm xúc chân thực và những niềm vui nhẹ nhàng trong cuộc sống qua từng câu chữ.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4 uppercase text-sm tracking-wider">Khám phá</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
            <li><Link href="/search" className="hover:text-primary transition-colors">Tìm kiếm</Link></li>
            <li><Link href="/bookmarks" className="hover:text-primary transition-colors">Truyện đã lưu</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4 uppercase text-sm tracking-wider">Kết nối</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Về chúng tôi</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Điều khoản</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Bảo mật</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 mt-12 pt-8 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Niềm Vui Thoáng Qua. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
