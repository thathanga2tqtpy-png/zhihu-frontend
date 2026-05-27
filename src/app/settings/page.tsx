"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { User, Lock, Settings2, ShieldCheck, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Password change state
  const [password, setPassword] = useState("");
  const [confirmPassword, setPasswordConfirm] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);
    setDisplayName(user.user_metadata?.display_name || "");
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });

    if (error) {
      toast.error("Lỗi cập nhật: " + error.message);
    } else {
      // Sync to public.users table if it exists
      await supabase
        .from("users")
        .update({ display_name: displayName })
        .eq("id", user.id);
        
      toast.success("Đã cập nhật thông tin cá nhân");
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải từ 6 ký tự");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("Lỗi: " + error.message);
    } else {
      toast.success("Đã đổi mật khẩu thành công");
      setIsPasswordDialogOpen(false);
      setPassword("");
      setPasswordConfirm("");
    }
    setSaving(false);
  };

  if (loading) return <div className="max-w-4xl mx-auto py-20 text-center text-muted-foreground">Đang tải cấu hình...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <div className="space-y-2 border-b pb-6 border-border/40">
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và thiết lập bảo mật của bạn.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-xl h-auto flex-wrap sm:flex-nowrap">
          <TabsTrigger value="profile" className="flex-1 py-2.5 gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="w-4 h-4" /> Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 py-2.5 gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShieldCheck className="w-4 h-4" /> Bảo mật
          </TabsTrigger>
          <TabsTrigger value="reading" className="flex-1 py-2.5 gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Settings2 className="w-4 h-4" /> Tùy chỉnh đọc
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <Card className="border-border/40 rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật tên hiển thị mà mọi người sẽ thấy.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Email (Không thể thay đổi)</Label>
                <Input id="email" value={user.email} disabled className="bg-muted/30 border-none cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Tên hiển thị</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nhập tên mới của bạn"
                  className="bg-muted/10 border-border/60 focus:bg-background transition-all"
                />
              </div>
              <div className="pt-4">
                <Button onClick={handleUpdateProfile} disabled={saving} className="gap-2 rounded-full px-8">
                  <Save className="w-4 h-4" />
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <Card className="border-border/40 rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle className="text-lg">Bảo mật tài khoản</CardTitle>
              <CardDescription>Quản lý mật khẩu và quyền truy cập.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="space-y-1">
                  <h4 className="font-bold text-base flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Mật khẩu
                  </h4>
                  <p className="text-sm text-muted-foreground">Bạn nên sử dụng mật khẩu mạnh để bảo vệ tài khoản.</p>
                </div>
                
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <span 
                      role="button"
                      tabIndex={0}
                      className={cn(
                        buttonVariants({ variant: "outline" }), 
                        "rounded-full px-6 border-primary/20 hover:bg-primary/5 text-primary cursor-pointer outline-none"
                      )}
                    >
                      Thay đổi mật khẩu
                    </span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold font-serif">Đổi mật khẩu mới</DialogTitle>
                      <DialogDescription>Nhập mật khẩu mới bên dưới. Hệ thống sẽ đăng xuất bạn để đảm bảo an toàn.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                      <div className="space-y-2">
                        <Label>Mật khẩu mới</Label>
                        <Input 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Xác nhận mật khẩu</Label>
                        <Input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setPasswordConfirm(e.target.value)} 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleChangePassword} disabled={saving} className="w-full rounded-full">
                        {saving ? "Đang xử lý..." : "Xác nhận thay đổi"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* READING TAB - Reusing info but making it static-friendly here */}
        <TabsContent value="reading">
           <Card className="border-border/40 rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle className="text-lg">Tùy chỉnh đọc truyện</CardTitle>
              <CardDescription>Các cài đặt này sẽ được áp dụng khi bạn vào trang đọc truyện.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center space-y-6">
              <div className="p-12 bg-muted/20 rounded-3xl border-2 border-dashed border-border/40">
                <Settings2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Bạn có thể tùy chỉnh trực tiếp Màu nền, Cỡ chữ và Phông chữ ngay trong trang đọc truyện bằng thanh công cụ ở góc màn hình.
                </p>
                <div className="mt-8">
                  <Button onClick={() => router.push("/")} variant="outline" className="rounded-full px-8">Quay lại trang chủ</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
