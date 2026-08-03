import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tatoox Academy · Tinta, ideas y calle",
  description: "El diario visual de un aprendiz de tatuador: dibujos, ideas, proceso y oficio.",
  keywords: ["Tatoox Academy", "tatuador", "tatuajes", "dibujo", "Barcelona"],
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/logo-tatoox.jpeg",
    shortcut: "/logo-tatoox.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
