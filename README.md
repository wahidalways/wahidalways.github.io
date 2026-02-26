# Md. Wahiduzzaman Nayem — Portfolio

Personal portfolio website for **Md. Wahiduzzaman Nayem**, Technical Business Analyst.

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/) for animations

## Run Locally

```sh
npm install
npm run dev            # starts Vite; browser will open automatically
# alternatively, you can force a browser launch via CLI:
# npx vite --open
```
Open [http://localhost:8080](http://localhost:8080).

## Build for Production

```sh
npm run build
```

Output goes to the `dist/` folder.

## Deploy to GitHub Pages

Deployment is automated via GitHub Actions on every push to `main`.

**One-time setup:**
1. Push this repo to GitHub as `<username>.github.io` for a root user-site.
2. Go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. Push to `main` — the site deploys automatically.

---

### Maintenance

The project uses a [browserslist](https://github.com/browserslist/browserslist) configuration for autoprefixing and polyfills. To update the local caniuse database without worrying about `bun` or other runtime peculiarities, we now ship a small helper that simply installs the latest `caniuse-lite` package.

Run either command below – they both invoke the same Node script which calls `npm install caniuse-lite@latest`:

```bash
npm run update:browserslist
# or
node scripts/update-browserslist.js
```

You can run the Node form directly if you ever find that `npm` is being blocked by PowerShell execution policies; adjusting the policy (`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`) or using a different shell will also let the `npm` command work.
