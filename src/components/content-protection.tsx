"use client";

import { useEffect, useState } from "react";

export function ContentProtection({ children }: { children: React.ReactNode }) {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Chỉ kích hoạt ở môi trường production (thông qua biến env)
    // Nếu chưa thiết lập biến, mặc định theo NODE_ENV.
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

    // 4. Chặn các phím tắt mở DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ["U", "S", "P"].includes(e.key.toUpperCase())) ||
        (e.metaKey && e.altKey && ["I", "J", "C", "U"].includes(e.key.toUpperCase())) ||
        (e.metaKey && ["U", "S", "P"].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
        wipeDOM();
        setIsDevToolsOpen(true);
      }
    };

    // Theo dõi Resize để bắt DevTools dạng Docked ngay lập tức
    const handleResize = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        wipeDOM();
        setIsDevToolsOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);

    // 5. Phát hiện DevTools qua Debugger Loop và Window Dimensions
    const detectDevTools = () => {
      // a. Kiểm tra kích thước cửa sổ (bắt trường hợp DevTools gắn liền (docked))
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        wipeDOM();
        setIsDevToolsOpen(true);
      }

      // b. Debugger loop (bắt trường hợp DevTools tách rời (undocked))
      const start = Date.now();
      try {
        Function('debugger')(); 
      } catch (err) {
        // Fallback an toàn
        // eslint-disable-next-line no-debugger
        debugger;
      }
      const duration = Date.now() - start;
      if (duration > 100) {
        wipeDOM();
        setIsDevToolsOpen(true);
      }
    };
    
    // c. Bẫy Console (Chạy 1 lần duy nhất)
    // Khi DevTools mở ra, nó sẽ cố gắng đọc (parse) nội dung trong console.log
    // Ngay lúc nó đọc, hàm getter sẽ được gọi và xóa sạch DOM ngay lập tức!
    const consoleTrap = new Image();
    Object.defineProperty(consoleTrap, 'id', {
      get: function() {
        wipeDOM();
        setIsDevToolsOpen(true);
        throw new Error("DevTools Detected");
      }
    });
    console.dir(consoleTrap);

    // Kiểm tra liên tục mỗi giây
    const intervalId = setInterval(detectDevTools, 1000);

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
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalId);
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
