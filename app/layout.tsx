import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DFM Tattoo Artist · Albatàrrec, Lleida",
  description: "El teu projecte, la meva passió. DFM Tattoo Artist: realisme, microrealisme i fine line a Albatàrrec, Lleida.",
  keywords: ["DFM", "tattoo", "tatuatges", "realisme", "fine line", "microrealisme", "Albatàrrec", "Lleida"],
  openGraph: {
    title: "DFM Tattoo Artist · Albatàrrec, Lleida",
    description: "El teu projecte, la meva passió. Tatuatges personalitzats amb estil i detall.",
    images: [{ url: "/portfolio/p02-x10.webp", width: 1080, height: 1440, alt: "DFM Tattoo Artist: retrat original del portafoli" }],
    locale: "ca_ES", type: "website",
  },
  twitter: { card: "summary_large_image", title: "DFM Tattoo Artist", images: ["/portfolio/p02-x10.webp"] },
  icons: { icon: "/dfm-logo-2026.jpg", shortcut: "/dfm-logo-2026.jpg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ca"><body>{children}</body></html>;
}
