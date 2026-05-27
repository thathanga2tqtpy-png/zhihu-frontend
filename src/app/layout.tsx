import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "Niềm Vui Thoáng Qua | Tạp chí truyện ngắn & tản văn đặc sắc",
  description: "Không gian đọc truyện ngắn, tản văn phong cách báo chí tối giản. Nơi lưu giữ những cảm xúc chân thực và những niềm vui nhẹ nhàng trong cuộc sống.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-grow container mx-auto px-4">
          {children}
        </main>
        <Footer />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </html>
  );
}
