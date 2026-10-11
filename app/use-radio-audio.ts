"use client";

import { useEffect, useRef, useState } from "react";
import type { LogoAudioGraph } from "./use-audio-logo";
import { LiveRadioAudio } from "./live-radio-audio";

export type RadioStatus = "off" | "loading" | "playing" | "paused" | "error";

export function useRadioAudio(onAudioGraph: (graph: LogoAudioGraph | null) => void) {
  const engine = useRef<LiveRadioAudio | null>(null);
  const loudness = useRef(.6);
  const silent = useRef(false);
  const [status, setStatus] = useState<RadioStatus>("off");
  const [volume, setVolume] = useState(.6);
  const [muted, setMuted] = useState(false);

  useEffect(() => () => {
    engine.current?.dispose(); engine.current = null;
    onAudioGraph(null);
  }, [onAudioGraph]);

  function publishGraph() {
    const player = engine.current;
    onAudioGraph(player?.isPlaying() && !silent.current && loudness.current > 0 ? player.graph : null);
  }

  function applyVolume() {
    engine.current?.setVolume(silent.current ? 0 : loudness.current ** 2);
    publishGraph();
  }

  function play(url: string) {
    try {
      engine.current ??= new LiveRadioAudio(next => { setStatus(next); publishGraph(); });
      applyVolume(); engine.current.play(url);
    } catch { setStatus("error"); onAudioGraph(null); }
  }

  function stop() {
    engine.current?.stop(); setStatus("off"); onAudioGraph(null);
  }

  function pause() { engine.current?.pause(); }
  function changeVolume(value: number) {
    loudness.current = Math.max(0, Math.min(1, value));
    // Moving the slider restores sound after mute, as users expect.
    if (loudness.current > 0 && silent.current) { silent.current = false; setMuted(false); }
    setVolume(loudness.current); applyVolume();
  }
  function toggleMute() { silent.current = !silent.current; setMuted(silent.current); applyVolume(); }

  return { status, volume, muted, play, pause, stop, changeVolume, toggleMute };
}
