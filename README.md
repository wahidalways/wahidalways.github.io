# Md. Wahiduzzaman Nayem: Portfolio

Personal portfolio website for **Md. Wahiduzzaman Nayem**, Technical Business Analyst.
Live at [wahidalways.github.io](https://wahidalways.github.io).

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for animation, [sonner](https://sonner.emilkowal.ski/) for toasts

Runtime dependencies are deliberately kept to five. There is no router (the site
is a single page on a static host) and no data layer.

## Run Locally

```sh
npm install
npm run dev          # http://localhost:8080
npm test             # jsdom render smoke test
npm run lint
```

## Build

```sh
npm run build        # output in dist/
npm run preview
```

## Conventions worth knowing

**Animation.** Ambient, infinitely-looping decoration is plain CSS keyframes in
`src/index.css` (`.anim-loop` plus a `--dur` / `--delay` per element) so it runs
on the compositor and gets throttled off-screen. Framer Motion is reserved for
one-shot entrances and gestures, and is loaded through `LazyMotion` with the
`domAnimation` feature set, so components must be written as `<m.div>`, never
`<motion.div>`. `strict` mode throws on the latter to keep it that way.

**Theming.** The light/dark class and the ten colour presets are applied by an
inline script in `index.html` before first paint. Its palette table mirrors
`colorThemes` in `src/components/ThemeProvider.tsx`, **change both together**,
or the page will flash the wrong colour on load.

**Contact form.** By default the form hands the message to the visitor's mail
client, which does nothing at all for someone on webmail and leaves you no
record of who tried to reach you. Point `VITE_CONTACT_ENDPOINT` (see
`.env.example`) at any backend that accepts a JSON POST (Formspree, Web3Forms,
Basin) and it submits in place instead. Vite inlines `VITE_*` at build time, so
only ever put a public endpoint there.

**Images.** `assets/profile-source.jpg` is the pristine original and is never
deployed. Everything the page serves (the avatar sizes, the square portrait and
the 1200x630 Open Graph card) is generated from it and committed:

```sh
npm install --no-save sharp
npm run optimize:images
```

The generated `srcSet` in `src/components/Hero.tsx` and the `<link rel="preload">`
in `index.html` list the same candidates: keep them in step, or the browser
fetches the avatar twice.

**SEO.** `index.html` carries the canonical URL, Open Graph and Twitter cards,
and a `Person` JSON-LD block; `public/sitemap.xml` is referenced from
`public/robots.txt`. All of them hardcode `https://wahidalways.github.io/`:
update every one together if the domain ever changes.

**404s.** GitHub Pages serves `public/404.html` for unknown paths before any JS
runs. It is intentionally standalone: it cannot reference the hashed build
assets, since those names change on every deploy.

## Deploy

Automated via GitHub Actions on every push to `main` (`.github/workflows/deploy.yml`).

One-time setup: **Settings → Pages → Source → GitHub Actions**.

## Maintenance

Refresh the [browserslist](https://github.com/browserslist/browserslist) data
when the build warns that `caniuse-lite` is stale:

```sh
npm run update:browserslist
```
