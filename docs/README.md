# Sitcom Shuffle Docs Folder

This folder is for GitHub Pages when GitHub only offers `/root` or `/docs`.

Use this GitHub Pages setting:

```text
Branch: main
Folder: /docs
```

The important file is:

```text
index.html
```

When the app changes, rebuild locally:

```bash
node scripts/build-standalone.mjs
```

Then upload the updated `docs/index.html` to GitHub.
