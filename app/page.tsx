"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { studioContact } from "./studio-contact";
import StudioRadio from "./studio-radio";
import StudioGallery from "./studio-gallery";
import DfmMark from "./dfm-mark";
import DfmSeal from "./dfm-seal";
import { tattooWorks, availableDesigns, artistPortrait, processDesign, processResult } from "./portfolio-data";
import StudioBackdrop from "./studio-backdrop";
import ProcessBackgroundVideo from "./process-background-video";
import ActionIcon from "./action-icon";
import TattooPenExperience from "./tattoo-pen-experience";
import { useAudioLogo } from "./use-audio-logo";
import type { LogoAudioGraph } from "./use-audio-logo";

type Language = "ca" | "es";
const words = {
  ca: {
    nav: ["Estils", "Galeria", "Dissenys", "L’artista"], reserve: "Demana cita", menu: "Obrir menú", close: "Tancar", language: "Idioma",
    location: "Albatàrrec, Lleida", intro: "El teu projecte.", passion: "La meva passió.", headline: "Amb ànima.", heroFootnote: "Idees reals. Tatuatges reals.", artistPhotoLabel: "DFM / EN EL DETALL",
    heroText: "Realisme, microrealisme i fine line. Precisió, textura i contrast per portar la teva història a la pell.",
    seeWork: "Veure la galeria", scroll: "Descobreix DFM", since: "Tattoo artist · Est. 2026",
    strip: ["Treballs personalitzats", "Màxima higiene i seguretat", "Estil adaptat a tu"],
    stylesLabel: "01 / Troba el teu llenguatge", stylesTitle: "Tres estils.", stylesAccent: "La teva essència.",
    stylesText: "Cada idea demana una manera de traçar-la. Explora els estils i troba el que connecta amb tu.",
    styles: [
      { name: "Realisme", note: "L’art de mirar més enllà.", text: "Llums, ombres i textures que donen profunditat a la pell. Retrats, animals i detalls que parlen per si mateixos.", tags: ["Profunditat", "Textures", "Llum i ombra"] },
      { name: "Fine line", note: "La força d’una línia.", text: "Traços fins, composicions netes i una atenció especial a cada corba. Una manera delicada de portar una idea amb tu.", tags: ["Precisió", "Traç fi", "Equilibri"] },
      { name: "Microrealisme", note: "Petit format. Molta història.", text: "L’univers del realisme en una peça de petit format. El disseny s’adapta a la zona i a la mida perquè cada detall tingui sentit.", tags: ["Petit format", "Detall", "Composició"] },
    ],
    styleCta: "Vull aquest estil", portfolioLabel: "02 / Portafoli DFM", portfolioTitle: "Detalls que parlen", portfolioAccent: "per si mateixos.",
    portfolioText: "Una selecció del portafoli de l’artista. Retrats, profunditat i traços fins: cada peça té el seu propi llenguatge.", portfolioNote: "Obra del portafoli de DFM · Toca una peça per veure-la completa",
    filters: ["Tots", "Realisme", "Fine line"], expand: "Ampliar", previous: "Peça anterior", next: "Peça següent", of: "de",
    designsLabel: "03 / Dissenys disponibles", designsTitle: "La propera història", designsAccent: "pot ser la teva.", designsText: "Vuit composicions del portafoli, encara en paper. Tria la que connecta amb tu i consulta amb DFM la disponibilitat, la mida i l’adaptació a la teva pell.", designCategory: "Disseny disponible", designCta: "Consultar aquest disseny", designNote: "M’interessa aquest disseny del portafoli. Podem confirmar-ne la disponibilitat i l’adaptació?",
    artistLabel: "04 / Darrere de l’agulla", artistTitle: "Una idea teva.", artistAccent: "Una passió meva.",
    artistText: "Apassionat per la precisió i la fidelitat del detall. El meu treball se centra principalment en el realisme i el microrealisme, buscant textura, profunditat i contrast en cada peça.",
    artistText2: "El fine line aporta finor i netedat de traç als projectes. Cada composició s’estudia amb la mida real i l’anatomia del cos en ment, perquè la teva idea i la teva pell parlin el mateix llenguatge.",
    quote: "Realisme és veure el que els altres no veuen.", artistCta: "Parlem del teu projecte",
    values: [{ title: "Consulta tècnica", text: "Assessorament previ sobre la mida real i la viabilitat del detall." }, { title: "Disseny anatòmic", text: "Fotomuntatges a mida que encaixen amb les corbes naturals del cos." }, { title: "Higiene i seguretat", text: "Protocols sanitaris durant tot el procés." }, { title: "Acompanyament", text: "Seguiment de la curació per cuidar la conservació del detall." }],
    processLabel: "05 / De la idea a la pell", processTitle: "Així pren forma", processAccent: "el teu tatuatge.",
    steps: [{ title: "Consulta i idea", text: "Definim el concepte, recopilem referències fotogràfiques de qualitat i valorem la viabilitat del detall." }, { title: "Composició digital", text: "Disseny i fotomuntatge previ a Procreate per encaixar la peça amb l’anatomia de la zona." }, { title: "Execució tècnica", text: "Valor tonal, contrast del sombrejat, micropuntil·lisme i solidesa de la línia." }, { title: "Seguiment i curació", text: "Pautes específiques de cura posterior i revisió de la conservació del detall." }],
    processExample: "Un projecte, dos moments.", processExampleText: "Del disseny digital al tatuatge: un exemple real del procés de DFM.", digitalLabel: "01 / Composició digital", resultLabel: "02 / A la pell",
    faqTitle: "Abans de començar.",
    faqs: [{ q: "Puc portar les meves referències?", a: "Sí. Fotografies, dibuixos o idees ajuden a entendre què t’agradaria portar a la pell. Comparteix-les amb l’artista per parlar del disseny." }, { q: "Com es decideixen la mida i la zona?", a: "Depenen de la composició i del detall que necessiti la peça. Explica la zona i la mida que tens al cap per valorar-les amb DFM." }, { q: "Com puc saber el preu i la disponibilitat?", a: "Prepara una consulta amb la idea, l’estil, la zona i la mida aproximada. L’artista podrà confirmar el pressupost i les dates directament amb tu." }],
    contactLabel: "06 / El següent traç és teu", contactTitle: "Tens una idea?", contactAccent: "Fem-la realitat.",
    contactText: "Prepara la teva consulta i comparteix-la amb DFM pel teu canal habitual. El primer pas és explicar què tens al cap.",
    name: "Com et dius?", namePlaceholder: "El teu nom", style: "Quin estil t’agrada?", zone: "Zona del cos", zonePlaceholder: "Avantbraç, esquena…", size: "Mida aproximada", sizePlaceholder: "Per exemple, 10 cm", idea: "Explica la teva idea", ideaPlaceholder: "El motiu, la història, les referències…", prepare: "Preparar consulta", formNote: "La cita i el pressupost es confirmen directament amb l’artista.",
    draftTitle: "La teva idea, a punt per compartir.", draftNote: "Copia el missatge i envia’l a DFM per consultar la disponibilitat.", copy: "Copiar consulta", copied: "Consulta copiada", copyError: "Selecciona i copia el text de la consulta.", draftHello: "Hola DFM! Soc", draftStyle: "Estil", draftZone: "Zona", draftSize: "Mida aproximada", draftIdea: "La meva idea", draftReference: "Peça que m’inspira", inspirationNote: "Només com a referència: vull un disseny personalitzat.", referenceCta: "Fer servir d’inspiració", draftEnd: "Podem parlar del disseny, el pressupost i la disponibilitat?", optional: "Per definir", whatsapp: "Consultar per WhatsApp", instagram: "Veure Instagram", map: "Albatàrrec al mapa", footer: "El teu projecte, la meva passió.", pause: "Pausar animacions", resume: "Activar animacions", top: "Tornar a l’inici",
  },
  es: {
    nav: ["Estilos", "Galería", "Diseños", "El artista"], reserve: "Pide cita", menu: "Abrir menú", close: "Cerrar", language: "Idioma",
    location: "Albatàrrec, Lleida", intro: "Tu proyecto.", passion: "Mi pasión.", headline: "Con alma.", heroFootnote: "Ideas reales. Tatuajes reales.", artistPhotoLabel: "DFM / EN EL DETALLE",
    heroText: "Realismo, microrealismo y fine line. Precisión, textura y contraste para llevar tu historia a la piel.",
    seeWork: "Ver la galería", scroll: "Descubre DFM", since: "Tattoo artist · Est. 2026",
    strip: ["Trabajos personalizados", "Máxima higiene y seguridad", "Estilo adaptado a ti"],
    stylesLabel: "01 / Encuentra tu lenguaje", stylesTitle: "Tres estilos.", stylesAccent: "Tu esencia.",
    stylesText: "Cada idea pide una manera de trazarla. Explora los estilos y encuentra el que conecta contigo.",
    styles: [
      { name: "Realismo", note: "El arte de mirar más allá.", text: "Luces, sombras y texturas que dan profundidad a la piel. Retratos, animales y detalles que hablan por sí mismos.", tags: ["Profundidad", "Texturas", "Luz y sombra"] },
      { name: "Fine line", note: "La fuerza de una línea.", text: "Trazos finos, composiciones limpias y atención especial a cada curva. Una manera delicada de llevar una idea contigo.", tags: ["Precisión", "Trazo fino", "Equilibrio"] },
      { name: "Microrealismo", note: "Pequeño formato. Mucha historia.", text: "El universo del realismo en una pieza de pequeño formato. El diseño se adapta a la zona y al tamaño para que cada detalle tenga sentido.", tags: ["Pequeño formato", "Detalle", "Composición"] },
    ],
    styleCta: "Quiero este estilo", portfolioLabel: "02 / Portafolio DFM", portfolioTitle: "Detalles que hablan", portfolioAccent: "por sí mismos.",
    portfolioText: "Una selección del portafolio del artista. Retratos, profundidad y trazos finos: cada pieza tiene su propio lenguaje.", portfolioNote: "Obra del portafolio de DFM · Toca una pieza para verla completa",
    filters: ["Todos", "Realismo", "Fine line"], expand: "Ampliar", previous: "Pieza anterior", next: "Pieza siguiente", of: "de",
    designsLabel: "03 / Diseños disponibles", designsTitle: "La próxima historia", designsAccent: "puede ser la tuya.", designsText: "Ocho composiciones del portafolio, todavía en papel. Elige la que conecta contigo y consulta con DFM la disponibilidad, el tamaño y la adaptación a tu piel.", designCategory: "Diseño disponible", designCta: "Consultar este diseño", designNote: "Me interesa este diseño del portafolio. ¿Podemos confirmar su disponibilidad y adaptación?",
    artistLabel: "04 / Detrás de la aguja", artistTitle: "Una idea tuya.", artistAccent: "Una pasión mía.",
    artistText: "Apasionado por la precisión y la fidelidad del detalle. Mi trabajo se centra principalmente en el realismo y el microrealismo, buscando textura, profundidad y contraste en cada pieza.",
    artistText2: "El fine line aporta finura y limpieza de trazo a los proyectos. Cada composición se estudia con el tamaño real y la anatomía del cuerpo en mente, para que tu idea y tu piel hablen el mismo lenguaje.",
    quote: "Realismo es ver lo que los demás no ven.", artistCta: "Hablemos de tu proyecto",
    values: [{ title: "Consulta técnica", text: "Asesoramiento previo sobre el tamaño real y la viabilidad del detalle." }, { title: "Diseño anatómico", text: "Fotomontajes a medida que encajan con las curvas naturales del cuerpo." }, { title: "Higiene y seguridad", text: "Protocolos sanitarios durante todo el proceso." }, { title: "Acompañamiento", text: "Seguimiento de la curación para cuidar la conservación del detalle." }],
    processLabel: "05 / De la idea a la piel", processTitle: "Así toma forma", processAccent: "tu tatuaje.",
    steps: [{ title: "Consulta e idea", text: "Definimos el concepto, reunimos referencias fotográficas de calidad y valoramos la viabilidad del detalle." }, { title: "Composición digital", text: "Diseño y fotomontaje previo en Procreate para encajar la pieza con la anatomía de la zona." }, { title: "Ejecución técnica", text: "Valor tonal, contraste del sombreado, micropuntillismo y solidez de la línea." }, { title: "Seguimiento y curado", text: "Pautas específicas de cuidado posterior y revisión de la conservación del detalle." }],
    processExample: "Un proyecto, dos momentos.", processExampleText: "Del diseño digital al tatuaje: un ejemplo real del proceso de DFM.", digitalLabel: "01 / Composición digital", resultLabel: "02 / En la piel",
    faqTitle: "Antes de empezar.",
    faqs: [{ q: "¿Puedo llevar mis referencias?", a: "Sí. Fotografías, dibujos o ideas ayudan a entender qué te gustaría llevar en la piel. Compártelas con el artista para hablar del diseño." }, { q: "¿Cómo se deciden el tamaño y la zona?", a: "Dependen de la composición y del detalle que necesite la pieza. Cuenta la zona y el tamaño que tienes en mente para valorarlos con DFM." }, { q: "¿Cómo puedo saber el precio y la disponibilidad?", a: "Prepara una consulta con la idea, el estilo, la zona y el tamaño aproximado. El artista podrá confirmar el presupuesto y las fechas directamente contigo." }],
    contactLabel: "06 / El siguiente trazo es tuyo", contactTitle: "¿Tienes una idea?", contactAccent: "Hagámosla realidad.",
    contactText: "Prepara tu consulta y compártela con DFM por tu canal habitual. El primer paso es contar qué tienes en mente.",
    name: "¿Cómo te llamas?", namePlaceholder: "Tu nombre", style: "¿Qué estilo te gusta?", zone: "Zona del cuerpo", zonePlaceholder: "Antebrazo, espalda…", size: "Tamaño aproximado", sizePlaceholder: "Por ejemplo, 10 cm", idea: "Cuéntame tu idea", ideaPlaceholder: "El motivo, la historia, las referencias…", prepare: "Preparar consulta", formNote: "La cita y el presupuesto se confirman directamente con el artista.",
    draftTitle: "Tu idea, lista para compartir.", draftNote: "Copia el mensaje y envíalo a DFM para consultar la disponibilidad.", copy: "Copiar consulta", copied: "Consulta copiada", copyError: "Selecciona y copia el texto de la consulta.", draftHello: "¡Hola DFM! Soy", draftStyle: "Estilo", draftZone: "Zona", draftSize: "Tamaño aproximado", draftIdea: "Mi idea", draftReference: "Pieza que me inspira", inspirationNote: "Solo como referencia: quiero un diseño personalizado.", referenceCta: "Tomar como inspiración", draftEnd: "¿Podemos hablar del diseño, el presupuesto y la disponibilidad?", optional: "Por definir", whatsapp: "Consultar por WhatsApp", instagram: "Ver Instagram", map: "Albatàrrec en el mapa", footer: "Tu proyecto, mi pasión.", pause: "Pausar animaciones", resume: "Activar animaciones", top: "Volver al inicio",
  },
};

const artworks = [...tattooWorks, ...availableDesigns];

function ArtworkPhoto({ artwork, alt, sizes }: { artwork: typeof artworks[number]; alt: string; sizes: string }) {
  return <Image className="artwork-image" style={{ "--source-width": `${artwork.width}px`, "--source-height": `${artwork.height}px` } as CSSProperties} src={artwork.src} width={artwork.width} height={artwork.height} alt={alt} sizes={sizes} unoptimized loading="lazy" />;
}
function Mark({ className = "" }: { className?: string }) {
  return <DfmMark className={className} />;
}
function Icon({ type }: { type: "diamond" | "shield" | "star" | "pin" | "calendar" }) {
  const paths = {
    diamond: "M3 8 7 3h10l4 5-9 13L3 8Zm0 0h18M7 3l5 18 5-18M7 3l5 5 5-5",
    shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Zm-5 10 3 3 7-7",
    star: "m12 2 3 7 8 .7-6 5 2 8-7-4.5-7 4.5 2-8-6-5L9 9l3-7Z",
    pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    calendar: "M4 5h16v16H4V5ZM8 2v6M16 2v6M4 10h16M8 14h1M12 14h1M16 14h1M8 18h1M12 18h1",
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]} /></svg>;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ca");
  const [menuOpen, setMenuOpen] = useState(false);
  const [styleIndex, setStyleIndex] = useState(0);
  const [filter, setFilter] = useState(0);
  const [selectedWork, setSelectedWork] = useState(0);
  const [referenceWork, setReferenceWork] = useState<number | null>(null);
  const [motion, setMotion] = useState(true);
  const [audioGraph, setAudioGraph] = useState<LogoAudioGraph | null>(null);
  const [brief, setBrief] = useState<{ name: string; zone: string; size: string; idea: string; style: number } | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const shellRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  useAudioLogo(brandRef, audioGraph, motion);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = words[language];
  const currentStyle = t.styles[styleIndex];
  const visibleWorks = tattooWorks.filter((work) => filter === 0 || work.group === filter);
  const currentWork = artworks[selectedWork];
  const dialogWorks = currentWork.kind === "design" ? availableDesigns : visibleWorks;
  const message = brief ? `${t.draftHello} ${brief.name}.\n\n${t.draftStyle}: ${t.styles[brief.style].name}\n${t.draftZone}: ${brief.zone || t.optional}\n${t.draftSize}: ${brief.size || t.optional}${referenceWork === null ? "" : `\n\n${artworks[referenceWork].kind === "design" ? t.designCategory : t.draftReference}: ${artworks[referenceWork][language]}\n${artworks[referenceWork].kind === "design" ? t.designNote : t.inspirationNote}`}\n\n${t.draftIdea}:\n${brief.idea}\n\n${t.draftEnd}` : "";
  const whatsappUrl = studioContact.whatsapp ? `https://wa.me/${studioContact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}` : null;
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    shell.querySelectorAll(".reveal").forEach((element) => observer.observe(element)); shell.classList.add("reveal-ready");
    return () => { observer.disconnect(); shell.classList.remove("reveal-ready"); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  function openWork(index: number) { setSelectedWork(index); dialogRef.current?.showModal(); }
  function navigateWork(direction: number) { const indices = dialogWorks.map((work) => artworks.indexOf(work)); setSelectedWork(indices[(indices.indexOf(selectedWork) + direction + indices.length) % indices.length]); }
  function prepareBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    setBrief({ name: String(data.get("name") || "").trim(), zone: String(data.get("zone") || "").trim(), size: String(data.get("size") || "").trim(), idea: String(data.get("idea") || "").trim(), style: styleIndex }); setCopyState("idle");
  }
  async function copyBrief() { try { await navigator.clipboard.writeText(message); setCopyState("copied"); } catch { setCopyState("error"); } }

  return (
    <div ref={shellRef} className="studio-shell" data-motion={motion ? "on" : "off"}>
      <a className="skip-link" href="#main-content">{language === "ca" ? "Anar al contingut" : "Ir al contenido"}</a>
      <header className="studio-header"><div className="header-inner page-width">
        <a ref={brandRef} href="#inicio" className="brand" onClick={() => setMenuOpen(false)} aria-label="DFM Tattoo Artist"><Mark /><span>ALBATÀRREC<br />LLEIDA</span></a>
        <nav className={`studio-nav ${menuOpen ? "is-open" : ""}`} id="main-navigation" aria-label={language === "ca" ? "Navegació principal" : "Navegación principal"}>{["#estils", "#treballs", "#disenos", "#artista"].map((href, index) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{t.nav[index]}</a>)}</nav>
        <div className="header-actions"><div className="language-switch" role="group" aria-label={t.language}>{(["ca", "es"] as const).map((lang) => <button type="button" key={lang} onClick={() => { setLanguage(lang); setCopyState("idle"); }} aria-pressed={language === lang}>{lang.toUpperCase()}</button>)}</div><a className="header-book" href="#contacto" onClick={() => setMenuOpen(false)}>{t.reserve}<ActionIcon /></a><button className="menu-toggle" type="button" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button></div>
      </div></header>
      <main id="main-content">
        <section className="hero" id="inicio" aria-labelledby="hero-title"><StudioBackdrop /><div className="hero-inner page-width">
          <div className="hero-copy"><p className="eyebrow"><span className="status-dot" />DFM TATTOO ARTIST<span className="eyebrow-divider">/</span><span className="hero-eyebrow-location">{t.location}</span></p><h1 id="hero-title">TATTOOS.<br /><span>{t.headline}</span></h1><p className="hero-handwriting">{t.intro} <em>{t.passion}</em></p><p className="hero-description">{t.heroText}</p><div className="hero-buttons"><a className="button button--green paint-button" href="#contacto"><Icon type="calendar" />{t.reserve}<ActionIcon /></a><a className="text-link" href="#treballs">{t.seeWork}<span><ActionIcon /></span></a></div><div className="hero-styles"><span>{t.styles[0].name}</span><i /><span>Fine line</span><i /><span>{t.styles[2].name}</span></div></div>
          <div className="hero-portrait">
            <Image className="hero-portrait-atmosphere" src="/hero/dfm-studio-restored.webp" alt="" aria-hidden="true" width={1672} height={941} unoptimized />
            <Image className="hero-portrait-photo" src="/hero/dfm-studio-restored.webp" alt={language === "ca" ? "Retrat de DFM al seu estudi, amb la màquina de tatuar i els braços tatuats" : "Retrato de DFM en su estudio, con la máquina de tatuar y los brazos tatuados"} width={1672} height={941} sizes="(max-width: 780px) 180vw, 1200px" unoptimized priority />
            <div className="portrait-number" aria-hidden="true">DFM<br /><span>TATTOO ARTIST</span></div><span className="portrait-note">{t.since}</span><div className="hero-samples" aria-hidden="true">{tattooWorks.slice(0, 3).map(work => <ArtworkPhoto key={work.id} artwork={work} alt="" sizes="(max-width: 780px) 28vw, 16vw" />)}</div>
          </div>
        </div><StudioRadio language={language} onAudioGraph={setAudioGraph} /><div className="hero-bottom page-width"><a href="#estils">{t.scroll}<span><ActionIcon direction="down" /></span></a><span>{t.heroFootnote}</span><span className="hero-bottom-location"><Icon type="pin" />{t.location}</span></div></section>
        <div className="values-strip"><div className="values-strip-track">{[0, 1].map((repeat) => <div key={repeat} aria-hidden={repeat === 1}>{t.strip.map((item, index) => <span key={item}><Icon type={(["diamond", "shield", "star"] as const)[index]} />{item}<b>✦</b></span>)}</div>)}</div></div>
        <section className="styles-section section-space page-width reveal" id="estils" aria-labelledby="styles-heading">
          <div className="section-intro"><div><p className="eyebrow">{t.stylesLabel}</p><h2 id="styles-heading">{t.stylesTitle}<br /><span>{t.stylesAccent}</span></h2></div><p>{t.stylesText}</p></div>
          <div className="style-selector" role="group" aria-label={t.style}>{t.styles.map((style, index) => <button type="button" key={index} className={styleIndex === index ? "is-selected" : ""} aria-pressed={styleIndex === index} aria-controls="style-description" onClick={() => setStyleIndex(index)}><span className="style-number">0{index + 1}</span><span>{style.name}</span><span className="style-arrow" aria-hidden="true"><ActionIcon /></span></button>)}</div>
          <div className="style-description" id="style-description" aria-live="polite"><div><p className="handwriting">{currentStyle.note}</p><p>{currentStyle.text}</p></div><div className="style-bottom"><div className="style-tags">{currentStyle.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href="#contacto" className="text-link">{t.styleCta}<span><ActionIcon /></span></a></div></div>
        </section>
        <TattooPenExperience language={language} motion={motion} />
        <section className="portfolio-section section-space" id="treballs" aria-labelledby="portfolio-heading"><div className="page-width">
          <div className="section-intro reveal"><div><p className="eyebrow">{t.portfolioLabel}</p><h2 id="portfolio-heading">{t.portfolioTitle}<br /><span>{t.portfolioAccent}</span></h2></div><p>{t.portfolioText}</p></div>
          <p className="portfolio-source-note">{t.portfolioNote}</p>
          <div className="portfolio-toolbar"><div className="gallery-filters" role="group" aria-label={language === "ca" ? "Filtrar el portafoli per estil" : "Filtrar el portafolio por estilo"}>{t.filters.map((label, index) => <button type="button" key={index} aria-pressed={filter === index} onClick={() => setFilter(index)}>{label}</button>)}</div><span className="gallery-count" aria-live="polite">{String(visibleWorks.length).padStart(2, "0")} / {String(tattooWorks.length).padStart(2, "0")}</span></div>
          <StudioGallery key={filter} language={language} pieces={visibleWorks.map(work => ({ id: work.id, title: work[language], category: t.filters[work.group], width: work.width, height: work.height, image: <ArtworkPhoto artwork={work} alt={work[language]} sizes="(max-width: 1100px) 90vw, 100vw" /> }))} onOpen={id => openWork(artworks.findIndex(work => work.id === id))} />
          <a className="portfolio-cta text-link" href="#contacto">{t.intro} {t.passion}<span><ActionIcon /></span></a>
        </div></section>
        <section className="portfolio-section designs-section section-space" id="disenos" aria-labelledby="designs-heading"><div className="page-width">
          <div className="section-intro reveal"><div><p className="eyebrow">{t.designsLabel}</p><h2 id="designs-heading">{t.designsTitle}<br /><span>{t.designsAccent}</span></h2></div><p>{t.designsText}</p></div>
          <p className="portfolio-source-note">{language === "ca" ? "Dissenys de DFM · Consulta disponibilitat i adaptació" : "Diseños de DFM · Consulta disponibilidad y adaptación"}</p>
          <StudioGallery kind="design" language={language} pieces={availableDesigns.map(work => ({ id: work.id, title: work[language], category: t.designCategory, width: work.width, height: work.height, image: <ArtworkPhoto artwork={work} alt={work[language]} sizes="(max-width: 780px) 70vw, 60vw" /> }))} onOpen={id => openWork(artworks.findIndex(work => work.id === id))} />
        </div></section>
        <section className="artist-section section-space page-width reveal" id="artista" aria-labelledby="artist-heading">
          <div className="artist-photo"><Image className="artist-photo-image" {...artistPortrait} alt={language === "ca" ? "DFM, fotografia original del portafoli de l’artista" : "DFM, fotografía original del portafolio del artista"} sizes="(max-width: 780px) 90vw, 48vw" unoptimized loading="lazy" /><span className="artist-photo-label">DFM / TATTOO ARTIST</span><DfmSeal className="artist-seal" /></div>
          <div className="artist-copy"><p className="eyebrow">{t.artistLabel}</p><h2 id="artist-heading">{t.artistTitle}<br /><span>{t.artistAccent}</span></h2><p>{t.artistText}</p><p>{t.artistText2}</p><blockquote className="handwriting">“{t.quote}”</blockquote><a href="#contacto" className="text-link">{t.artistCta}<span><ActionIcon /></span></a></div>
        </section>
        <section className="care-section page-width reveal" aria-label={language === "ca" ? "El compromís de DFM" : "El compromiso de DFM"}>{t.values.map((value, index) => <article key={index}><Icon type={(["diamond", "star", "shield", "calendar"] as const)[index]} /><h3>{value.title}</h3><p>{value.text}</p></article>)}</section>
        <section className="process-section section-space page-width reveal" id="proceso" aria-labelledby="process-heading"><div className="process-hero"><ProcessBackgroundVideo enabled={motion} /><div className="process-hero-copy"><p className="eyebrow">{t.processLabel}</p><h2 id="process-heading">{t.processTitle} <span>{t.processAccent}</span></h2></div><span className="process-film-note">{language === "ca" ? "Imatges d’ambient" : "Imágenes de ambiente"}</span></div><div className="process-grid">{t.steps.map((step, index) => <article key={index}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
          <div className="process-case-study"><div className="process-case-copy"><p className="eyebrow">DFM / LOVE MY BOY</p><h3>{t.processExample}</h3><p>{t.processExampleText}</p></div><div className="process-case-images"><figure><div className="process-case-frame process-case-frame--design"><Image {...processDesign} alt={language === "ca" ? "Disseny digital del retrat infantil al fotomuntatge de Procreate" : "Diseño digital del retrato infantil en el fotomontaje de Procreate"} unoptimized loading="lazy" sizes="(max-width: 780px) 40vw, 240px" /></div><figcaption>{t.digitalLabel}</figcaption></figure><span className="process-case-arrow" aria-hidden="true"><ActionIcon direction="right" /></span><figure><div className="process-case-frame"><Image {...processResult} alt={language === "ca" ? "Resultat del retrat infantil tatuat a l’avantbraç" : "Resultado del retrato infantil tatuado en el antebrazo"} unoptimized loading="lazy" sizes="(max-width: 780px) 40vw, 300px" /></div><figcaption>{t.resultLabel}</figcaption></figure></div></div>
          <div className="faq"><h3 className="handwriting">{t.faqTitle}</h3><div>{t.faqs.map((faq, index) => <details key={index}><summary>{faq.q}<span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div></div></section>
        <section className="contact-section section-space" id="contacto" aria-labelledby="contact-heading"><div className="page-width contact-grid">
          <div className="contact-copy"><p className="eyebrow">{t.contactLabel}</p><h2 id="contact-heading">{t.contactTitle}<br /><span>{t.contactAccent}</span></h2><p>{t.contactText}</p><a className="contact-location" href="https://www.google.com/maps/search/?api=1&query=Albat%C3%A0rrec%2C+Lleida" target="_blank" rel="noreferrer" aria-label={t.map}><Icon type="pin" /><span>{t.location}<small>{language === "ca" ? "T’hi esperem." : "Te esperamos."}</small></span><span><ActionIcon /></span></a>{studioContact.instagram && <a className="text-link" href={studioContact.instagram} target="_blank" rel="noreferrer">{t.instagram}<span><ActionIcon /></span></a>}<Mark className="contact-mark" /></div>
          <div className="contact-panel"><form className="consultation-form" onSubmit={prepareBrief}><div className="form-row"><label>{t.name}<input name="name" autoComplete="name" placeholder={t.namePlaceholder} required maxLength={80} /></label><label>{t.style}<select value={styleIndex} onChange={(event) => setStyleIndex(Number(event.target.value))}>{t.styles.map((style, index) => <option value={index} key={index}>{style.name}</option>)}</select></label></div><div className="form-row"><label>{t.zone}<input name="zone" placeholder={t.zonePlaceholder} maxLength={100} /></label><label>{t.size}<input name="size" placeholder={t.sizePlaceholder} maxLength={60} /></label></div><label>{t.idea}<textarea name="idea" rows={4} required placeholder={t.ideaPlaceholder} maxLength={2000} /></label><button type="submit" className="button button--green"><span>{t.prepare}</span><ActionIcon /></button><p className="form-note">{t.formNote}</p></form>
            {brief && <section className="prepared-brief" aria-labelledby="brief-title"><h3 id="brief-title">{t.draftTitle}</h3><p>{t.draftNote}</p><textarea readOnly value={message} aria-label={t.draftTitle} rows={9} /><div className="brief-actions"><button type="button" className="button button--outline" onClick={copyBrief}>{copyState === "copied" ? t.copied : t.copy}</button>{whatsappUrl && <a className="button button--green" href={whatsappUrl} target="_blank" rel="noreferrer">{t.whatsapp}<ActionIcon /></a>}</div><p role="status" className="copy-status">{copyState === "copied" ? t.copied : copyState === "error" ? t.copyError : ""}</p></section>}
          </div>
        </div></section>
      </main>
      <footer className="studio-footer page-width"><a href="#inicio" aria-label={t.top}><Mark /></a><p>DFM TATTOO ARTIST<span>{t.location} · {t.footer}</span></p><div className="footer-tools"><button type="button" onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? t.pause : t.resume}</button><a href="#inicio" className="back-top" aria-label={t.top}><ActionIcon direction="up" /></a></div></footer>
      <a className="mobile-book" href="#contacto"><Icon type="calendar" />{t.reserve}<span><ActionIcon /></span></a>
      <dialog className="work-dialog" ref={dialogRef} aria-labelledby="dialog-title" onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }} onKeyDown={(event) => { if (event.key === "ArrowRight") navigateWork(1); if (event.key === "ArrowLeft") navigateWork(-1); }}><div className="dialog-content"><button type="button" className="dialog-close" onClick={() => dialogRef.current?.close()} aria-label={t.close}>×</button><ArtworkPhoto artwork={currentWork} alt={currentWork[language]} sizes="600px" /><div className="dialog-caption"><div><p>{currentWork.kind === "design" ? t.designCategory : t.filters[currentWork.group]}</p><h2 id="dialog-title">{currentWork[language]}</h2></div><span>{dialogWorks.indexOf(currentWork) + 1} {t.of} {dialogWorks.length}</span></div><div className="dialog-controls"><button type="button" onClick={() => navigateWork(-1)} aria-label={t.previous}><ActionIcon direction="left" /></button><a href="#contacto" onClick={() => { setReferenceWork(selectedWork); dialogRef.current?.close(); }}>{currentWork.kind === "design" ? t.designCta : t.referenceCta}<span><ActionIcon /></span></a><button type="button" onClick={() => navigateWork(1)} aria-label={t.next}><ActionIcon direction="right" /></button></div></div></dialog>
    </div>
  );
}
