import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../app/api/radio/los40/route.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function loadRoute(fetchImpl) {
  const loadedModule = { exports: {} };
  runInNewContext(`(function(module, exports, fetch, Request, Response, Headers) { ${outputText}\n})`)(
    loadedModule, loadedModule.exports, fetchImpl, Request, Response, Headers,
  );
  return loadedModule.exports;
}

test("LOS40 relay streams the fixed MP3 source and forwards range requests", async () => {
  let requestedUrl;
  let requestedOptions;
  const route = loadRoute(async (url, options) => {
    requestedUrl = url;
    requestedOptions = options;
    return new Response("audio bytes", { headers: { "content-type": "audio/mpeg", "accept-ranges": "bytes" } });
  });

  const response = await route.GET(new Request("https://dfm.example/api/radio/los40", { headers: { Range: "bytes=0-1023" } }));
  assert.equal(requestedUrl, "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3");
  assert.equal(requestedOptions.headers.get("range"), "bytes=0-1023");
  assert.equal(requestedOptions.cache, "no-store");
  assert.equal(response.headers.get("content-type"), "audio/mpeg");
  assert.equal(response.headers.get("cache-control"), "no-store, no-transform");
  assert.equal(await response.text(), "audio bytes");
});

test("LOS40 relay returns a small gateway error when its upstream is unavailable", async () => {
  const route = loadRoute(async () => { throw new Error("network unavailable"); });
  const response = await route.GET(new Request("https://dfm.example/api/radio/los40"));
  assert.equal(response.status, 502);
  assert.equal(await response.text(), "LOS40 stream unavailable");
});
