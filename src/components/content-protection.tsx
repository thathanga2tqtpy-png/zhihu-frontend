"use client";

import { useEffect, useState } from "react";

export function ContentProtection() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Chỉ kích hoạt ở môi trường production (thông qua biến env)
    // Nếu chưa thiết lập biến, mặc định theo NODE_ENV.
    const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production" || 
                   (!process.env.NEXT_PUBLIC_APP_ENV && process.env.NODE_ENV === "production");
                   
    if (!isProd) {
      return;
    }

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

    // 4. Chặn các phím tắt mở DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U") ||
        (e.metaKey && e.altKey && ["I", "J", "C", "U"].includes(e.key.toUpperCase())) ||
        (e.metaKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        setIsDevToolsOpen(true);
      }
    };

    // 5. Phát hiện DevTools qua Debugger Loop
    const detectDevToolsDebugger = () => {
      const start = Date.now();
      // Lệnh này sẽ làm dừng main thread nếu DevTools đang mở
      // eslint-disable-next-line no-debugger
      debugger; 
      const duration = Date.now() - start;
      if (duration > 100) {
        setIsDevToolsOpen(true);
      }
    };
    
    // Kiểm tra liên tục mỗi giây
    const intervalId = setInterval(detectDevToolsDebugger, 1000);

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("dragstart", handleDrag);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("dragstart", handleDrag);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);
    };
  }, []);

  if (isDevToolsOpen) {
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

  // Nếu thêm CSS user-select: text, người dùng vẫn có thể bôi đen nhưng không copy được.
  // Việc đó có thể áp dụng ở CSS toàn cục hoặc không ảnh hưởng ở đây.
  return null;
}
