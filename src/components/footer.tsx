import Link from "next/link";
import { Sparkles, Mail, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 pt-16 pb-8 overflow-hidden bg-background">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 -z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-8 md:px-16 lg:px-32 xl:px-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shadow-sm">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif italic text-2xl font-bold tracking-tight text-foreground">
                Niềm Vui Thoáng Qua
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-8 font-serif italic">
              "Không gian tĩnh lặng lưu giữ những cảm xúc chân thực và những niềm vui nhẹ nhàng trong cuộc sống qua từng trang sách."
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 rounded-full bg-muted border border-transparent hover:border-border/50 hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2.5 rounded-full bg-muted border border-transparent hover:border-border/50 hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="p-2.5 rounded-full bg-muted border border-transparent hover:border-border/50 hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-6 lg:col-span-3">
            <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-[0.2em]">Khám phá</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-all flex items-center gap-2 group w-max">
                  <span className="w-0 group-hover:w-2 h-[1px] bg-primary transition-all duration-300" />
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-all flex items-center gap-2 group w-max">
                  <span className="w-0 group-hover:w-2 h-[1px] bg-primary transition-all duration-300" />
                  Tìm kiếm nâng cao
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-primary transition-all flex items-center gap-2 group w-max">
                  <span className="w-0 group-hover:w-2 h-[1px] bg-primary transition-all duration-300" />
                  Tủ sách của tôi
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-6 lg:col-span-4">
            <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-[0.2em]">Cập nhật mới</h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Đăng ký để nhận thông báo về những tác phẩm mới nhất và các tính năng thú vị sắp ra mắt.
            </p>
            <div className="relative mt-2">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full bg-background border border-border/50 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
              />
              <button 
                type="button" 
                className="absolute right-1 top-1 bottom-1 aspect-square bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>&copy; {new Date().getFullYear()} Niềm Vui Thoáng Qua. Thiết kế với trái tim.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Bảo mật</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
