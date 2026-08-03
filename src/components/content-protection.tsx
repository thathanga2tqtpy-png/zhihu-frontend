"use client";

import { useEffect, useState } from "react";
import DisableDevtool from "disable-devtool";

export function ContentProtection({ children }: { children: React.ReactNode }) {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production" || 
                   (!process.env.NEXT_PUBLIC_APP_ENV && process.env.NODE_ENV === "production");
                   
    // Tạm thời comment điều kiện này để test trực tiếp trên dev
    // if (!isProd) {
    //   return;
    // }

    // 1. Chặn copy / cut văn bản
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // 2. Chặn kéo thả hình ảnh/văn bản
    const handleDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    // 3. Chặn chuột phải (context menu) để không cho Inspect Element
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const wipeDOM = () => {
      if (typeof document !== 'undefined') {
        document.body.innerHTML = '<div style="height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: red; background: white;">Hệ thống phát hiện DevTools! Vui lòng F5 tải lại trang.</div>';
      }
    };

    // Sử dụng thư viện disable-devtool để bắt DevTools mạnh mẽ hơn (kể cả khi đã mở sẵn F12)
    DisableDevtool({
      ondevtoolopen: () => {
        wipeDOM();
        setIsDevToolsOpen(true);
      },
      timeOutUrl: 'about:blank',
      disableMenu: false, // Mình đã tự custom context menu ở trên
    });

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("dragstart", handleDrag);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("dragstart", handleDrag);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (isDevToolsOpen) {
    // Ngay lập tức xóa sạch nội dung gốc để tránh Inspect Element kịp đọc
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    
    return (
      <div className="fixed inset-0 z-[99999] bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">Cảnh báo bảo mật</h1>
        <p className="text-muted-foreground mb-6 max-w-md text-lg">
          Hệ thống phát hiện công cụ dành cho nhà phát triển (DevTools) đang hoạt động. 
          Vui lòng tắt F12 và tải lại trang để tiếp tục đọc truyện.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          Tải lại trang (F5)
        </button>
      </div>
    );
  }

  // Nếu bình thường, render ra toàn bộ nội dung web
  return <>{children}</>;
}
