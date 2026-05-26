"use client";

import Link from "next/link";
import { Search, User, Menu, LogOut, Settings, Bookmark } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<any>(null);

  // Theo dõi trạng thái cuộn trang
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 120) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  // Lấy ngày tháng và trạng thái User
  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('vi-VN', options));

    // Lấy thông tin user hiện tại
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Lắng nghe thay đổi trạng thái Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className={cn(
      "border-b bg-background sticky top-0 z-50 transition-transform duration-500",
      isVisible ? "translate-y-0 shadow-sm" : "-translate-y-full"
    )}>
      {/* Top Bar: Date & Quick Actions */}
      <div className="border-b py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          <div className="flex items-center gap-4">
            <span>{currentDate}</span>
            <span className="opacity-30">|</span>
            <span>Tuyển tập truyện ngắn đặc sắc</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-primary transition-colors">Về chúng tôi</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Liên hệ</Link>
          </div>
        </div>
      </div>

      {/* Main Header: Logo & Search */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-3 pb-1.5 md:pt-4 md:pb-2">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-4">
          
          {/* Mobile Menu & Search (Left) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-48 group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Tìm truyện..." 
                className="pl-8 h-7 text-[10px] bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex md:hidden">
             <Button variant="ghost" size="icon" className="h-7 w-7">
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Logo (Center) */}
          <div className="flex justify-center flex-col items-center">
            <Link href="/" className="inline-block text-center">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter font-serif italic text-primary leading-none">
                Zhihu <span className="text-foreground not-italic">Reads</span>
              </h1>
              <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1 font-medium">
                Tạp chí văn học trực tuyến
              </p>
            </Link>
          </div>

          {/* User Actions (Right) */}
          <div className="flex justify-end items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger 
                  className={cn(
                    buttonVariants({ variant: "ghost" }), 
                    "h-8 gap-2 rounded-full px-4 text-xs font-bold hover:bg-muted transition-colors cursor-pointer outline-none"
                  )}
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex items-center gap-2 w-full">
                        <User className="w-4 h-4" />
                        <span>Trang cá nhân</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/bookmarks" className="flex items-center gap-2 w-full">
                        <Bookmark className="w-4 h-4" />
                        <span>Truyện đã lưu</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/settings" className="flex items-center gap-2 w-full">
                        <Settings className="w-4 h-4" />
                        <span>Cài đặt</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-4 text-[11px] font-bold uppercase tracking-wider">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="sm" className="h-8 rounded-full px-5 text-[11px] font-bold uppercase tracking-wider border-2 hover:bg-primary hover:text-white transition-all">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden h-7 w-7">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Bottom) */}
      <nav className="border-t pt-0.5 pb-0 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-6">
          {["Trang chủ", "Trinh thám", "Tình cảm", "Kinh dị", "Kiếm hiệp", "Tác giả", "Xếp hạng"].map((item) => (
            <Link 
              key={item} 
              href={`/category/${item.toLowerCase()}`}
              className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-all"
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
