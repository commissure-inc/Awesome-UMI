# Awesome UMI — Web UI

Vite + React static UI for the device catalog. Bundles `umi_devices_data.json` from the parent directory at build time.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173/Awesome-UMI/` (same base path as GitHub Pages).

## Production build

```bash
npm run build
```

GitHub Actions sets the base path automatically via `GITHUB_REPOSITORY`. To replicate locally:

```bash
VITE_BASE_PATH=/Awesome-UMI/ npm run build
npm run preview
```

Output is written to `dist/`, which is deployed by the GitHub Pages workflow.
