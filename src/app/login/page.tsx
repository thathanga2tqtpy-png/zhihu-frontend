"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { AuthService } from "@/services/auth.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await AuthService.signInWithPassword(email, password);
    if (error) alert(error.message);
    else window.location.href = redirectUrl;
  };

  const handleGoogleLogin = async () => {
    await AuthService.signInWithOAuth("google", `${window.location.origin}${redirectUrl}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Mật khẩu</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Đăng nhập</Button>
        </form>
        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            Đăng nhập với Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Bạn chưa có tài khoản?{" "}
          <a href="/register" className="text-primary font-bold hover:underline">Đăng ký ngay</a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-20">
      <Suspense fallback={<div className="text-center text-muted-foreground p-10">Đang tải...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
