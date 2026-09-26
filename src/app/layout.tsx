import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Past Questions Lab — CSC 106 Microprocessor Systems",
  description: "AI-powered past questions examination and learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
