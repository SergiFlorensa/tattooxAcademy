"use client";

import Image from "next/image";
import { useState } from "react";
import type { FormEvent } from "react";

const contactEmail = "hola@tatooxacademy.com";

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Historia", href: "#historia" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Contacto", href: "#contacto" },
];

const projects = [
  {
    number: "01",
    title: "Líneas que hablan",
    category: "Dibujo / estudio",
    tone: "project-card--bone",
    art: "project-art--lines",
    detail: "La idea antes de tocar la piel.",
  },
  {
    number: "02",
    title: "Flash de calle",
    category: "Flash / composición",
    tone: "project-card--red",
    art: "project-art--flash",
    detail: "Pequeños símbolos, mucha actitud.",
  },
  {
    number: "03",
    title: "Bocetos con propósito",
    category: "Proceso / búsqueda",
    tone: "project-card--ink",
    art: "project-art--mark",
    detail: "Aprender también es tachar y volver.",
  },
];

const principles = [
  {
    index: "01",
    title: "Mirar",
    text: "Encontrar referencias en la calle, en las personas y en todo lo que tiene una historia detrás.",
  },
  {
    index: "02",
    title: "Dibujar",
    text: "Probar sin miedo. La mano aprende cuando la cabeza deja de pedir permiso.",
  },
  {
    index: "03",
    title: "Construir",
    text: "Convertir una idea en una pieza propia, con respeto por el oficio y ganas de seguir creciendo.",
  },
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="icon icon-arrow">
      <path d="M4 14 14 4M6 4h8v8" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="icon icon-arrow-down">
      <path d="M9 2v13M4 10l5 5 5-5" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`menu-lines ${open ? "menu-lines--open" : ""}`} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const subject = encodeURIComponent(`Idea para Tatoox Academy · ${name || "nuevo mensaje"}`);
    const body = encodeURIComponent(
      `Hola, soy ${name || ""}.\n\n${message}\n\nPuedes responderme en: ${email}`,
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <main className="site-shell">
      <div className="ambient-noise" aria-hidden="true" />

      <header className="site-header">
        <a className="brand-lockup" href="#inicio" onClick={closeMenu} aria-label="Tatoox Academy, volver al inicio">
          <span className="brand-mark">TX</span>
          <span className="brand-name">
            Tatoox
            <span>Academy</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <MenuIcon open={menuOpen} />
          <span className="sr-only">{menuOpen ? "Cerrar menú" : "Abrir menú"}</span>
        </button>

        <nav id="primary-navigation" className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Navegación principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta" href="#contacto" onClick={closeMenu}>
            Hablemos <ArrowUpRight />
          </a>
        </nav>
      </header>

      <section className="hero-section" id="inicio">
        <div className="hero-grid page-width">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span className="eyebrow-dot" /> Diario de un aprendiz · vol. 01
            </p>
            <h1>
              Tinta
              <span className="headline-outline">ideas</span>
              <span className="headline-red">calle.</span>
            </h1>
            <p className="hero-description">
              Un espacio para enseñar el camino: los dibujos, las pruebas, las
              ganas y todo lo que sucede antes de que una idea se convierta en
              tatuaje.
            </p>
            <div className="hero-actions">
              <a className="button button--red" href="#proyectos">
                Ver el recorrido <ArrowUpRight />
              </a>
              <a className="text-link" href="#contacto">
                Tengo una idea <span>↗</span>
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Logotipo de Tatoox Academy">
            <div className="hero-stamp hero-stamp--top">DIBUJO · FLOW · OFICIO</div>
            <span className="hero-coordinate hero-coordinate--top" aria-hidden="true">BCN / 41°23′N</span>
            <div className="hero-logo-wrap">
              <span className="hero-frame-echo hero-frame-echo--one" aria-hidden="true" />
              <span className="hero-frame-echo hero-frame-echo--two" aria-hidden="true" />
              <span className="hero-orbit hero-orbit--one" />
              <span className="hero-orbit hero-orbit--two" />
              <span className="hero-cross hero-cross--one" />
              <span className="hero-cross hero-cross--two" />
              <span className="hero-street-sticker" aria-hidden="true">RAW / 01</span>
              <div className="hero-logo-frame">
                <Image
                  src="/logo-tatoox.jpeg"
                  alt="Logotipo de Tatoox Tattoo Artist"
                  width={420}
                  height={420}
                  priority
                  unoptimized
                  className="hero-logo"
                />
              </div>
              <span className="hero-ink-ring" aria-hidden="true" />
              <div className="hero-side-label hero-side-label--left">EST. 2024</div>
              <div className="hero-side-label hero-side-label--right">INK / FORM / SOUL</div>
            </div>
            <span className="hero-coordinate hero-coordinate--bottom" aria-hidden="true">NOISE / NERVE / FLOW</span>
            <div className="hero-stamp hero-stamp--bottom">MADE BY HAND / NO SHORTCUTS</div>
          </div>
        </div>

        <div className="hero-bottom page-width">
          <a className="scroll-prompt" href="#historia">
            <span className="scroll-prompt__icon"><ArrowDown /></span>
            <span>Entrar en el cuaderno</span>
          </a>
          <span className="hero-location">Barcelona · España</span>
        </div>

        <div className="ticker" aria-label="Manifiesto de Tatoox Academy">
          <div className="ticker-track">
            <span>APRENDER HACIENDO</span><b>✦</b><span>DIBUJAR PARA ENCONTRAR</span><b>✦</b><span>RESPETO POR EL OFICIO</span><b>✦</b><span>FLOW SIN FILTRO</span><b>✦</b>
            <span>APRENDER HACIENDO</span><b>✦</b><span>DIBUJAR PARA ENCONTRAR</span><b>✦</b><span>RESPETO POR EL OFICIO</span><b>✦</b><span>FLOW SIN FILTRO</span><b>✦</b>
          </div>
        </div>
      </section>

      <section className="story-section page-width section-padding" id="historia">
        <div className="section-label">
          <span>01</span>
          <span>El comienzo</span>
        </div>
        <div className="story-grid">
          <div className="story-heading-wrap">
            <p className="eyebrow">No empezó con una máquina.</p>
            <h2>
              Empezó con una hoja,
              <span> una obsesión</span>
              <br />
              y muchas preguntas.
            </h2>
          </div>
          <div className="story-copy">
            <p className="story-lead">
              Tatoox Academy es el registro de una iniciación. Un lugar para
              compartir el proceso de aprender a tatuar con curiosidad, cabeza
              y corazón.
            </p>
            <p>
              Aquí cada proyecto tiene una historia: desde el primer garabato
              hasta la decisión de convertir una línea en algo que acompaña a
              otra persona. Sin postureo. Con trabajo, referencias y ganas de
              mejorar en cada intento.
            </p>
            <a className="underlined-link" href="#contacto">
              Si tienes una idea, cuéntamela <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="quote-panel">
          <span className="quote-mark">“</span>
          <blockquote>La mano aprende cuando la cabeza se atreve.</blockquote>
          <span className="quote-signature">— Tatoox Academy</span>
        </div>
      </section>

      <section className="principles-section section-padding" id="proceso">
        <div className="page-width">
          <div className="section-label section-label--light">
            <span>02</span>
            <span>La forma de hacerlo</span>
          </div>
          <div className="principles-intro">
            <h2>Antes de la aguja, <em>hay camino.</em></h2>
            <p>Una manera de avanzar que empieza en la calle y termina en una pieza con sentido.</p>
          </div>
          <div className="principles-list">
            {principles.map((principle) => (
              <article className="principle" key={principle.index}>
                <span className="principle-index">{principle.index}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
                <span className="principle-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-section page-width section-padding" id="proyectos">
        <div className="section-label">
          <span>03</span>
          <span>Proyectos / trabajos</span>
        </div>
        <div className="projects-header">
          <div>
            <p className="eyebrow">El cuaderno no para.</p>
            <h2>Ideas en proceso<span>.</span></h2>
          </div>
          <p>Una selección viva de dibujos, pruebas y piezas que irán creciendo con el aprendizaje.</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className={`project-card ${project.tone}`} key={project.number}>
              <div className={`project-visual ${project.art}`}>
                <span className="project-number">{project.number}</span>
                <span className="project-visual-label">TATOOX / STUDY</span>
                {project.art === "project-art--lines" && (
                  <div className="line-art" aria-hidden="true">
                    <span className="line-art__circle" />
                    <span className="line-art__line line-art__line--one" />
                    <span className="line-art__line line-art__line--two" />
                    <span className="line-art__star">✦</span>
                  </div>
                )}
                {project.art === "project-art--flash" && (
                  <div className="flash-art" aria-hidden="true">
                    <span>STAY</span>
                    <b>TRUE</b>
                    <i>✦</i>
                  </div>
                )}
                {project.art === "project-art--mark" && (
                  <div className="mark-art" aria-hidden="true">
                    <Image src="/logo-tatoox.jpeg" alt="" width={180} height={180} unoptimized />
                    <span>01 / FORM</span>
                  </div>
                )}
              </div>
              <div className="project-card__body">
                <div>
                  <p className="project-category">{project.category}</p>
                  <h3>{project.title}</h3>
                </div>
                <p>{project.detail}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="projects-note">
          <span className="note-sticker">PRÓXIMAMENTE</span>
          <p>La galería crecerá con cada nueva pieza, cada flash y cada historia compartida.</p>
          <a className="underlined-link" href="#contacto">Proponer un proyecto <ArrowUpRight /></a>
        </div>
      </section>

      <section className="manifesto-section section-padding">
        <div className="page-width manifesto-grid">
          <div className="manifesto-stamp">TATO OX<br />ACADEMY</div>
          <div className="manifesto-copy">
            <p className="eyebrow eyebrow--red">Una promesa pequeña, pero seria.</p>
            <h2>
              Cada línea
              <span> empieza</span>
              <br />
              como una pregunta.
            </h2>
            <p>Y cada respuesta se gana practicando.</p>
          </div>
          <div className="manifesto-scribble" aria-hidden="true">keep<br />going ↗</div>
        </div>
      </section>

      <section className="contact-section page-width section-padding" id="contacto">
        <div className="section-label">
          <span>04</span>
          <span>Contacto directo</span>
        </div>
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="eyebrow">¿Tienes una idea?</p>
            <h2>Vamos a <span>dibujarla.</span></h2>
            <p>
              Si quieres hablar de una pieza, compartir una referencia o
              simplemente saludar, deja tus datos y se abrirá un email listo
              para enviar.
            </p>
            <a className="contact-email" href={`mailto:${contactEmail}`}>
              {contactEmail} <ArrowUpRight />
            </a>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              <span>Tu nombre</span>
              <input name="name" type="text" autoComplete="name" placeholder="¿Cómo te llamas?" required />
            </label>
            <label>
              <span>Tu email</span>
              <input name="email" type="email" autoComplete="email" placeholder="para poder responderte" required />
            </label>
            <label>
              <span>Cuéntame la idea</span>
              <textarea name="message" rows={4} placeholder="Una pieza, un símbolo, una historia..." required />
            </label>
            <button className="button button--ink" type="submit">
              Preparar email <ArrowUpRight />
            </button>
            <p className="form-note">Sin cuentas, sin ruido. Solo una conversación.</p>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">TX</span>
            <span>Tatoox Academy</span>
          </div>
          <p>Aprender haciendo · Barcelona</p>
          <a href="#inicio" className="back-to-top" aria-label="Volver al inicio">↑</a>
        </div>
      </footer>
    </main>
  );
}
