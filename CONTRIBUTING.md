# Contributing

Thanks for helping keep the catalog accurate. Submissions are reviewed by maintainers before publication, and every entry must be backed by a public primary source (paper, project page, repository, product page, or press release).

## Suggesting a device or dataset

- **Web UI** — open the *Contribute* tab on the [live catalog](https://commissure-inc.github.io/Awesome-UMI/), fill in the form, and submit the generated JSON as an issue.
- **GitHub Issues** — [add a device](https://github.com/commissure-inc/Awesome-UMI/issues/new?template=add_device.yml) or [request a correction](https://github.com/commissure-inc/Awesome-UMI/issues/new?template=correct_device.yml).

Scope and field-by-field guidance live in the maintainer repository: [contributing guide](https://github.com/commissure-inc/UMI-Data-Collection/blob/main/CONTRIBUTING.md), [ADD_DEVICE.md](https://github.com/commissure-inc/UMI-Data-Collection/blob/main/docs/ADD_DEVICE.md), [SCOPE.md](https://github.com/commissure-inc/UMI-Data-Collection/blob/main/docs/SCOPE.md).

In short, an entry is in scope when it is a device or interface used to collect manipulation demonstrations for robot learning — handheld grippers, hand and arm wearables, and the tactile or force modules built for them. Dedicated egocentric video platforms are out of scope.

## Editing the catalog data

`umi_devices_data.json` is the single source of truth: both the web UI and the list in `README.md` are generated from it. Never edit the generated list sections of `README.md` by hand.

The catalog date shown in the site footer is derived from git at build time, so `metadata.last_updated` in the file does not need to be maintained by hand.

After changing the data, regenerate the README:

```bash
node scripts/generate-readme.mjs
```

To verify that the committed README matches the data — this is what the `README sync` workflow runs on pull requests:

```bash
node scripts/generate-readme.mjs --check
```

The generator rewrites only the regions between the `<!-- BEGIN ... -->` and `<!-- END ... -->` markers. Everything else in `README.md` is edited by hand.

## Web UI changes

```bash
cd web
npm install
npm run dev
```

See [`web/README.md`](web/README.md) for build and preview details.

## License

Contributions to the code are accepted under the [MIT license](LICENSE); contributions to the catalog data are accepted under [CC BY 4.0](LICENSE-DATA.md).
