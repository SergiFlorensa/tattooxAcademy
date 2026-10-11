"use client";

import { useEffect, useRef, useState } from "react";

/** Only load the decorative film while its section is near the viewport. */
export default function ProcessBackgroundVideo({ enabled }: { enabled: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setNearViewport(entry.isIntersecting), { rootMargin: "120px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className="process-film" ref={container} aria-hidden="true">
    {enabled && nearViewport && !reducedMotion && <video src="/dfm-process-background.mp4" autoPlay muted loop playsInline preload="none" />}
  </div>;
}
