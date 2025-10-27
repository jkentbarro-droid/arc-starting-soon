# ARC Raiders Starting Soon Overlay

Vercel-ready React + Tailwind + Framer Motion overlay with glitch, static, siren, sparks, and smoke.

## Dev
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
```

## URL Params
- `freq` seconds between glitches (default 10)
- `dur` glitch duration (seconds if < 20, else ms)
- `int` intensity 0..2
- `smoke` 0..20 wisps
- `sparks` 0..20 arcs
- `static` MP3 URL for static burst
- `siren` MP3 URL for siren

Example:
```
https://your-deploy-url.vercel.app/?freq=6&dur=1.2&int=1.4&sparks=10&smoke=10&static=https://.../static.mp3&siren=https://.../siren.mp3
```

## StreamElements
Add an iframe Custom Widget pointing at your Vercel URL. Enable autoplay.
