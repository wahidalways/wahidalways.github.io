/**
 * One-off authoring step, not part of the build.
 *
 * Emits every derived image the site serves:
 *   - the hero avatar at the two sizes the layout actually uses (1x and 2x),
 *     in WebP with a JPEG fallback
 *   - a re-encoded square portrait, still referenced by the JSON-LD
 *   - a 1200x630 Open Graph card
 *
 * `sharp` is deliberately NOT a dependency — the outputs are committed, so
 * neither the build nor CI needs it. Run it only when the source photo changes:
 *
 *   npm install --no-save sharp
 *   npm run optimize:images
 */
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// The pristine photo lives outside public/ so it is never deployed and never
// re-compressed by this script — running it twice produces identical output.
const SOURCE = resolve(root, "assets/profile-source.jpg");

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("sharp is not installed. Run: npm install --no-save sharp");
  process.exit(1);
}

if (!existsSync(SOURCE)) {
  console.error(`Missing source image: ${SOURCE}`);
  process.exit(1);
}

const kb = (file) => `${(statSync(file).size / 1024).toFixed(0)} KB`;

const source = readFileSync(SOURCE);
const outputs = [];

/* ---------------------------------------------------------------- avatar -- */

// 240 is the widest the avatar is ever laid out (lg:w-60); 480 covers 2x.
const HERO_WIDTHS = [240, 480];

for (const width of HERO_WIDTHS) {
  const base = sharp(source).resize(width, width, { fit: "cover", position: "attention" });

  const webp = resolve(root, `public/profile-${width}.webp`);
  await base.clone().webp({ quality: 82, effort: 6 }).toFile(webp);
  outputs.push(webp);

  const jpg = resolve(root, `public/profile-${width}.jpg`);
  await base.clone().jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(jpg);
  outputs.push(jpg);
}

/* -------------------------------------------------------------- portrait -- */

const portrait = resolve(root, "public/profile.jpg");
writeFileSync(
  portrait,
  await sharp(source)
    .resize(1080, 1080, { fit: "cover" })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toBuffer(),
);
outputs.push(portrait);

/* -------------------------------------------------------------- og card -- */

/*
 * 1200x630 is what LinkedIn, X and Facebook crop to for a large-image card.
 * The old card was the 1:1 portrait, which every one of them centre-cropped
 * into a band across the face.
 *
 * Colours are the dark theme with the default crimson preset, resolved to hex
 * because the renderer here has no stylesheet to read custom properties from.
 */
const OG = {
  width: 1200,
  height: 630,
  bg: "#0b0e13",
  surface: "#141922",
  fg: "#f0f2f5",
  muted: "#9aa4b2",
  primary: "#dc2828",
  accent: "#e85e30",
};

const AVATAR = 300;
const FONT = "DejaVu Sans, Verdana, Arial, Helvetica, sans-serif";

const avatarMask = Buffer.from(
  `<svg width="${AVATAR}" height="${AVATAR}" xmlns="http://www.w3.org/2000/svg">
     <circle cx="${AVATAR / 2}" cy="${AVATAR / 2}" r="${AVATAR / 2}" fill="#fff"/>
   </svg>`,
);

const avatar = await sharp(source)
  .resize(AVATAR, AVATAR, { fit: "cover", position: "attention" })
  .composite([{ input: avatarMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const card = Buffer.from(
  `<svg width="${OG.width}" height="${OG.height}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stop-color="${OG.bg}"/>
         <stop offset="100%" stop-color="${OG.surface}"/>
       </linearGradient>
       <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0%" stop-color="${OG.primary}"/>
         <stop offset="100%" stop-color="${OG.accent}"/>
       </linearGradient>
     </defs>

     <rect width="${OG.width}" height="${OG.height}" fill="url(#bg)"/>
     <rect width="${OG.width}" height="8" fill="url(#rule)"/>
     <circle cx="1010" cy="315" r="176" fill="none" stroke="${OG.primary}" stroke-width="2" opacity="0.35"/>
     <circle cx="1010" cy="315" r="196" fill="none" stroke="${OG.accent}" stroke-width="1" stroke-dasharray="4 10" opacity="0.25"/>

     <text x="80" y="196" font-family="${FONT}" font-size="22" font-weight="bold"
           letter-spacing="6" fill="${OG.accent}">PORTFOLIO</text>

     <text x="80" y="278" font-family="${FONT}" font-size="58" font-weight="bold" fill="${OG.fg}">Md. Wahiduzzaman</text>
     <text x="80" y="346" font-family="${FONT}" font-size="58" font-weight="bold" fill="${OG.fg}">Nayem</text>

     <rect x="80" y="382" width="86" height="4" rx="2" fill="url(#rule)"/>

     <text x="80" y="440" font-family="${FONT}" font-size="32" fill="${OG.accent}">Technical Business Analyst</text>
     <text x="80" y="486" font-family="${FONT}" font-size="23" fill="${OG.muted}">Requirements engineering &#183; Process optimization</text>
     <text x="80" y="530" font-family="${FONT}" font-size="23" fill="${OG.muted}">Dhaka, Bangladesh</text>
   </svg>`,
);

const ogPath = resolve(root, "public/og-image.jpg");
writeFileSync(
  ogPath,
  await sharp(card)
    .composite([{ input: avatar, top: 315 - AVATAR / 2, left: 1010 - AVATAR / 2 }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer(),
);
outputs.push(ogPath);

/* ---------------------------------------------------------------- report -- */

console.log("Generated:");
for (const file of outputs) {
  console.log(`  ${file.replace(root, ".")}  ${kb(file)}`);
}
