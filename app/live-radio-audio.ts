import type { LogoAudioGraph } from "./use-audio-logo";
import { MobileRadioStream } from "./mobile-radio-stream";

type PlaybackState = "off" | "loading" | "playing" | "paused" | "error";

/** Use the browser's streaming decoders (MP3/AAC) and keep volume/bass analysis in Web Audio. */
export class LiveRadioAudio {
  readonly graph: LogoAudioGraph;
  private media: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private state: PlaybackState = "off";
  private mobile: MobileRadioStream | null = null;

  constructor(private readonly onState: (state: PlaybackState) => void) {
    const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) throw new Error("Web Audio unavailable");
    const context = new Context({ latencyHint: "playback" });
    const gain = context.createGain();
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = .35;
    gain.connect(analyser); analyser.connect(context.destination);
    this.graph = { context, gain, analyser, isPlaying: () => this.isPlaying() };
  }

  private emit(state: PlaybackState) {
    if (state !== this.state) { this.state = state; this.onState(state); }
  }

  isPlaying() {
    if (this.mobile) return this.mobile.isPlaying() && this.graph.context.state === "running";
    return !!this.media && !this.media.paused && !this.media.ended && this.graph.context.state === "running";
  }

  setVolume(value: number) {
    this.graph.gain.gain.value = Math.max(0, Math.min(1, value));
  }

  play(url: string) {
    if (this.mobile || (this.media && !this.media.paused)) return;
    this.release();

    const { context, gain } = this.graph;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS) {
      const mobile = new MobileRadioStream(this.graph, state => {
        if (this.mobile !== mobile) return;
        if (state === "error") { this.release(); void context.suspend().catch(() => {}); }
        this.emit(state);
      });
      this.mobile = mobile;
      // Unlock Web Audio during the Play gesture, before awaiting decoder/network work.
      void context.resume().then(() => {
        if (this.mobile === mobile) void mobile.start(url);
      }).catch(() => { if (this.mobile === mobile) { this.release(); this.emit("error"); } });
      this.emit("loading");
      return;
    }
    // Resume and call play synchronously from the user's gesture for iOS Safari.
    void context.resume().catch(() => this.fail(media));
    const media = new Audio();
    media.crossOrigin = "anonymous";
    media.preload = "none";
    media.src = url;
    const source = context.createMediaElementSource(media);
    source.connect(gain);
    this.media = media;
    this.mediaSource = source;
    this.emit("loading");

    media.addEventListener("playing", () => {
      if (this.media !== media) return;
      this.clearLoadTimer();
      this.emit("playing");
    });
    media.addEventListener("error", () => this.fail(media), { once: true });
    media.addEventListener("ended", () => this.fail(media), { once: true });
    this.loadTimer = setTimeout(() => this.fail(media), 20_000);

    void media.play().catch(() => this.fail(media));
  }

  private fail(media: HTMLAudioElement | null) {
    if (!media || this.media !== media) return;
    this.release();
    this.emit("error");
    void this.graph.context.suspend().catch(() => {});
  }

  private clearLoadTimer() {
    if (this.loadTimer) clearTimeout(this.loadTimer);
    this.loadTimer = null;
  }

  private release() {
    this.clearLoadTimer();
    this.mobile?.dispose();
    this.mobile = null;
    const media = this.media;
    this.media = null;
    if (media) {
      media.pause();
      media.removeAttribute("src");
      media.load();
    }
    this.mediaSource?.disconnect();
    this.mediaSource = null;
  }

  pause() {
    this.release(); this.emit("paused");
    void this.graph.context.suspend().catch(() => {});
  }

  stop() {
    this.release(); this.emit("off");
    void this.graph.context.suspend().catch(() => {});
  }

  dispose() {
    this.release();
    this.graph.gain.disconnect(); this.graph.analyser.disconnect();
    void this.graph.context.close().catch(() => {});
  }
}
