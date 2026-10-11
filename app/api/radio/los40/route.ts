const LOS40_STREAM = "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3";

export const dynamic = "force-dynamic";

/** Same-origin MP3 relay for LOS40 Urban. The upstream is deliberately fixed. */
export async function GET(request: Request) {
  const headers = new Headers({
    Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
    "User-Agent": "DFM-Studio-Radio/1.0",
  });
  const range = request.headers.get("range");
  if (range) headers.set("Range", range);

  let upstream: Response;
  try {
    upstream = await fetch(LOS40_STREAM, { headers, cache: "no-store", redirect: "follow" });
  } catch {
    return new Response("LOS40 stream unavailable", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    await upstream.body?.cancel();
    return new Response("LOS40 stream unavailable", { status: 502 });
  }

  const responseHeaders = new Headers({
    "Cache-Control": "no-store, no-transform",
    "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
    "X-Content-Type-Options": "nosniff",
  });
  for (const name of ["accept-ranges", "content-range"]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
}
