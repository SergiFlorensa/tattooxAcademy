"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export type LogoAudioGraph = { context: AudioContext; analyser: AnalyserNode; gain: GainNode; isPlaying: () => boolean };

/** Real bass-band energy only. No timers pretending to know a track's BPM. */
export function useAudioLogo(target: RefObject<HTMLElement | null>, graph: LogoAudioGraph | null, motion: boolean) {
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let bass = 0;
    let velocity = 0;
    let groove = 0;
    const bins = graph ? new Float32Array(graph.analyser.frequencyBinCount) : null;

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0; last = 0; bass = 0; velocity = 0; groove = 0;
      element!.style.setProperty("--dfm-bass", "0");
      element!.style.setProperty("--dfm-groove", "0");
      element!.dataset.audioReactive = "false";
    }

    function bandEnergy(from: number, to: number) {
      if (!graph || !bins) return 0;
      const hertzPerBin = graph.context.sampleRate / graph.analyser.fftSize;
      const start = Math.max(1, Math.floor(from / hertzPerBin));
      const end = Math.min(bins.length - 1, Math.ceil(to / hertzPerBin));
      let power = 0;
      for (let i = start; i <= end; i++) power += 10 ** (bins[i] / 10);
      return Math.sqrt(power / Math.max(1, end - start + 1));
    }

    function tick(now: number) {
      if (!graph || !bins || document.hidden || preference.matches || !motion) { reset(); return; }
      // Limit analysis and DOM writes to 30 fps, without React re-rendering.
      if (last && now - last < 32) { frame = requestAnimationFrame(tick); return; }
      const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 30;
      last = now;
      const audible = graph.isPlaying() && graph.context.state === "running" && graph.gain.gain.value > 0;
      graph.analyser.getFloatFrequencyData(bins!);
      const beat = audible ? Math.min(1, Math.max(0, (bandEnergy(35, 180) - .002) * 32)) : 0;
      const body = audible ? Math.min(1, Math.max(0, bandEnergy(180, 1500) * 12)) : 0;
      // A damped spring: a small subwoofer push, followed by a soft return.
      velocity += ((beat - bass) * 140 - velocity * 20) * dt;
      bass = Math.max(0, Math.min(1, bass + velocity * dt));
      groove += (body - groove) * .24;
      element!.style.setProperty("--dfm-bass", bass.toFixed(4));
      element!.style.setProperty("--dfm-groove", groove.toFixed(4));
      element!.dataset.audioReactive = audible ? "true" : "false";
      frame = requestAnimationFrame(tick);
    }

    function reconcile() {
      reset();
      if (graph && motion && !preference.matches && !document.hidden) frame = requestAnimationFrame(tick);
    }
    reconcile();
    document.addEventListener("visibilitychange", reconcile);
    preference.addEventListener("change", reconcile);
    return () => { reset(); document.removeEventListener("visibilitychange", reconcile); preference.removeEventListener("change", reconcile); };
  }, [target, graph, motion]);
}
