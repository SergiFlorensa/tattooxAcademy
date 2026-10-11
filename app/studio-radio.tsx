"use client";

import Image from "next/image";
import ActionIcon from "./action-icon";
import { useRef, useState } from "react";
import DfmSeal from "./dfm-seal";
import { tattooWorks, availableDesigns, artistPortrait } from "./portfolio-data";
import { useRadioAudio } from "./use-radio-audio";
import type { LogoAudioGraph } from "./use-audio-logo";

// Public station streams. LOS40 alone uses a same-origin relay for iOS
// compatibility; the other stations continue to stream directly.
const stations = [
  { slug: "los-40-urban", mark: "40", name: "LOS40 Urban", genre: "Reggaetón · Urbano", stream: "/api/radio/los40", url: "https://los40.com/los40_urban/" },
  { slug: "100-reggaeton-radio", mark: "%", name: "100% Reggaeton", genre: "Reggaetón · Éxitos", stream: "https://stream.zeno.fm/8wup8yd9dm0uv", url: "https://zeno.fm/radio/reggaeton-radio-cw10/" },
  { slug: "old-school-hip-hop-urbanradio-com", mark: "HH", name: "Old School Hip Hop", genre: "Hip-hop · Classics", stream: "https://hydra.cdnstream.com/1540_128", url: "https://urbanradio.com/" },
  { slug: "urban-radio-hip-hop-r-b", mark: "UR", name: "Urban Radio", genre: "Hip-hop · R&B", stream: "https://hydra.cdnstream.com/1536_128", url: "https://urbanradio.com/" },
] as const;

const copy = {
  ca: {
    intro: "La banda sonora del teu proper tatuatge.", open: "Obrir Studio Radio", close: "Plegar reproductor", hint: "Urbà, reggaeton i hip-hop. Tu poses el ritme.",
    title: "Ink. Beats.", accent: "Repeat.", detail: "Explora els treballs amb la teva banda sonora. Una mica d’estudi, allà on siguis.",
    station: "Tria l’emissora", play: "Reproduir", pause: "Pausar", mute: "Silenciar", unmute: "Activar so", volumeLabel: "Volum", off: "Radio desconnectada", playing: "En directe", paused: "En pausa", error: "No s’ha pogut connectar", loading: "Connectant…",
    promo: "Destacats DFM", promoSelect: "Veure destacat", work: "Veure la galeria",
    cards: ["Detalls que parlen.", "El teu projecte. La meva passió.", "La teva propera peça."], labels: ["REALISME / DFM", "DARRERE DE L’AGULLA", "DISSENYS DISPONIBLES"],
  },
  es: {
    intro: "La banda sonora de tu próximo tatuaje.", open: "Abrir Studio Radio", close: "Plegar reproductor", hint: "Urbano, reggaetón y hip-hop. Tú pones el ritmo.",
    title: "Ink. Beats.", accent: "Repeat.", detail: "Explora los trabajos con tu banda sonora. Un poco de estudio, estés donde estés.",
    station: "Elige la emisora", play: "Reproducir", pause: "Pausar", mute: "Silenciar", unmute: "Activar sonido", volumeLabel: "Volumen", off: "Radio desconectada", playing: "En directo", paused: "En pausa", error: "No se pudo conectar", loading: "Conectando…",
    promo: "Destacados DFM", promoSelect: "Ver destacado", work: "Ver la galería",
    cards: ["Detalles que hablan.", "Tu proyecto. Mi pasión.", "Tu próxima pieza."], labels: ["REALISMO / DFM", "DETRÁS DE LA AGUJA", "DISEÑOS DISPONIBLES"],
  },
};

const promos = [
  { image: tattooWorks[1], alt: { ca: "Mirada i paisatge, del portafoli DFM", es: "Mirada y paisaje, del portafolio DFM" }, link: "#treballs" },
  { image: artistPortrait, alt: { ca: "Retrat de DFM", es: "Retrato de DFM" }, link: "#artista" },
  { image: availableDesigns[0], alt: { ca: "Disseny de brúixola i motor del portafoli DFM", es: "Diseño de brújula y motor del portafolio DFM" }, link: "#disenos" },
] as const;

function RadioIcon({ type }: { type: "headphones" | "play" | "pause" | "volume" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{type === "headphones" ? <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="12" width="4" height="8" rx="2" /><rect x="17" y="12" width="4" height="8" rx="2" /></> : type === "play" ? <path d="m9 5 11 7-11 7z" fill="currentColor" stroke="none" /> : type === "pause" ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" stroke="none" /> : <><path d="M4 9h4l5-4v14l-5-4H4zM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14" /></>}</svg>;
}

type RadioControlsProps = { radio: ReturnType<typeof useRadioAudio>; t: typeof copy.ca | typeof copy.es; stream: string };

function RadioTransport({ radio, t, stream }: RadioControlsProps) {
  const active = radio.status === "playing" || radio.status === "loading";
  return <div className="radio-native-controls">
    <button className="radio-native-play" type="button" aria-label={active ? t.pause : t.play} onClick={() => active ? radio.pause() : radio.play(stream)}><RadioIcon type={active ? "pause" : "play"} /></button>
    <div className="radio-volume"><div><button type="button" onClick={radio.toggleMute} aria-label={radio.muted ? t.unmute : t.mute} aria-pressed={radio.muted}><RadioIcon type="volume" /></button><span>{radio.muted ? "MUTE" : `${Math.round(radio.volume * 100)}%`}</span></div><input type="range" min="0" max="1" step="0.01" value={radio.volume} aria-label={t.volumeLabel} onChange={event => radio.changeVolume(Number(event.target.value))} /></div>
  </div>;
}

function RadioConnection({ radio, t }: Omit<RadioControlsProps, "stream">) {
  return <div className="radio-connection-row"><span role="status" className={radio.status === "playing" ? "radio-connected" : ""}><i aria-hidden="true" />{t[radio.status]}</span></div>;
}

export default function StudioRadio({ language, onAudioGraph }: { language: "ca" | "es"; onAudioGraph: (graph: LogoAudioGraph | null) => void }) {
  const t = copy[language];
  const [open, setOpen] = useState(false);
  const [stationIndex, setStationIndex] = useState(1);
  const [promoIndex, setPromoIndex] = useState(0);
  const launcher = useRef<HTMLButtonElement>(null);
  const radio = useRadioAudio(onAudioGraph);
  const station = stations[stationIndex];
  const promo = promos[promoIndex];

  function changeStation(index: number) {
    if (index === stationIndex) return;
    const keepPlaying = radio.status === "playing" || radio.status === "loading";
    setStationIndex(index);
    if (keepPlaying) {
      // Release the previous stream before Play; the audio engine ignores a
      // second Play while it still has a live session.
      radio.stop();
      radio.play(stations[index].stream);
    } else if (radio.status === "error") {
      radio.stop();
    }
  }
  function close() { setOpen(false); launcher.current?.focus(); }

  return <aside className={`studio-radio page-width${open ? " studio-radio--open" : ""}`} aria-label="DFM Studio Radio">
    <div className="radio-shelf">
      <p><span className="radio-shelf-label">SOUND ON. <span>IF YOU WANT.</span></span>{t.intro}</p>
      <div className="radio-dock">
      <button ref={launcher} type="button" className="radio-launcher" aria-expanded={open} aria-controls="studio-radio-panel" onClick={() => open ? close() : setOpen(true)}>
        <span className="radio-launcher-icon"><RadioIcon type="headphones" /></span><span><strong>DFM Studio Radio</strong><small>{t.hint}</small></span><span className="radio-launcher-arrow" aria-hidden="true">{open ? "−" : "+"}</span><span className="sr-only">{open ? t.close : t.open}</span>
      </button>
      {!open && <div className="radio-mini-player" aria-label={`Radio · ${station.name}`}><strong>{station.name}</strong><RadioTransport radio={radio} t={t} stream={station.stream} /><RadioConnection radio={radio} t={t} /></div>}
      </div>
    </div>
    {open && <div id="studio-radio-panel" className="radio-panel" onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); close(); } }}>
      <div className="radio-editorial"><span className="eyebrow">DFM / STUDIO FREQUENCY</span><h2>{t.title}<br /><span>{t.accent}</span></h2><p>{t.detail}</p><a href="#treballs" className="text-link">{t.work}<span aria-hidden="true"><ActionIcon /></span></a><DfmSeal className="radio-editorial-seal" decorative /></div>
      <div className="radio-phone">
        <div className="radio-phone-island" aria-hidden="true"><span /></div>
        <div className="radio-phone-top"><span>DFM</span><span>STUDIO RADIO</span><button type="button" onClick={close} aria-label={t.close}>−</button></div>
        <div className="radio-promo" aria-label={t.promo}>
          <Image className="radio-promo-image" src={promo.image.src} width={promo.image.width} height={promo.image.height} alt={promo.alt[language]} sizes="170px" unoptimized loading="lazy" />
          <a className="radio-promo-copy" href={promo.link}><small>{t.labels[promoIndex]}</small><strong>{t.cards[promoIndex]}</strong><span aria-hidden="true"><ActionIcon /></span></a>
        </div>
        <div className="radio-promo-dots" aria-label={t.promo}>{promos.map((_, index) => <button key={index} type="button" aria-label={`${t.promoSelect} ${index + 1}: ${t.cards[index]}`} aria-pressed={index === promoIndex} onClick={() => setPromoIndex(index)} />)}</div>
        <div className="radio-station-label" id="radio-stations-label">{t.station}</div>
        <div className="radio-station-grid" role="group" aria-labelledby="radio-stations-label">
          {stations.map((item, index) => <button key={item.slug} className={`radio-station-option radio-station-option--${item.slug}`} type="button" aria-label={`${item.name} · ${item.genre}`} aria-pressed={index === stationIndex} onClick={() => changeStation(index)}>
            <span className="radio-station-mark" aria-hidden="true"><span>{item.mark}</span><i /></span>
            <span className="radio-station-copy"><strong>{item.name}</strong><small>{item.genre}</small></span>
            {index === stationIndex && <span className="radio-station-selected" aria-hidden="true">●</span>}
          </button>)}
        </div>
        <div className="radio-player-slot">
          <div className={`radio-native-player radio-native-player--${radio.status}`}><div className="radio-native-station"><strong>{station.name}</strong><span>{station.genre}</span></div><RadioTransport radio={radio} t={t} stream={station.stream} /></div>
        </div>
        <RadioConnection radio={radio} t={t} />
        <div className="radio-phone-home" aria-hidden="true" />
      </div>
    </div>}
  </aside>;
}
