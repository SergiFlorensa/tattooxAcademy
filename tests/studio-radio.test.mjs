import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { createElement } from "react";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../app/studio-radio.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });

function radioHarness(status = "off") {
  const state = [], calls = [];
  let cursor = 0;
  const radio = {
    status, volume: .35, muted: false,
    play(url) { calls.push(["play", url]); this.status = "loading"; },
    stop() { calls.push(["stop"]); this.status = "off"; },
    pause() { calls.push(["pause"]); this.status = "paused"; },
    toggleMute() {}, changeVolume() {},
  };
  const imports = {
    react: { ...require("react"), useRef: () => ({ current: null }), useState: initial => {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], next => { state[index] = next; }];
    } },
    "next/image": { default: props => createElement("img", props) },
    "./action-icon": { default: () => createElement("svg") },
    "./dfm-seal": { default: () => createElement("svg") },
    "./portfolio-data": { tattooWorks: [{}, { src: "/portfolio/p04-x7.webp", width: 688, height: 1055 }], availableDesigns: [{ src: "/portfolio/p05-x4.webp", width: 620, height: 877 }], artistPortrait: { src: "/portfolio/p02-x10.webp", width: 1080, height: 1440 } },
    "./use-radio-audio": { useRadioAudio: () => radio },
  };
  const loaded = { exports: {} };
  runInNewContext(`(function(require, module, exports) { ${outputText}\n })`)(name => imports[name] ?? require(name), loaded, loaded.exports);
  function flatten(node) {
    if (!node || typeof node !== "object") return [];
    if (Array.isArray(node)) return node.flatMap(flatten);
    if (typeof node.type === "function") return flatten(node.type(node.props));
    return [node, ...flatten(node.props.children)];
  }
  const render = () => { cursor = 0; return flatten(loaded.exports.default({ language: "es", onAudioGraph() {} })); };
  const find = predicate => render().find(predicate);
  const button = label => find(node => node.type === "button" && node.props["aria-label"] === label);
  const select = index => render().filter(node => node.props.className?.startsWith("radio-station-option "))[index].props.onClick();
  find(node => node.props.className === "radio-launcher").props.onClick();
  return { radio, calls, render, button, select };
}

test("an opened idle radio shows Play and volume without an activation screen", () => {
  const ui = radioHarness();
  assert.ok(ui.button("Reproducir"));
  assert.ok(ui.render().some(node => node.type === "input" && node.props.type === "range"));
  assert.ok(!ui.render().some(node => node.props.className === "radio-off-screen"));
  assert.doesNotMatch(source, /Activar radio/);
  assert.deepEqual(ui.calls, []);
});

test("changing an idle station does not autoplay; Play starts the selected stream", () => {
  const ui = radioHarness();
  ui.select(2);
  assert.deepEqual(ui.calls, []);
  ui.button("Reproducir").props.onClick();
  assert.deepEqual(ui.calls, [["play", "https://hydra.cdnstream.com/1540_128"]]);
  assert.equal(ui.radio.volume, .35);
});

test("changing a playing station releases the old session and continues on the new one", () => {
  const ui = radioHarness("playing");
  ui.select(3);
  assert.deepEqual(ui.calls, [["stop"], ["play", "https://hydra.cdnstream.com/1536_128"]]);
  assert.ok(ui.button("Pausar"));
});

test("changing a paused station preserves pause until Play is pressed", () => {
  const ui = radioHarness("paused");
  ui.select(2);
  assert.equal(ui.radio.status, "paused");
  assert.deepEqual(ui.calls, []);
  ui.button("Reproducir").props.onClick();
  assert.deepEqual(ui.calls, [["play", "https://hydra.cdnstream.com/1540_128"]]);
});

test("a connecting station can be switched or paused without restarting it", () => {
  const ui = radioHarness("loading");
  ui.select(3);
  assert.deepEqual(ui.calls, [["stop"], ["play", "https://hydra.cdnstream.com/1536_128"]]);
  ui.button("Pausar").props.onClick();
  assert.deepEqual(ui.calls.at(-1), ["pause"]);
});

test("a new selection clears the previous station's error without autoplay", () => {
  const ui = radioHarness("error");
  ui.select(2);
  assert.deepEqual(ui.calls, [["stop"]]);
  assert.ok(ui.button("Reproducir"));
});
