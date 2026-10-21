import "./globals.css";
import { Toaster } from "sonner";
import React from "react";

export const metadata = {
  title: "Genesis Residency // Engineering Track Playground",
  description: "Production fellowship starter monorepo for Frontend, Backend, Web3, and Full-Stack tracks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fbfbf9] text-[#111111] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
