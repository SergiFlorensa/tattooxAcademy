import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
function loadComponent(filename, localImports = {}) {
  const source = readFileSync(new URL(`../app/${filename}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const loadedModule = { exports: {} };
  const evaluate = runInNewContext(`(function(require, module, exports) { ${outputText}\n })`);
  evaluate(name => localImports[name] ?? require(name), loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const ActionIcon = loadComponent("action-icon.tsx");
const { default: Gallery } = loadComponent("studio-gallery.tsx", { "./action-icon": ActionIcon });
const portfolio = loadComponent("portfolio-data.ts");
const pieces = count => Array.from({ length: count }, (_, i) => ({ id: `work-${i}`, title: `Work ${i + 1}`, category: "Realismo", image: createElement("img", { src: `/fixture-${i}.jpg`, alt: `Work ${i + 1}` }) }));
const render = count => renderToStaticMarkup(createElement(Gallery, { pieces: pieces(count), language: "es", onOpen() {} }));

test("a circular collection exposes every piece once and keeps a dynamic total", () => {
  const html = render(19);
  assert.equal((html.match(/<img\b/g) ?? []).length, 19);
  assert.match(html, /aria-label="1 de 19"/);
  assert.match(html, /aria-label="Ver: Work 7"/);
  assert.match(html, /aria-label="Ver: Work 19"/);
  assert.match(html, /aria-label="Ampliar: Work 1"/);
  assert.match(html, /aria-label="Ver: Work 2"/);
  assert.doesNotMatch(html, /portfolio-grid|work-card/);
});
test("a single filtered piece keeps its selected index and disables navigation", () => {
  const html = render(1);
  assert.equal((html.match(/<img\b/g) ?? []).length, 1);
  assert.match(html, /aria-pressed="true"/);
  assert.equal((html.match(/disabled=""/g) ?? []).length, 2);
  assert.match(html, /aria-label="1 de 1"/);
});
test("an empty collection renders no broken controls", () => assert.equal(render(0), ""));

test("every unique image from portfolio pages 2–6 has a website destination at its native dimensions", () => {
  const manifest = JSON.parse(readFileSync(new URL("../assets/dfm-portfolio/manifest.json", import.meta.url), "utf8"));
  assert.deepEqual(manifest.map(page => page.page), [2, 3, 4, 5, 6]);
  assert.equal(portfolio.tattooWorks.length, 4);
  assert.equal(portfolio.availableDesigns.length, 8);
  const displayed = [...portfolio.tattooWorks, ...portfolio.availableDesigns, portfolio.artistPortrait, portfolio.processDesign, portfolio.processResult];
  const originals = manifest.flatMap(page => page.images).filter(image => !["p02-x4", "p03-x9"].includes(image.id));
  for (const original of originals) {
    const asset = displayed.find(piece => piece.src === original.src);
    assert.ok(asset, `Missing ${original.id}`);
    assert.equal(asset.width, original.width);
    assert.equal(asset.height, original.height);
  }
  assert.equal(new Set(displayed.map(piece => piece.src)).size, originals.length);
});
