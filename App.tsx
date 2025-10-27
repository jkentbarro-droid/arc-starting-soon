import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const ArcInspiredLogo: React.FC<{ size?: number }> = ({ size = 220 }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200  200"
      className="drop-shadow-[0_0_30px_rgba(0,255,255,0.45)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        style={{ originX: '100px', originY: '100px' }}
      >
        <circle cx="100" cy="100" r="86" fill="none" stroke="#00ffff" strokeWidth="2" opacity="0.4" />
        <path d="M100,14 A86,86 0 0,1 186,100" fill="none" stroke="#00ffff" strokeWidth="4" />
        <path d="M14,100 A86,86 0 0,1 100,14" fill="none" stroke="#00ffff" strokeWidth="4" />
      </motion.g>
      <motion.path
        d="M55,120 A45,45 0 0,1 145,120"
        fill="none"
        stroke="#a9fffd"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        opacity="1"
      />
    </motion.svg>
  );
};

const SmokeBackground: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const wisps = useMemo(() => (
    Array.from({ length: count }).map((_, i) => ({
      left: `${10 + (i * (80 / Math.max(1, count - 1))) + (i % 2 ? 4 : -4)}%`,
      delay: `${i * 1.2}s`,
      duration: `${10 + (i % 3) * 3}s`,
      size: `${70 + (i % 4) * 20}px`,
      opacity: 0.08 + (i % 3) * 0.03,
    }))
  ), [count]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
      {wisps.map((w, idx) => (
        <div
          key={idx}
          className="absolute bottom-[-80px] rounded-full blur-2xl"
          style={{
            left: w.left,
            width: w.size,
            height: w.size,
            background: 'radial-gradient(circle, rgba(200,200,200,0.35) 0%, rgba(200,200,200,0.15) 40%, rgba(200,200,200,0) 70%)',
            animation: `smokeRise ${w.duration} linear ${w.delay} infinite`,
            opacity: w.opacity,
          }}
        />
      ))}
    </div>
  );
};

const ElectricArcs: React.FC<{ count?: number; intensity?: number }> = ({ count = 3, intensity = 1 }) => {
  const arcs = useMemo(() => {
    const makeArc = (seed: number) => {
      const rand = (n: number) => Math.sin(seed * 999 + n) * 0.5 + 0.5;
      const points: Array<[number, number]> = [];
      const y = 20 + Math.floor(rand(1) * 60);
      const x0 = Math.floor(rand(2) * 15);
      const segments = 6 + Math.floor(rand(3) * 5);
      for (let i = 0; i <= segments; i++) {
        const x = x0 + i * (70 / segments) + (rand(4 + i) - 0.5) * (8 + 12 * intensity);
        const yy = y + (rand(5 + i) - 0.5) * (12 + 10 * intensity);
        points.push([x, yy]);
      }
      return points;
    };
    return Array.from({ length: count }).map((_, idx) => makeArc(idx + 1));
  }, [count, intensity]);

  return (
    <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
      {arcs.map((pts, i) => (
        <polyline
          key={i}
          points={pts.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke="#bffcff"
          strokeWidth={0.6 + 0.2 * intensity}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[filter:drop-shadow(0_0_6px_rgba(0,255,255,.8))]"
        >
          <animate attributeName="stroke-opacity" values="0;1;0" dur={`${0.2 + 0.1 * intensity}s`} begin={`${0.05 * i}s`} repeatCount="1" />
          <animate attributeName="stroke-dasharray" values="0,200;20,200;0,200" dur={`${0.2 + 0.1 * intensity}s`} begin={`${0.05 * i}s`} repeatCount="1" />
        </polyline>
      ))}
      {Array.from({ length: Math.max(6, Math.floor(6 + 6 * intensity)) }).map((_, i) => (
        <circle key={`s${i}`} cx={(i * 11 + 7) % 100} cy={(i * 17 + 23) % 100} r={`${0.7 + 0.2 * intensity}`}
          fill="#e8ffff">
          <animate attributeName="opacity" values="0;1;0" dur={`${0.14 + 0.08 * intensity}s`} begin={`${0.07 * i}s`} repeatCount="1" />
        </circle>
      ))}
    </svg>
  );
};

const GlitchStinger: React.FC<{ intervalMs?: number; durationMs?: number; staticUrl?: string | null; sirenUrl?: string | null; intensity?: number; sparkCount?: number }> = ({ intervalMs = 10000, durationMs = 1000, staticUrl = null, sirenUrl = null, intensity = 1, sparkCount = 3 }) => {
  const [active, setActive] = useState(false);
  const amp = 0.5 + intensity * 1.5;
  const slices = Math.max(10, Math.floor(10 + 20 * intensity));

  const noiseStyle = useMemo(() => ({
    backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,${0.06 + 0.04 * intensity}) 0px, rgba(255,255,255,${0.06 + 0.04 * intensity}) 1px, transparent 1px, transparent 2px), repeating-linear-gradient(90deg, rgba(255,255,255,${0.02 + 0.02 * intensity}) 0px, rgba(255,255,255,${0.02 + 0.02 * intensity}) 1px, transparent 1px, transparent 2px)`,
    filter: `blur(${0.6 + 0.3 * intensity}px) contrast(${170 + 20 * intensity}%) brightness(${115 + 10 * intensity}%)`,
    animation: 'noiseShift 120ms infinite steps(2), grainWiggle 600ms infinite linear',
    opacity: 0.45 + 0.1 * intensity,
    mixBlendMode: 'lighten' as const,
  }), [intensity]);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(true);
      playStatic(durationMs, staticUrl);
      playSiren(durationMs, sirenUrl);
      setTimeout(() => setActive(false), durationMs);
    }, Math.max(500, intervalMs));
    return () => clearInterval(id);
  }, [intervalMs, durationMs, staticUrl, sirenUrl]);

  if (!active) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.9, 0], x: [0, -30 * amp, 25 * amp, 0], skewX: [0, 18 * amp, -12 * amp, 0], scale: [1, 1 + 0.05 * amp, 1 - 0.05 * amp, 1] }}
      transition={{ duration: durationMs / 1000, ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute inset-0 bg-white mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 0] }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ filter: `invert(1) brightness(${1.4 + 0.3 * intensity})` }}
      />
      <div className="absolute inset-0" style={noiseStyle as React.CSSProperties} />
      <motion.div
        className="absolute inset-0"
        style={{ filter: 'contrast(150%) brightness(120%)' }}
        animate={{ x: [-12 * amp, 14 * amp, -18 * amp, 0], y: [6 * amp, -6 * amp, 12 * amp, 0], opacity: [0.5, 1, 0.6, 0.8] }}
        transition={{ duration: durationMs / 1000, repeat: 1, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000]/20 via-transparent to-[#00ffff]/20 mix-blend-overlay" />
      </motion.div>
      <motion.div
        className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60"
        animate={{ x: ['-30%', '130%'] }}
        transition={{ duration: durationMs / 1000, ease: 'easeInOut' }}
      />
      {Array.from({ length: slices }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 bg-white/40"
          style={{ top: `${i * (100 / slices)}%`, height: '3px', mixBlendMode: 'overlay' as const }}
          animate={{ x: [0, (i % 2 ? -1 : 1) * (60 + 40 * intensity), 0] }}
          transition={{ duration: (durationMs / 1000) * 0.8, ease: 'easeInOut' }}
        />
      ))}
      <ElectricArcs count={sparkCount} intensity={intensity} />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.2, 0], scale: [1, 1 + 0.1 * amp, 1 - 0.02 * amp, 1], rotate: [0, 1 * amp, -1 * amp, 0] }}
        transition={{ duration: Math.min(0.8, 0.5 + 0.2 * intensity), ease: 'easeInOut' }}
      >
        <span className="px-6 py-3 text-5xl md:text-6xl font-extrabold tracking-[0.4em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#ff0000] via-[#ff4040] to-[#ff0000] drop-shadow-[0_0_30px_#ff0000aa] outline outline-2 outline-[#ff4040]/80 animate-pulse">
          NO SIGNAL
        </span>
      </motion.div>
    </motion.div>
  );
};

function playStatic(durationMs: number, audioUrl?: string | null) {
  const el = document.getElementById('glitch-audio') as HTMLAudioElement | null;
  if (audioUrl && el) {
    try {
      el.currentTime = 0;
      el.volume = 0.3;
      el.play().catch(() => {});
      setTimeout(() => { try { el.pause(); el.currentTime = 0; } catch {} }, durationMs);
      return;
    } catch {}
  }
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    (window as any)._audioCtx = (window as any)._audioCtx || new Ctx();
    const audioCtx = (window as any)._audioCtx as AudioContext;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource();
    src.buffer = noiseBuffer;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.25;
    src.connect(gain).connect(audioCtx.destination);
    src.start();
    src.stop(audioCtx.currentTime + durationMs / 1000);
  } catch {}
}

function playSiren(durationMs: number, audioUrl?: string | null) {
  const el = document.getElementById('siren-audio') as HTMLAudioElement | null;
  if (audioUrl && el) {
    try {
      el.currentTime = 0;
      el.volume = 0.22;
      el.play().catch(() => {});
      setTimeout(() => { try { el.pause(); el.currentTime = 0; } catch {} }, durationMs);
      return;
    } catch {}
  }
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    (window as any)._audioCtx = (window as any)._audioCtx || new Ctx();
    const ctx = (window as any)._audioCtx as AudioContext;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = 680;
    lfo.type = 'sine';
    lfo.frequency.value = 4;
    lfoGain.gain.value = 220;

    lfo.connect(lfoGain).connect(osc.frequency);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    osc.start();
    lfo.start();
    osc.stop(ctx.currentTime + durationMs / 1000 + 0.02);
    lfo.stop(ctx.currentTime + durationMs / 1000 + 0.02);
  } catch {}
}

export default function ArcRaidersStartingSoon() {
  const [staticUrl, setStaticUrl] = useState<string | null>(null);
  const [sirenUrl, setSirenUrl] = useState<string | null>(null);
  const [intervalMs, setIntervalMs] = useState<number>(10000);
  const [durationMs, setDurationMs] = useState<number>(1000);
  const [intensity, setIntensity] = useState<number>(1);
  const [smokeCount, setSmokeCount] = useState<number>(8);
  const [sparkCount, setSparkCount] = useState<number>(3);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'arc-noise-keyframes';
    style.textContent = `
      @keyframes noiseShift {0%{background-position:0 0,0 0;}100%{background-position:100px 100px,-120px 80px;}}
      @keyframes grainWiggle {0%{filter:blur(0.8px) contrast(180%) brightness(120%);}50%{filter:blur(1px) contrast(200%) brightness(130%);}100%{filter:blur(0.8px) contrast(180%) brightness(120%);}}
      @keyframes smokeRise {0%{transform:translateY(0) scale(1); opacity:.0}20%{opacity:.25}80%{opacity:.1}100%{transform:translateY(-160%) scale(1.3); opacity:0}}
    `;
    if (!document.getElementById(style.id)) document.head.appendChild(style);

    try {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('static');
      const sir = params.get('siren');
      const freq = params.get('freq');
      const dur = params.get('dur');
      const int = params.get('int');
      const smoke = params.get('smoke');
      const sparks = params.get('sparks');

      if (s) setStaticUrl(s);
      if (sir) setSirenUrl(sir);

      if (freq) {
        const sec = Math.max(1, Math.min(120, parseFloat(freq)));
        if (!Number.isNaN(sec)) setIntervalMs(sec * 1000);
      }
      if (dur) {
        let d = parseFloat(dur);
        if (!Number.isNaN(d)) {
          if (d < 20) d = d * 1000;
          setDurationMs(Math.max(200, Math.min(4000, d)));
        }
      }
      if (int) {
        const v = Math.max(0, Math.min(2, parseFloat(int)));
        if (!Number.isNaN(v)) setIntensity(v);
      }
      if (smoke) {
        const c = Math.max(0, Math.min(20, parseInt(smoke)));
        if (!Number.isNaN(c)) setSmokeCount(c);
      }
      if (sparks) {
        const c2 = Math.max(0, Math.min(20, parseInt(sparks)));
        if (!Number.isNaN(c2)) setSparkCount(c2);
      }
    } catch {}

    const unlock = () => {
      try {
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (Ctx) {
          (window as any)._audioCtx = (window as any)._audioCtx || new Ctx();
          const ctx = (window as any)._audioCtx as AudioContext;
          if (ctx.state === 'suspended') ctx.resume();
        }
        const el1 = document.getElementById('glitch-audio') as HTMLAudioElement | null;
        const el2 = document.getElementById('siren-audio') as HTMLAudioElement | null;
        [el1, el2].forEach(el => { if (el) { el.muted = True; el.play().catch(() => {}).finally(() => { el.pause(); el.currentTime = 0; el.muted = False; }); } });
      } catch {}
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      <audio id="glitch-audio" src={staticUrl ?? ''} preload="auto" />
      <audio id="siren-audio" src={sirenUrl ?? ''} preload="auto" />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#121212] to-[#1c1c1c] animate-pulse" />
      <motion.div
        className="absolute inset-0 opacity-20 bg-[url('https://arcraiders.com/static/media/bg.1b02c02b.jpg')] bg-cover bg-center"
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.h1
        className="absolute top-1/3 w-full text-center text-6xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#7ffcff] via-[#00ffe0] to-[#49ffd7] drop-shadow-[0_0_18px_#00fff066]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        STREAM STARTING SOON
      </motion.h1>

      <motion.p
        className="absolute top-[45%] w-full text-center text-lg text-gray-400 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        Transmission link unstable... recalibrating feed
      </motion.p>

      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_2px,transparent_2px,transparent_4px)] mix-blend-overlay animate-[scroll_2s_linear_infinite]" />

      <motion.div className="absolute bottom-10 w-full flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <motion.div
          className="w-3/4 h-1 bg-gradient-to-r from-transparent via-[#00ffff] to-transparent"
          animate={{ scaleX: [0.5, 1.2, 0.5], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: [0.9, 1, 0.98, 1], opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <ArcInspiredLogo />
      </motion.div>

      <SmokeBackground count={smokeCount} />

      <GlitchStinger intervalMs={intervalMs} durationMs={durationMs} staticUrl={staticUrl} sirenUrl={sirenUrl} intensity={intensity} sparkCount={sparkCount} />
    </div>
  );
}
