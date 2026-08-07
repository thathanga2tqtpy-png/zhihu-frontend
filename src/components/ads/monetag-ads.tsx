"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MonetagAds() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Phân tích loại trang hiện tại
    const isHomePage = pathname === "/";
    const isBookDetail = /^\/truyen\/[^\/]+$/.test(pathname);
    const isChapter = /^\/truyen\/[^\/]+\/[^\/]+$/.test(pathname);
    const isCategory = 
      pathname.startsWith("/the-loai") || 
      pathname.startsWith("/truyen-hot") || 
      pathname.startsWith("/truyen-moi") || 
      pathname.startsWith("/truyen-full") ||
      pathname.startsWith("/search");

    // Trang chủ tuyệt đối không có quảng cáo
    if (isHomePage) return;

    const now = Date.now();
    
    // Theo dõi thời gian lần đầu vào trang web
    let firstVisitStr = localStorage.getItem("monetag_first_visit");
    if (!firstVisitStr) {
      firstVisitStr = now.toString();
      localStorage.setItem("monetag_first_visit", firstVisitStr);
    }
    const firstVisitTime = parseInt(firstVisitStr, 10);
    const minutesSinceFirstVisit = (now - firstVisitTime) / (1000 * 60);

    // Hàm hỗ trợ chèn script động
    const injectScript = (zone: string, src: string) => {
      // Tránh việc chèn trùng lặp một script có cùng zone ID
      if (document.querySelector(`script[data-zone="${zone}"]`)) return;
      
      const s = document.createElement("script");
      s.dataset.zone = zone;
      s.src = src;
      document.body.appendChild(s);
    };

    // 1. Vignette Banner (Zone 11521873)
    // Trang: Mô tả truyện (Book Detail)
    // Tần suất: 30 phút/lần
    if (isBookDetail) {
      const lastVignette = parseInt(localStorage.getItem("monetag_last_vignette") || "0", 10);
      if (now - lastVignette > 30 * 60 * 1000) {
        injectScript("11521873", "https://n6wxm.com/vignette.min.js");
        localStorage.setItem("monetag_last_vignette", now.toString());
      }
    }

    // 2. Onclick Popunder (Zone 11512756)
    // Trang: Đọc truyện (Chapter)
    // Tần suất: 15 phút/lần, sau 5 phút kể từ lần vào web đầu tiên
    if (isChapter && minutesSinceFirstVisit >= 5) {
      const lastPopunder = parseInt(localStorage.getItem("monetag_last_popunder") || "0", 10);
      if (now - lastPopunder > 15 * 60 * 1000) {
        injectScript("11512756", "https://al5sm.com/tag.min.js");
        localStorage.setItem("monetag_last_popunder", now.toString());
      }
    }

    // 3. In-Page Push (Zone 11513055)
    // Trang: Đọc truyện (Chapter) & Phân loại truyện (Category/Hot/New)
    // Tần suất: 15 phút/lần, sau 5 phút kể từ lần vào web đầu tiên
    if ((isChapter || isCategory) && minutesSinceFirstVisit >= 5) {
      const lastInPagePush = parseInt(localStorage.getItem("monetag_last_inpage") || "0", 10);
      if (now - lastInPagePush > 15 * 60 * 1000) {
        injectScript("11513055", "https://nap5k.com/tag.min.js");
        localStorage.setItem("monetag_last_inpage", now.toString());
      }
    }

  }, [pathname]);

  return null;
}
