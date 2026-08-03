import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật - Niềm Vui Thoáng Qua",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-32 py-16 md:py-24 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-foreground">Chính sách bảo mật</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Cập nhật lần cuối: Tháng 8, 2026</p>
      </div>
      
      <div className="space-y-10 text-muted-foreground leading-relaxed font-serif text-base md:text-lg">
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">1. Thu thập thông tin</h2>
          <p>
            Chúng tôi chỉ thu thập những thông tin cơ bản cần thiết nhằm cải thiện trải nghiệm đọc truyện của bạn, bao gồm địa chỉ email (khi bạn đăng ký) và dữ liệu lịch sử duyệt web cơ bản thông qua cookies để duy trì trạng thái đăng nhập và lưu lại các truyện yêu thích.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">2. Sử dụng thông tin</h2>
          <p className="mb-4">
            Dữ liệu thu thập được sẽ chỉ được sử dụng cho các mục đích:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cá nhân hóa trải nghiệm đọc truyện của bạn.</li>
            <li>Gửi thông báo về truyện mới hoặc bản cập nhật hệ thống (nếu bạn cho phép).</li>
            <li>Phân tích và cải thiện chất lượng dịch vụ của trang web.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">3. Bảo vệ dữ liệu</h2>
          <p>
            Bảo mật thông tin của bạn là ưu tiên hàng đầu của chúng tôi. Chúng tôi áp dụng các tiêu chuẩn mã hóa bảo mật hiện đại để bảo vệ cơ sở dữ liệu và thông tin cá nhân của người dùng khỏi những truy cập trái phép. Tuy nhiên, không có phương thức truyền dữ liệu nào qua Internet là an toàn 100%.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">4. Chia sẻ với bên thứ ba</h2>
          <p>
            Chúng tôi cam kết tuyệt đối <strong>không bán, trao đổi hoặc chia sẻ</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào, ngoại trừ các trường hợp bắt buộc theo yêu cầu của cơ quan thực thi pháp luật.
          </p>
        </section>
      </div>
    </div>
  );
}
