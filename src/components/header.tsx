"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu, LogOut, Settings, Bookmark, X } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<any>(null);

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

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('vi-VN', options));

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const NavItems = ["Trang chủ", "Trinh thám", "Tình cảm", "Kinh dị", "Kiếm hiệp", "Tác giả", "Xếp hạng"];

  return (
    <header className={cn(
      "border-b bg-background sticky top-0 z-50 transition-transform duration-500",
      isVisible ? "translate-y-0 shadow-sm" : "-translate-y-full"
    )}>
      {/* Top Bar: Desktop only */}
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

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-2 pb-2 md:pt-4 md:pb-2">
        <div className="grid grid-cols-3 items-center">
          
          {/* Mobile Menu Trigger (Left) */}
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger 
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9 cursor-pointer outline-none"
                )}
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full bg-background">
                  <SheetHeader className="p-6 border-b text-left">
                    <SheetTitle className="font-serif italic text-primary text-xl">Niềm Vui Thoáng Qua</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
                    {/* User Section in Menu */}
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Tài khoản</p>
                      {user ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sm truncate">
                                {user.user_metadata?.display_name || user.email?.split('@')[0]}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            <Link href="/profile" className="flex items-center gap-3 p-2 text-sm hover:bg-muted rounded-lg transition-colors">
                              <User className="w-4 h-4" /> Trang cá nhân
                            </Link>
                            <Link href="/bookmarks" className="flex items-center gap-3 p-2 text-sm hover:bg-muted rounded-lg transition-colors">
                              <Bookmark className="w-4 h-4" /> Truyện đã lưu
                            </Link>
                            <Button variant="ghost" onClick={handleLogout} className="justify-start gap-3 px-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                              <LogOut className="w-4 h-4" /> Đăng xuất
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "justify-start gap-3 rounded-xl")}>
                            <User className="w-4 h-4" /> Đăng nhập
                          </Link>
                          <Link href="/register" className={cn(buttonVariants({ variant: "default" }), "justify-start gap-3 rounded-xl")}>
                            <Settings className="w-4 h-4" /> Đăng ký thành viên
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Search in Menu */}
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Tìm kiếm</p>
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Tìm truyện, tác giả..." 
                          className="pl-10 h-11 bg-muted/50 border-none rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Navigation in Menu */}
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Danh mục</p>
                      <nav className="flex flex-col gap-1">
                        {NavItems.map((item) => (
                          <Link 
                            key={item} 
                            href={`/category/${item.toLowerCase()}`}
                            className="p-2 text-base font-medium hover:text-primary hover:translate-x-1 transition-all"
                          >
                            {item}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Desktop Search */}
            <div className="hidden md:flex relative w-48 group ml-4">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Tìm truyện..." 
                className="pl-8 h-7 text-[10px] bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* Logo (Center) - The Star of the Mobile Header */}
          <div className="flex justify-center flex-col items-center">
            <Link href="/" className="flex flex-col items-center group">
              <div className="relative w-36 h-9 md:w-64 md:h-14 transition-transform duration-300 group-hover:scale-[1.02]">
                <Image 
                  src="/text-logo.png" 
                  alt="Niềm Vui Thoáng Qua" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              <p className="hidden md:block text-[8px] uppercase tracking-[0.4em] text-muted-foreground mt-0.5 font-medium opacity-80 whitespace-nowrap">
                Gói ghém những cảm xúc chân thực
              </p>
            </Link>
          </div>

          {/* User Actions (Right) - Desktop only or Minimal */}
          <div className="flex justify-end items-center">
            {user ? (
              <div className="hidden md:block">
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
                        <Link href="/profile" className="flex items-center gap-2 w-full"><User className="w-4 h-4" /> <span>Trang cá nhân</span></Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/bookmarks" className="flex items-center gap-2 w-full"><Bookmark className="w-4 h-4" /> <span>Truyện đã lưu</span></Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                        <LogOut className="w-4 h-4 mr-2" /> <span>Đăng xuất</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-4 text-[11px] font-bold uppercase tracking-wider">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="sm" className="h-8 rounded-full px-5 text-[11px] font-bold uppercase tracking-wider border-2 hover:bg-primary hover:text-white transition-all">Đăng ký</Button>
                </Link>
              </div>
            )}
            {/* Empty space for grid on mobile to keep logo centered */}
            <div className="w-9 md:hidden" /> 
          </div>
        </div>
      </div>

      {/* Navigation Bar: Desktop only */}
      <nav className="border-t pt-0.5 pb-0 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-6">
          {NavItems.map((item) => (
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
