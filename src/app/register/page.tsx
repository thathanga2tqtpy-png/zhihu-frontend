"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-serif italic text-primary">Niềm Vui Thoáng Qua</h1>
        <p className="text-muted-foreground mt-2">Tạo tài khoản mới</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4 border p-8 rounded-xl shadow-sm">
        <div className="space-y-2">
          <Label>Tên hiển thị</Label>
          <Input 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Tên của bạn"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Mật khẩu</Label>
          <Input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-primary hover:underline font-bold">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
}
