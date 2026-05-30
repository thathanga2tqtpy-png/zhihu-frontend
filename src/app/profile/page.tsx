"use client";

import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import { ProfileService } from "@/services/profile.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Calendar, BookOpen, Bookmark, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ bookmarks: 0, comments: 0 });
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const { data: { user } } = await AuthService.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);

    // Fetch public profile info
    const { data: profileData } = await ProfileService.getProfileData(user.id);
    
    setProfile(profileData);

    // Fetch stats
    const { count: bookmarkCount } = await ProfileService.getBookmarkCount(user.id);
    const { count: commentCount } = await ProfileService.getCommentCount(user.id);

    setStats({
      bookmarks: bookmarkCount || 0,
      comments: commentCount || 0
    });
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await AuthService.signOut();
    router.push("/");
    toast.success("Đã đăng xuất thành công");
  };

  if (loading) return <div className="max-w-4xl mx-auto py-20 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side: Avatar & Basic Info */}
        <Card className="w-full md:w-1/3 border-none shadow-none bg-muted/20">
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-background">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold">{profile?.display_name || user.email?.split('@')[0]}</h2>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            
            <div className="mt-8 w-full space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3 rounded-xl" onClick={() => router.push("/settings")}>
                <BookOpen className="w-4 h-4" /> Cài đặt đọc
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Stats & Activity */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-none bg-primary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Bookmark className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Đang theo dõi</p>
                  <p className="text-2xl font-black">{stats.bookmarks} truyện</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-primary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Bình luận</p>
                  <p className="text-2xl font-black">{stats.comments} bài viết</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/40 overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Thông tin tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted-foreground">Ngày tham gia</span>
                  <span className="text-sm font-medium">{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted-foreground">ID Người dùng</span>
                  <span className="text-sm font-mono text-xs">{user.id.substring(0, 18)}...</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-muted-foreground">Trạng thái xác thực</span>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">Đã xác minh</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
