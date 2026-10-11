import { useId } from "react";

/** The official artwork, unchanged. Clip only the outer rectangular backdrop. */
export default function DfmSeal({ className = "", decorative = false }: { className?: string; decorative?: boolean }) {
  const id = `dfm-seal-${useId().replace(/:/g, "")}`;
  return <svg className={className} viewBox="0 0 819 844" role={decorative ? undefined : "img"} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : "Logo oficial DFM Tattoo Artist, EST. 2026"}>
    <defs><clipPath id={id}><circle cx="424" cy="420" r="378" /><rect x="256" y="674" width="340" height="129" rx="32" /></clipPath></defs>
    <image href="/dfm-logo-2026.jpg" width="819" height="844" clipPath={`url(#${id})`} />
  </svg>;
}
