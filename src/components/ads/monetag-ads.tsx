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
    const injectScript = (zone: string, src: string, intervalSeconds: number) => {
      // Tránh việc chèn trùng lặp một script có cùng zone ID
      if (document.querySelector(`script[data-zone="${zone}"]`)) return;

      const s = document.createElement("script");
      s.dataset.zone = zone;
      s.src = src;
      
      // Sử dụng tính năng giới hạn tần suất của chính hệ thống Monetag
      // Giả sử tối đa 100 lần trong 24h để đảm bảo quảng cáo vẫn hiện sau mỗi khoảng interval
      s.dataset.frequency = "100";    
      s.dataset.capping = "24";     
      // Thời gian chờ giữa các lần bật quảng cáo
      s.dataset.interval = intervalSeconds.toString();

      document.body.appendChild(s);
    };

    // 1. Vignette Banner (Zone 11521873)
    // Trang: Mô tả truyện (Book Detail)
    // Tần suất: 30 phút/lần (Khoảng 1800 giây, mình set là 1800 giây để khớp comment cũ)
    if (isBookDetail) {
      injectScript("11521873", "https://n6wxm.com/vignette.min.js", 1800);
    }

    // 2. Onclick Popunder (Zone 11512756)
    // Trang: Đọc truyện (Chapter)
    // Tần suất: 15 phút/lần, sau 5 phút kể từ lần vào web đầu tiên (15 phút = 900 giây)
    if (isChapter && minutesSinceFirstVisit >= 5) {
      injectScript("11512756", "https://al5sm.com/tag.min.js", 900);
    }

    // 3. In-Page Push (Zone 11513055)
    // Trang: Đọc truyện (Chapter) & Phân loại truyện (Category/Hot/New)
    // Tần suất: 15 phút/lần, sau 5 phút kể từ lần vào web đầu tiên (15 phút = 900 giây)
    if ((isChapter || isCategory) && minutesSinceFirstVisit >= 5) {
      injectScript("11513055", "https://nap5k.com/tag.min.js", 900);
    }

  }, [pathname]);

  return null;
}
