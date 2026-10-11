"use client";

import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import ActionIcon from "./action-icon";

type Piece = { id: string; title: string; category: string; width: number; height: number; image: ReactNode };
type Props = { pieces: Piece[]; language: "ca" | "es"; kind?: "work" | "design"; onOpen: (id: string) => void };

/** Continuous rotation keeps the last-to-first transition moving around the ring. */
export default function StudioGallery({ pieces, language, kind = "work", onOpen }: Props) {
  const [position, setPosition] = useState(0);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const blockClickUntil = useRef(0);
  const count = pieces.length;
  const index = count ? ((position % count) + count) % count : 0;
  const current = pieces[index];
  const ca = language === "ca";
  const move = (direction: number) => setPosition(value => value + direction);
  const select = (target: number) => {
    let distance = target - index;
    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;
    move(distance);
  };
  if (!current) return null;
  const step = 360 / count;
  const radius = count > 1 ? Math.max(0.8, 1 / (2 * Math.tan(Math.PI / count))) : 0;

  return <div className="studio-gallery studio-gallery--orbit" data-kind={kind} style={{ "--orbit-radius": `calc(var(--orbit-card-width) * ${radius})` } as CSSProperties} role="region" aria-roledescription="carrusel" aria-label={kind === "design" ? (ca ? "Dissenys disponibles" : "Diseños disponibles") : (ca ? "Portafoli de DFM" : "Portafolio de DFM")} onKeyDown={event => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "Home") { event.preventDefault(); select(0); }
    if (event.key === "End") { event.preventDefault(); select(count - 1); }
  }}>
    <div className="orbit-stage" tabIndex={0} aria-label={ca ? "Llisca o utilitza les tecles esquerra i dreta per girar la galeria" : "Desliza o usa las teclas izquierda y derecha para girar la galería"}
      onPointerDown={event => { if (event.button === 0) gesture.current = { x: event.clientX, y: event.clientY }; }}
      onPointerLeave={() => { gesture.current = null; }}
      onPointerCancel={() => { gesture.current = null; }}
      onPointerUp={event => {
        const start = gesture.current; gesture.current = null;
        if (!start) return;
        const dx = event.clientX - start.x; const dy = event.clientY - start.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2 && count > 1) { blockClickUntil.current = performance.now() + 400; move(dx < 0 ? 1 : -1); }
      }}
      onClickCapture={event => { if (performance.now() < blockClickUntil.current) { event.preventDefault(); event.stopPropagation(); } blockClickUntil.current = 0; }}>
      <span className="orbit-signature" aria-hidden="true">DFM / {kind === "design" ? (ca ? "DISSENYS" : "DISEÑOS") : "PORTFOLIO"}</span>
      <div className="orbit-floor" aria-hidden="true" />
      <div className="orbit-ring" style={{ transform: `translateZ(calc(-1 * var(--orbit-radius))) rotateY(${-position * step}deg)` }}>
        {pieces.map((piece, slot) => {
          let distance = ((slot - index) % count + count) % count;
          if (distance > count / 2) distance -= count;
          const active = slot === index;
          const visible = Math.abs(distance) <= 1;
          return <button key={piece.id} className={`orbit-card${active ? " orbit-card--active" : ""}`} type="button" tabIndex={active ? 0 : -1} aria-hidden={!visible || undefined} aria-label={`${active ? "Ampliar" : ca ? "Veure" : "Ver"}: ${piece.title}`} onClick={() => active ? onOpen(piece.id) : select(slot)} style={{ "--orbit-aspect": piece.width / piece.height, transform: `translate(-50%, -50%) rotateY(${slot * step}deg) translateZ(var(--orbit-radius)) rotateY(${-distance * step * 0.42}deg)`, opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" } as CSSProperties}>
            {piece.image}
          </button>;
        })}
      </div>
    </div>
    <div className="orbit-console">
      <div className="orbit-story" aria-live="polite" aria-atomic="true"><p>{current.category}</p><h3>{current.title}</h3></div>
      <div className="orbit-navigation">
        <button type="button" disabled={count < 2} onClick={() => move(-1)} aria-label={ca ? "Peça anterior" : "Pieza anterior"}><ActionIcon direction="left" /></button>
        <span className="orbit-position" aria-label={`${index + 1} de ${count}`}><strong>{String(index + 1).padStart(2, "0")}</strong><span> / {String(count).padStart(2, "0")}</span></span>
        <button type="button" disabled={count < 2} onClick={() => move(1)} aria-label={ca ? "Peça següent" : "Pieza siguiente"}><ActionIcon direction="right" /></button>
      </div>
    </div>
    <div className="orbit-index" role="group" aria-label={ca ? "Selecciona una peça" : "Selecciona una pieza"}>
      {pieces.map((piece, slot) => <button key={piece.id} type="button" aria-pressed={slot === index} aria-label={`${ca ? "Veure" : "Ver"}: ${piece.title}`} onClick={() => select(slot)}><span aria-hidden="true">{String(slot + 1).padStart(2, "0")}</span></button>)}
    </div>
  </div>;
}
