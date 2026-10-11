const streams: Record<string, string> = {
  los40: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3",
  reggaeton: "https://stream.zeno.fm/8wup8yd9dm0uv",
  "old-school": "https://hydra.cdnstream.com/1540_128",
  urban: "https://hydra.cdnstream.com/1536_128",
};

export const dynamic = "force-dynamic";

/** Fixed station allowlist; never accept an arbitrary upstream URL. */
export async function GET(request: Request) {
  const station = new URL(request.url).searchParams.get("station") || "";
  const stream = Object.hasOwn(streams, station) ? streams[station] : undefined;
  if (!stream) return new Response("Unknown station", { status: 404 });
  try {
    const upstream = await fetch(stream, {
      headers: { Accept: "audio/mpeg,*/*;q=0.8", "Icy-MetaData": "0" },
      cache: "no-store", redirect: "follow", signal: request.signal,
    });
    if (!upstream.ok || !upstream.body) {
      await upstream.body?.cancel();
      return new Response("Radio unavailable", { status: 502 });
    }
    return new Response(upstream.body, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store, no-transform" },
    });
  } catch { return new Response("Radio unavailable", { status: 502 }); }
}
