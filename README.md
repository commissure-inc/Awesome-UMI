# Awesome UMI

[![Deploy GitHub Pages](https://github.com/commissure-inc/Awesome-UMI/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/commissure-inc/Awesome-UMI/actions/workflows/deploy-pages.yml)

A public catalog for exploring and comparing **UMI-style tactile and motion data-collection devices** — handheld grippers, hand/arm wearables, and more.

## Live site

**https://commissure-inc.github.io/Awesome-UMI/**

A static Web UI hosted on GitHub Pages. Device data is bundled at build time from [`umi_devices_data.json`](umi_devices_data.json).

## Repository contents

| Path | Description |
|------|-------------|
| [`web/`](web/) | Vite + React catalog UI |
| [`umi_devices_data.json`](umi_devices_data.json) | Catalog data (CC BY 4.0) |
| [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) | GitHub Pages auto-deploy |

## Contributing

We welcome new device submissions and corrections.

- **Web UI** — Use the *Contribute* tab on the live site to generate a submission JSON.
- **GitHub Issues** — [Add a device](https://github.com/commissure-inc/Awesome-UMI/issues/new?template=add_device.yml) / [Request a correction](https://github.com/commissure-inc/Awesome-UMI/issues/new?template=correct_device.yml)

All submissions are reviewed before publication.

## Local development

```bash
cd web
npm install
npm run dev
```

To preview with the same base path as GitHub Pages:

```bash
cd web
VITE_BASE_PATH=/Awesome-UMI/ npm run build
npm run preview
```

## License

| Scope | License |
|-------|---------|
| Code (`web/`) | [MIT](LICENSE) |
| Catalog data (`umi_devices_data.json`) | [CC BY 4.0](LICENSE-DATA.md) |

## Citation

If you use the catalog data, please follow the attribution example in [LICENSE-DATA.md](LICENSE-DATA.md).

## Maintainer

[commissure, inc.](https://commissure.co.jp/)
