import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Умный дом под ключ | SunWell",
  description: "Проектирование, поставка и установка систем умного дома с удобным онлайн‑конфигуратором.",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="antialiased">
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-white">Загрузка...</div></div>}>
          <a href="#main-content" className="sr-only-focusable">Перейти к содержимому</a>
          {children}
        </Suspense>
      </body>
    </html>
  );
}


