import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "A Next.js e-commerce application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white text-slate-900">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
