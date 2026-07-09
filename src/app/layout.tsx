import type { Metadata } from "next";
import "./globals.css";
import "./public-final.css";

export const metadata: Metadata = {
  title: "OOGO",
  description: "OOGO frames a way of seeing - clear, balanced, and quietly confident."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
