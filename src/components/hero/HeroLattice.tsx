import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

/*
 * The hero abstract: a slow "signal lattice" — nodes drift, links form between
 * the ones close enough to see each other, and packets of light travel the
 * links. It is the one visual on the page that states what the job is
 * (scattered signals -> connections -> flow) without drawing a literal
 * flowchart icon.
 *
 * Canvas rather than DOM: the link set is O(n^2) and changes every frame, so
 * forty-odd absolutely positioned divs would mean forty-odd style writes per
 * frame from the main thread. One canvas draws the whole field in a single
 * pass.
 */

type RGB = [number, number, number];

const hslToRgb = (h: number, s: number, l: number): RGB => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = ((((h % 360) + 360) % 360) / 60);
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r, g, b] =
    hp < 1 ? [c, x, 0] :
    hp < 2 ? [x, c, 0] :
    hp < 3 ? [0, c, x] :
    hp < 4 ? [0, x, c] :
    hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = l - c / 2;
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
};

/*
 * The palette is user switchable at runtime (ten presets, plus light/dark) and
 * every one of them lives in a CSS custom property. Canvas cannot read
 * `var(--primary)` — a colour string handed to fillStyle is parsed in isolation,
 * with no element to cascade from — so the tokens are resolved to numbers here
 * and re-resolved whenever the theme changes.
 */
const readHslVar = (name: string, fallback: RGB): RGB => {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parts = raw.match(/(-?[\d.]+)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);
  if (!parts) return fallback;
  return hslToRgb(Number(parts[1]), Number(parts[2]) / 100, Number(parts[3]) / 100);
};

const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a})`;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Hubs draw larger and anchor more links — they keep the field from reading as uniform noise. */
  hub: boolean;
  /** 0..1 pointer proximity, eased over time so nothing pops. */
  lit: number;
}

interface Packet {
  from: number;
  to: number;
  t: number;
  speed: number;
}

const POINTER_DIST = 190;
const MAX_DPR = 2;

/*
 * Link radius is a fraction of the field, not a constant: 168px across a 1440px
 * desktop is a local connection, but across a 375px phone it is half the screen,
 * and the same lattice turns into a solid web behind the headline.
 */
const linkDistFor = (w: number) => (w < 640 ? Math.max(76, w * 0.26) : 168);

const HeroLattice = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Theme id and palette id both land in the deps: a change to either rewrites
  // the custom properties this canvas samples.
  const { theme, colorTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;

    const primary = readHslVar("--primary", [37, 99, 235]);
    const accent = readHslVar("--accent", [20, 184, 166]);
    const isDark = document.documentElement.classList.contains("dark");

    // Ink on a light background needs far more alpha than light on a dark one
    // to read at the same weight; one set of alphas cannot serve both.
    const A = isDark
      ? { link: 0.17, node: 0.5, hub: 0.75, packet: 0.85, glow: 0.1 }
      : { link: 0.14, node: 0.34, hub: 0.52, packet: 0.55, glow: 0.06 };

    /*
     * On a phone the copy runs the full width of the field, so every link
     * crosses text rather than empty margin. The same alphas that read as
     * ambient on a desktop read as clutter there.
     */
    const fade = window.innerWidth < 640 ? 0.7 : 1;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let raf = 0;
    let last = 0;
    let running = true;
    let linkDist = linkDistFor(0);

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    const seed = () => {
      // Count is derived from the link radius rather than from area alone, so
      // the lattice keeps the same connectivity — the same number of links per
      // node — on a phone as on an ultrawide. Area alone gave a phone a handful
      // of nodes too far apart to link at all.
      const spacing = linkDist * 0.95;
      const count = Math.round(
        Math.min(50, Math.max(16, (width * height) / (spacing * spacing))),
      );
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 9,
        hub: i % 7 === 0,
        lit: 0,
      }));
      packets = Array.from({ length: Math.max(3, Math.round(count / 9)) }, () => ({
        from: Math.floor(Math.random() * count),
        to: Math.floor(Math.random() * count),
        t: Math.random(),
        speed: 0.12 + Math.random() * 0.16,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Links first, under everything.
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDist * linkDist) continue;
          const falloff = 1 - Math.sqrt(d2) / linkDist;
          const lit = Math.max(a.lit, b.lit);
          ctx.strokeStyle = rgba(lit > 0.02 ? accent : primary, A.link * fade * falloff * (1 + lit * 2.6));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Packets: a short comet along the link, so direction of flow is readable.
      for (const p of packets) {
        const a = nodes[p.from];
        const b = nodes[p.to];
        if (!a || !b) continue;
        if (Math.hypot(b.x - a.x, b.y - a.y) > linkDist * 1.35) continue;
        const eased = p.t * p.t * (3 - 2 * p.t);
        const hx = a.x + (b.x - a.x) * eased;
        const hy = a.y + (b.y - a.y) * eased;
        const tail = Math.max(0, eased - 0.16);
        const tx = a.x + (b.x - a.x) * tail;
        const ty = a.y + (b.y - a.y) * tail;
        const grad = ctx.createLinearGradient(tx, ty, hx, hy);
        grad.addColorStop(0, rgba(accent, 0));
        grad.addColorStop(1, rgba(accent, A.packet));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.fillStyle = rgba(accent, A.packet);
        ctx.beginPath();
        ctx.arc(hx, hy, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes on top. Hubs breathe on periods offset by index, so the pulses
      // never visibly line up with each other.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const breathe = n.hub ? 1 + Math.sin(t / 1900 + i) * 0.22 : 1;
        const r = (n.hub ? 2.6 : 1.5) * breathe + n.lit * 2;
        const color = n.lit > 0.02 ? accent : primary;

        if (n.hub || n.lit > 0.02) {
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 7);
          glow.addColorStop(0, rgba(color, A.glow * (1 + n.lit * 4)));
          glow.addColorStop(1, rgba(color, 0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = rgba(color, (n.hub ? A.hub : A.node) * fade * (1 + n.lit));
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextW = Math.max(1, rect.width);
      const nextH = Math.max(1, rect.height);
      dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

      // Rescale rather than reseed: a window drag fires this continuously, and
      // reseeding would make the whole field flicker.
      if (nodes.length && width > 0 && height > 0) {
        const sx = nextW / width;
        const sy = nextH / height;
        for (const n of nodes) {
          n.x *= sx;
          n.y *= sy;
        }
      }

      width = nextW;
      height = nextH;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // A width change that moves the link radius invalidates the node count
      // the field was seeded with, so reseed then — and only then. A plain
      // window drag keeps the field and just rescales it above.
      const nextLink = linkDistFor(width);
      if (!nodes.length || Math.abs(nextLink - linkDist) > 1) {
        linkDist = nextLink;
        seed();
      }
      if (reduced) draw(0);
    };

    /** Nearest neighbour a packet can hop to next, so flow follows real links. */
    const nextHop = (from: number, avoid: number) => {
      const candidates: number[] = [];
      const a = nodes[from];
      for (let i = 0; i < nodes.length; i++) {
        if (i === from || i === avoid) continue;
        const dx = nodes[i].x - a.x;
        const dy = nodes[i].y - a.y;
        if (dx * dx + dy * dy < linkDist * linkDist) candidates.push(i);
      }
      if (!candidates.length) return Math.floor(Math.random() * nodes.length);
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const update = (dt: number) => {
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 6);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 6);

      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;

        // Bounce off the edges instead of wrapping: a node teleporting across
        // the field snaps every link it owns, which is very visible even at
        // this link opacity.
        if (n.x < 0) { n.x = 0; n.vx *= -1; }
        if (n.x > width) { n.x = width; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; }
        if (n.y > height) { n.y = height; n.vy *= -1; }

        const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        const target = pointer.active && d < POINTER_DIST ? 1 - d / POINTER_DIST : 0;
        n.lit += (target - n.lit) * Math.min(1, dt * 5);
      }

      for (const p of packets) {
        p.t += p.speed * dt;
        while (p.t >= 1) {
          p.t -= 1;
          const prev = p.from;
          p.from = p.to;
          p.to = nextHop(p.from, prev);
          p.speed = 0.12 + Math.random() * 0.16;
        }
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      // Clamped, so a backgrounded tab returning does not integrate one huge
      // step and scatter the field.
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      update(dt);
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.active = true;
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    // Off screen and hidden tab both cost nothing: the hero is a full viewport
    // tall, so on a long page this loop would otherwise run for the whole visit.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !document.hidden;
        if (running) start(); else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) start(); else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (finePointer && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    if (reduced) draw(0); else start();

    return () => {
      stop();
      observer.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [theme, colorTheme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
    />
  );
};

export default HeroLattice;
