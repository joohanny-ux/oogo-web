import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/public-locale";
import "./globals.css";
import "./public-final.css";

export const metadata: Metadata = {
  title: "OOGO",
  description: "OOGO frames a way of seeing - clear, balanced, and quietly confident."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
