import type { AmbienceTrackId } from "@/data/ambience";

type Cleanup = () => void;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  return new Ctor();
}

function noiseBuffer(ctx: AudioContext, seconds = 3): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  return buf;
}

function connectLoop(
  ctx: AudioContext,
  dest: AudioNode,
  build: (out: GainNode) => Cleanup,
): Cleanup {
  const bus = ctx.createGain();
  bus.gain.value = 1;
  bus.connect(dest);
  return build(bus);
}

/** Continuous ambience — separate from short UI blips in sounds.ts */
class AmbienceEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private cleanups: Cleanup[] = [];
  private timers: ReturnType<typeof setInterval>[] = [];
  private track: AmbienceTrackId = "off";
  private volume = 0.38;
  private muted = false;

  private ensureCtx(): AudioContext | null {
    if (!this.ctx) {
      this.ctx = getContext();
      if (!this.ctx) return null;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private clear() {
    for (const t of this.timers) clearInterval(t);
    this.timers = [];
    for (const c of this.cleanups) c();
    this.cleanups = [];
  }

  setVolume(v: number) {
    this.volume = Math.min(1, Math.max(0, v));
    if (this.master && !this.muted) this.master.gain.setTargetAtTime(this.volume, this.master.context.currentTime, 0.05);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (!this.master) return;
    this.master.gain.setTargetAtTime(muted ? 0 : this.volume, this.master.context.currentTime, 0.08);
  }

  getTrack(): AmbienceTrackId {
    return this.track;
  }

  async setTrack(track: AmbienceTrackId) {
    this.track = track;
    this.clear();
    if (track === "off") return;

    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;

    const dest = this.master;
    switch (track) {
      case "rain":
        this.cleanups.push(this.buildRain(ctx, dest));
        break;
      case "stream":
        this.cleanups.push(this.buildStream(ctx, dest));
        break;
      case "night":
        this.cleanups.push(this.buildNight(ctx, dest));
        break;
      case "fire":
        this.cleanups.push(this.buildFire(ctx, dest));
        break;
      case "babble":
        this.cleanups.push(this.buildBabble(ctx, dest));
        break;
      case "steam":
        this.cleanups.push(this.buildSteam(ctx, dest));
        break;
      case "airplane":
        this.cleanups.push(this.buildAirplane(ctx, dest));
        break;
      case "boat":
        this.cleanups.push(this.buildBoat(ctx, dest));
        break;
      case "bus":
        this.cleanups.push(this.buildBus(ctx, dest));
        break;
      case "train":
        this.cleanups.push(this.buildTrain(ctx, dest));
        break;
    }
  }

  private loopNoise(
    ctx: AudioContext,
    dest: AudioNode,
    filter: (src: AudioBufferSourceNode) => AudioNode,
    gain = 0.25,
  ): Cleanup {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    src.loop = true;
    const g = ctx.createGain();
    g.gain.value = gain;
    const chain = filter(src);
    chain.connect(g).connect(dest);
    src.start();
    return () => {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
      chain.disconnect();
      g.disconnect();
    };
  }

  private buildRain(ctx: AudioContext, dest: AudioNode): Cleanup {
    return connectLoop(ctx, dest, (out) => {
      const cleanup = this.loopNoise(
        ctx,
        out,
        (src) => {
          const lp = ctx.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.value = 900;
          src.connect(lp);
          return lp;
        },
        0.22,
      );
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.15;
      lfoG.gain.value = 0.08;
      lfo.connect(lfoG);
      out.gain.value = 0.2;
      lfo.start();
      return () => {
        lfo.stop();
        lfo.disconnect();
        lfoG.disconnect();
        cleanup();
      };
    });
  }

  private buildStream(ctx: AudioContext, dest: AudioNode): Cleanup {
    return connectLoop(ctx, dest, (out) => {
      const c = this.loopNoise(
        ctx,
        out,
        (src) => {
          const bp = ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = 600;
          bp.Q.value = 0.6;
          src.connect(bp);
          return bp;
        },
        0.28,
      );
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = 0.25;
      lfoG.gain.value = 0.06;
      lfo.connect(lfoG).connect(out.gain);
      lfo.start();
      return () => {
        lfo.stop();
        c();
      };
    });
  }

  private buildNight(ctx: AudioContext, dest: AudioNode): Cleanup {
    const cleanups: Cleanup[] = [];
    cleanups.push(
      connectLoop(ctx, dest, (out) => {
        const hum = ctx.createOscillator();
        hum.type = "sine";
        hum.frequency.value = 55;
        const g = ctx.createGain();
        g.gain.value = 0.04;
        hum.connect(g).connect(out);
        hum.start();
        return () => {
          hum.stop();
          hum.disconnect();
          g.disconnect();
        };
      }),
    );

    const chirp = () => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = 4200 + Math.random() * 800;
      g.gain.value = 0;
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.012, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      o.connect(g).connect(dest);
      o.start();
      o.stop(ctx.currentTime + 0.15);
    };

    const id = setInterval(chirp, 380 + Math.random() * 400);
    this.timers.push(id);
    return () => {
      clearInterval(id);
      for (const c of cleanups) c();
    };
  }

  private buildFire(ctx: AudioContext, dest: AudioNode): Cleanup {
    return connectLoop(ctx, dest, (out) => {
      const base = this.loopNoise(
        ctx,
        out,
        (src) => {
          const lp = ctx.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.value = 1200;
          src.connect(lp);
          return lp;
        },
        0.12,
      );
      const crackle = () => {
        const g = ctx.createGain();
        g.gain.value = 0;
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.05, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08 + Math.random() * 0.1);
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer(ctx, 0.05);
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 2000;
        src.connect(hp).connect(g).connect(out);
        src.start();
        src.stop(ctx.currentTime + 0.2);
      };
      const id = setInterval(crackle, 90 + Math.random() * 180);
      this.timers.push(id);
      return () => {
        clearInterval(id);
        base();
      };
    });
  }

  private buildBabble(ctx: AudioContext, dest: AudioNode): Cleanup {
    return connectLoop(ctx, dest, (out) => {
      const parts: Cleanup[] = [];
      for (const freq of [900, 1400, 2200]) {
        parts.push(
          this.loopNoise(
            ctx,
            out,
            (src) => {
              const bp = ctx.createBiquadFilter();
              bp.type = "bandpass";
              bp.frequency.value = freq;
              bp.Q.value = 2;
              src.connect(bp);
              return bp;
            },
            0.08,
          ),
        );
      }
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 1.2;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 0.04;
      lfo.connect(lfoG).connect(out.gain);
      lfo.start();
      return () => {
        lfo.stop();
        for (const p of parts) p();
      };
    });
  }

  private buildSteam(ctx: AudioContext, dest: AudioNode): Cleanup {
    return this.loopNoise(
      ctx,
      dest,
      (src) => {
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 2800;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 9000;
        src.connect(hp).connect(lp);
        return lp;
      },
      0.14,
    );
  }

  private buildAirplane(ctx: AudioContext, dest: AudioNode): Cleanup {
    return connectLoop(ctx, dest, (out) => {
      const hum = ctx.createOscillator();
      hum.type = "sawtooth";
      hum.frequency.value = 95;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 200;
      const g = ctx.createGain();
      g.gain.value = 0.06;
      const vib = ctx.createOscillator();
      vib.frequency.value = 0.3;
      const vibG = ctx.createGain();
      vibG.gain.value = 4;
      vib.connect(vibG).connect(hum.frequency);
      hum.connect(lp).connect(g).connect(out);
      const rumble = this.loopNoise(
        ctx,
        out,
        (src) => {
          const f = ctx.createBiquadFilter();
          f.type = "lowpass";
          f.frequency.value = 150;
          src.connect(f);
          return f;
        },
        0.05,
      );
      hum.start();
      vib.start();
      return () => {
        hum.stop();
        vib.stop();
        rumble();
      };
    });
  }

  private buildBoat(ctx: AudioContext, dest: AudioNode): Cleanup {
    return connectLoop(ctx, dest, (out) => {
      const engine = ctx.createOscillator();
      engine.type = "triangle";
      engine.frequency.value = 62;
      const eg = ctx.createGain();
      eg.gain.value = 0.07;
      const wave = ctx.createOscillator();
      wave.frequency.value = 0.18;
      const waveG = ctx.createGain();
      waveG.gain.value = 0.03;
      wave.connect(waveG).connect(out.gain);
      engine.connect(eg).connect(out);
      engine.start();
      wave.start();
      return () => {
        engine.stop();
        wave.stop();
      };
    });
  }

  private buildBus(ctx: AudioContext, dest: AudioNode): Cleanup {
    return connectLoop(ctx, dest, (out) => {
      const idle = ctx.createOscillator();
      idle.type = "sawtooth";
      idle.frequency.value = 105;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 280;
      const g = ctx.createGain();
      g.gain.value = 0.055;
      idle.connect(lp).connect(g).connect(out);
      const shake = this.loopNoise(
        ctx,
        out,
        (src) => {
          const f = ctx.createBiquadFilter();
          f.type = "bandpass";
          f.frequency.value = 180;
          f.Q.value = 1;
          src.connect(f);
          return f;
        },
        0.03,
      );
      idle.start();
      return () => {
        idle.stop();
        shake();
      };
    });
  }

  private buildTrain(ctx: AudioContext, dest: AudioNode): Cleanup {
    return connectLoop(ctx, dest, (out) => {
      const rumble = this.loopNoise(
        ctx,
        out,
        (src) => {
          const lp = ctx.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.value = 400;
          src.connect(lp);
          return lp;
        },
        0.1,
      );
      const clack = () => {
        const g = ctx.createGain();
        g.gain.value = 0;
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
        const o = ctx.createOscillator();
        o.type = "square";
        o.frequency.value = 180 + Math.random() * 40;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 500;
        o.connect(lp).connect(g).connect(out);
        o.start();
        o.stop(ctx.currentTime + 0.08);
      };
      const id = setInterval(clack, 420);
      this.timers.push(id);
      return () => {
        clearInterval(id);
        rumble();
      };
    });
  }
}

export const ambience = new AmbienceEngine();
