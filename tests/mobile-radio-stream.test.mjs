import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const { outputText } = ts.transpileModule(readFileSync(new URL("../app/mobile-radio-stream.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function harness(ready = Promise.resolve()) {
  let freed = 0, requests = 0;
  class Decoder {
    ready = ready;
    async reset() {}
    async free() { freed++; }
  }
  const loaded = { exports: {} };
  const scope = {
    require: () => ({ MPEGDecoderWebWorker: Decoder }), module: loaded, exports: loaded.exports,
    AbortController, Response,
    fetch: async () => { requests++; return new Response("Unavailable", { status: 502 }); },
    setTimeout: (callback, ms) => setTimeout(callback, ms < 2000 ? 0 : ms), clearTimeout,
  };
  runInNewContext(outputText, scope);
  const states = [];
  const stream = new loaded.exports.MobileRadioStream({}, state => states.push(state));
  return { stream, states, freed: () => freed, requests: () => requests };
}

test("mobile playback reports an upstream failure after bounded retries and frees the decoder", async () => {
  const player = harness();
  await player.stream.start("/api/radio/los40");
  assert.deepEqual(player.states, ["loading", "error"]);
  assert.equal(player.requests(), 3);
  assert.equal(player.freed(), 1);
  assert.equal(player.stream.isPlaying(), false);
});

test("pausing during decoder initialization cancels playback without a stale connection or error", async () => {
  let initialize;
  const player = harness(new Promise(resolve => { initialize = resolve; }));
  const starting = player.stream.start("/api/radio/los40");
  await new Promise(resolve => setTimeout(resolve, 0));
  player.stream.dispose();
  initialize();
  await starting;
  assert.deepEqual(player.states, ["loading"]);
  assert.equal(player.requests(), 0);
  assert.equal(player.freed(), 1);
});
