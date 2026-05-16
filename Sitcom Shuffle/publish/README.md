# Sitcom Shuffle Publish Folder

This folder is the clean GitHub Pages version of the app.

Upload this folder to GitHub and set GitHub Pages to publish from:

```text
main / publish
```

The important file is:

```text
index.html
```

When the app changes, rebuild locally:

```bash
node scripts/build-standalone.mjs
```

Then upload the updated `publish/index.html` to GitHub.
