import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import CartSidebar from "@/components/layout/CartSidebar";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بوتان لند | مرجع تخصصی سیستم‌های گرمایشی",
  description: "خرید آنلاین پکیج، رادیاتور و کولر گازی بوتان با بهترین قیمت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 👇 ویژگی suppressHydrationWarning را اینجا اضافه کن
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazir.className} bg-gray-50 text-gray-900 pb-20 md:pb-0`}>
        <Header />
        
        <main>{children}</main>
        
        <Footer />
        <BottomNav />
        
        <CartSidebar />
      </body>
    </html>
  );
}