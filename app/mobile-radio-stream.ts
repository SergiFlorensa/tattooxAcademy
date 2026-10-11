import type { MPEGDecoderWebWorker, MPEGDecodedAudio } from "mpg123-decoder";
import type { LogoAudioGraph } from "./use-audio-logo";

const mobileStations: Record<string, string> = {
  "/api/radio/los40": "los40",
  "https://stream.zeno.fm/8wup8yd9dm0uv": "reggaeton",
  "https://hydra.cdnstream.com/1540_128": "old-school",
  "https://hydra.cdnstream.com/1536_128": "urban",
};

/** PCM playback keeps iOS streaming audio inside the volume/analyser graph. */
export class MobileRadioStream {
  private controller = new AbortController();
  private decoder: MPEGDecoderWebWorker | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private nextTime = 0;
  private playing = false;

  constructor(private graph: LogoAudioGraph, private onState: (state: "loading" | "playing" | "error") => void) {}

  isPlaying() { return this.playing && !this.controller.signal.aborted; }

  async start(url: string) {
    const station = mobileStations[url];
    if (!station) { this.onState("error"); return; }
    const signal = this.controller.signal;
    this.onState("loading");
    try {
      const { MPEGDecoderWebWorker } = await import("mpg123-decoder");
      if (signal.aborted) return;
      const decoder = new MPEGDecoderWebWorker({ enableGapless: false });
      this.decoder = decoder;
      await decoder.ready;
      // A bounded retry reconnects a live station without replaying old audio.
      for (let attempt = 0; attempt < 3 && !signal.aborted; attempt++) {
        let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
        let receivedAudio = false;
        let undecodedBytes = 0;
        const connection = new AbortController();
        const cancelConnection = () => connection.abort();
        signal.addEventListener("abort", cancelConnection, { once: true });
        let timeout = setTimeout(cancelConnection, 20_000);
        try {
          let response = await fetch(`/api/radio/mobile?station=${station}`, { signal: connection.signal, cache: "no-store" });
          // Some providers reject server connections but allow browser CORS streaming.
          // Decoding either response to PCM preserves the same volume path.
          if (!response.ok && station !== "los40") {
            response = await fetch(url, { signal: connection.signal, cache: "no-store" });
          }
          if (!response.ok || !response.body) throw new Error("Radio unavailable");
          clearTimeout(timeout);
          reader = response.body.getReader();
          while (!signal.aborted) {
            timeout = setTimeout(cancelConnection, 20_000);
            const { value, done } = await reader.read();
            clearTimeout(timeout);
            if (done) break;
            // Bound decoding and the scheduled PCM queue, even with an initial server burst.
            for (let offset = 0; offset < value.length && !signal.aborted; offset += 16_384) {
              while (this.nextTime - this.graph.context.currentTime > 1.5 && !signal.aborted) {
                await this.wait(100);
              }
              if (signal.aborted) return;
              const decoded = await decoder.decode(value.slice(offset, offset + 16_384));
              if (signal.aborted) return;
              if (decoded.samplesDecoded) {
                undecodedBytes = 0;
                receivedAudio = true;
                this.schedule(decoded);
              } else if ((undecodedBytes += Math.min(16_384, value.length - offset)) > 262_144) throw new Error("Unsupported stream");
            }
          }
        } catch (error) {
          if (signal.aborted) throw error;
        } finally {
          clearTimeout(timeout);
          signal.removeEventListener("abort", cancelConnection);
          connection.abort();
          await reader?.cancel().catch(() => {});
        }
        if (signal.aborted) return;
        if (!receivedAudio && attempt === 2) throw new Error("Radio unavailable");
        if (attempt < 2) { await decoder.reset(); await this.wait(500 * (attempt + 1)); }
      }
      if (!signal.aborted) throw new Error("Radio disconnected");
    } catch {
      // Pause/dispose is intentional; only report failures while still requested.
      if (!this.stoppedByUser) { this.dispose(); this.onState("error"); }
    }
  }

  private stoppedByUser = false;

  private schedule({ channelData, samplesDecoded, sampleRate }: MPEGDecodedAudio) {
    const { context, gain } = this.graph;
    const buffer = context.createBuffer(channelData.length, samplesDecoded, sampleRate);
    channelData.forEach((channel, index) => buffer.getChannelData(index).set(channel));
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);
    this.nextTime = Math.max(this.nextTime, context.currentTime + .15);
    this.sources.add(source);
    source.onended = () => { this.sources.delete(source); source.disconnect(); };
    source.start(this.nextTime);
    this.nextTime += buffer.duration;
    if (!this.playing) {
      this.playing = true;
      this.onState("playing");
    }
  }

  private wait(ms: number) { return new Promise<void>(resolve => setTimeout(resolve, ms)); }

  dispose() {
    this.stoppedByUser = true;
    this.playing = false;
    this.controller.abort();
    for (const source of this.sources) { source.onended = null; source.stop(); source.disconnect(); }
    this.sources.clear();
    void this.decoder?.free().catch(() => {});
    this.decoder = null;
  }
}
