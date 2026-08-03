"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AdultGate({ isAdult, children }: { isAdult: boolean, children: React.ReactNode }) {
  const [loading, setLoading] = useState(isAdult);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdult) return;

    const checkAdultStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      
      if (user) {
        const { data } = await supabase.from('users').select('is_adult_verified').eq('id', user.id).single();
        if (data?.is_adult_verified) {
          setIsVerified(true);
        }
      }
      setLoading(false);
    };

    checkAdultStatus();
  }, [isAdult]);

  const handleVerify = async () => {
    setVerifying(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setVerifying(false);
      return;
    }
    
    await supabase.from('users').update({ is_adult_verified: true }).eq('id', user.id);
    setIsVerified(true);
    setVerifying(false);
  };

  if (!isAdult) return <>{children}</>;
  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background border border-border/40 p-8 rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif mb-4 text-foreground">Nội dung nhạy cảm</h2>
        <p className="text-muted-foreground mb-8">
          Truyện này chứa nội dung nhạy cảm, có yếu tố trưởng thành (H). 
          Bạn cần xác nhận mình đã đủ 18 tuổi để tiếp tục đọc.
        </p>

        {isLoggedIn ? (
          <div>
            <button 
              onClick={handleVerify} 
              disabled={verifying}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors mb-4 disabled:opacity-70 flex items-center justify-center"
            >
              {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tôi xác nhận đã đủ 18 tuổi"}
            </button>
            <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground">
              Quay lại trang chủ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="block w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
              Đăng nhập để xác nhận
            </Link>
            <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground">
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
