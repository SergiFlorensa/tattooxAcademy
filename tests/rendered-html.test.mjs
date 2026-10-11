import assert from "node:assert/strict";
import test from "node:test";

test("renders DFM's local studio page with real branding and working section targets", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();

  assert.match(html, /<title>DFM Tattoo Artist · Albatàrrec, Lleida<\/title>/i);
  assert.match(html, /<meta property="og:image" content="[^"]*\/portfolio\/p02-x10\.webp"\/>/i);
  assert.match(html, /<header class="studio-header/);
  assert.match(html, /lang="ca"/);
  for (const target of ["estils", "treballs", "disenos", "artista", "contacto"]) {
    assert.match(html, new RegExp(`href="#${target}"`));
    assert.match(html, new RegExp(`id="${target}"`));
  }
  assert.match(html, /class="consultation-form"/);
  assert.match(html, /<svg\b[^>]*class="artist-seal"[^>]*aria-label="Logo oficial DFM Tattoo Artist, EST\. 2026"/);
  assert.match(html, /<image href="\/dfm-logo-2026\.jpg"/);
  assert.match(html, /src="\/portfolio\/p02-x10\.webp"[^>]*class="artist-photo-image"/);
  const heroPortrait = html.match(/<div class="hero-portrait">[\s\S]*?<\/section>/)?.[0];
  assert.match(heroPortrait, /src="\/dfm-reference\.jpg"/);
  assert.doesNotMatch(heroPortrait, /src="\/portfolio\/p02-x10\.webp"/);
  for (const work of ["p04-x4", "p04-x7", "p04-x9"]) assert.match(heroPortrait, new RegExp(`src="/portfolio/${work}\\.webp"`));
  assert.doesNotMatch(html, /Est\. 2024|dfm-seal-transparent-hq|dfm-artist-reconstruction|No són treballs de DFM/);
  assert.match(html, /class="process-case-study"/);
  assert.match(html, /src="\/portfolio\/p03-x6\.webp"/);
  assert.match(html, /src="\/portfolio\/p03-x8\.webp"/);
  assert.match(html, /Seguiment i curació/);
  assert.match(html, /Preparar consulta/);
  assert.match(html, /class="work-dialog"/);
  assert.match(html, /class="studio-gallery" data-kind="work" role="region" aria-roledescription="carrusel"/);
  assert.match(html, /class="studio-gallery" data-kind="design" role="region" aria-roledescription="carrusel"/);
  assert.match(html, /class="gallery-piece gallery-piece--active"/);
  assert.match(html, /class="gallery-progress" aria-hidden="true"/);
  assert.doesNotMatch(html, /class="portfolio-grid"|work-folio/);
  assert.match(html, /DFM Studio Radio/);
  assert.match(html, /aria-controls="studio-radio-panel"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /class="radio-mini-player"/);
  assert.match(html, /aria-label="Reproduir"/);
  assert.match(html, /type="range"[^>]*aria-label="Volum"/);
  assert.doesNotMatch(html, /Stop · Desconnectar|03 CHANNELS/);
  assert.doesNotMatch(html, /radio-notes|BASS REACTIVE|DFM RADIO \/ INFO|Tancar i desconnectar/);
  // Initial render is local-only: third-party media loads after explicit activation.
  assert.doesNotMatch(html, /<iframe\b|<video\b|<audio\b/i);
  assert.doesNotMatch(html, /(?:src|href)="https:\/\/(?:hydra\.cdnstream\.com|playerservices\.streamtheworld\.com)/i);
  assert.match(html, /<svg class="dfm-mark /);
  assert.match(html, /class="dfm-crown"/);
  assert.match(html, /class="dfm-letters"/);
  const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
  assert.doesNotMatch(header, /poster-crop|<img\b/i);
  assert.doesNotMatch(html, /(?:src|href)="https:\/\/(?:retunefm|tunein)\.com/i);
  assert.doesNotMatch(html, /wa\.me|instagram\.com|Tatoox Academy|Barcelona|chatgpt\.site/i);
  assert.doesNotMatch(html, /name=["']codex-preview["']/i);
});
