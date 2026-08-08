import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import { ContentProtection } from "@/components/content-protection";
import { MonetagAds } from "@/components/ads/monetag-ads";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://niemvuithoangqua.vn'),
  title: {
    template: "%s | Niềm Vui Thoáng Qua",
    default: "Niềm Vui Thoáng Qua | Tạp chí truyện ngắn & tản văn đặc sắc",
  },
  description: "Không gian đọc truyện ngắn, tản văn phong cách báo chí tối giản. Nơi lưu giữ những cảm xúc chân thực và những niềm vui nhẹ nhàng trong cuộc sống.",
  keywords: ["truyện ngắn", "tản văn", "đọc truyện", "truyện chữ", "niềm vui thoáng qua", "tiểu thuyết", "đọc truyện online"],
  authors: [{ name: "Niềm Vui Thoáng Qua" }],
  creator: "Niềm Vui Thoáng Qua",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "Niềm Vui Thoáng Qua | Tạp chí truyện ngắn & tản văn đặc sắc",
    description: "Không gian đọc truyện ngắn, tản văn phong cách báo chí tối giản.",
    siteName: "Niềm Vui Thoáng Qua",
    images: [
      {
        url: "/og-image.png", // Ensure you have this image in public/
        width: 1200,
        height: 630,
        alt: "Niềm Vui Thoáng Qua",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Niềm Vui Thoáng Qua | Tạp chí truyện ngắn & tản văn đặc sắc",
    description: "Không gian đọc truyện ngắn, tản văn phong cách báo chí tối giản.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  other: {
    monetag: "2a2d6669445dcf85cbb5c3eaaef9fbb3",
    "google-adsense-account": "ca-pub-8108202645906541",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8108202645906541" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={['light', 'dark', 'coffee', 'pink', 'system']}
        >
          <ContentProtection>
            <MonetagAds />
            <Header />
            <main className="flex-grow container mx-auto px-4">
              {children}
            </main>
            <Footer />
          </ContentProtection>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </html>
  );
}
