import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng - Niềm Vui Thoáng Qua",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-32 py-16 md:py-24 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-foreground">Điều khoản sử dụng</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Cập nhật lần cuối: Tháng 8, 2026</p>
      </div>
      
      <div className="space-y-10 text-muted-foreground leading-relaxed font-serif text-base md:text-lg">
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">1. Chấp nhận các Điều khoản</h2>
          <p>
            Bằng việc truy cập và sử dụng trang web "Niềm Vui Thoáng Qua", bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng không tiếp tục sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">2. Sở hữu trí tuệ</h2>
          <p>
            Tất cả nội dung, truyện, thiết kế, đồ họa và giao diện trên trang web này thuộc bản quyền của "Niềm Vui Thoáng Qua" hoặc các tác giả đóng góp. Bạn không được phép sao chép, phân phối hoặc sửa đổi bất kỳ nội dung nào mà không có sự cho phép trước bằng văn bản.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">3. Trách nhiệm của người dùng</h2>
          <p className="mb-4">
            Khi sử dụng nền tảng của chúng tôi, bạn cam kết:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Tôn trọng các độc giả và tác giả khác.</li>
            <li>Không đăng tải các nội dung vi phạm pháp luật, thuần phong mỹ tục hoặc chứa nội dung độc hại.</li>
            <li>Chịu hoàn toàn trách nhiệm về những bình luận và nội dung mà bạn tạo ra trên nền tảng.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">4. Từ chối bảo đảm</h2>
          <p>
            Trang web và các dịch vụ đi kèm được cung cấp trên cơ sở "nguyên trạng". Chúng tôi không đảm bảo rằng dịch vụ sẽ không bị gián đoạn, không có lỗi hoặc hoàn toàn an toàn. Mọi rủi ro phát sinh trong quá trình sử dụng đều thuộc về người dùng.
          </p>
        </section>
      </div>
    </div>
  );
}
