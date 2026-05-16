import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appDir = join(scriptDir, "..");

const htmlPath = join(appDir, "src", "index.template.html");
const cssPath = join(appDir, "src", "styles.css");
const jsPath = join(appDir, "src", "app.js");
const csvPath = join(appDir, "data", "episodes.csv");
const outputPath = join(appDir, "open-app.html");
const indexOutputPath = join(appDir, "index.html");
const publishDir = join(appDir, "publish");
const publishOutputPath = join(publishDir, "index.html");

const [html, css, js, csv] = await Promise.all([
  readFile(htmlPath, "utf8"),
  readFile(cssPath, "utf8"),
  readFile(jsPath, "utf8"),
  readFile(csvPath, "utf8")
]);

const standalone = html
  .replace('<link rel="stylesheet" href="src/styles.css">', `<style>\n${css}\n</style>`)
  .replace(
    `<script>\n      window.EPISODE_CSV = null;\n    </script>\n    <script src="src/app.js"></script>`,
    `<script>\n      window.EPISODE_CSV = ${JSON.stringify(csv)};\n    </script>\n    <script>\n${js}\n    </script>`
  );

await mkdir(publishDir, { recursive: true });

await Promise.all([
  writeFile(outputPath, standalone, "utf8"),
  writeFile(indexOutputPath, standalone, "utf8"),
  writeFile(publishOutputPath, standalone, "utf8")
]);

console.log(`Built ${outputPath}`);
console.log(`Built ${indexOutputPath}`);
console.log(`Built ${publishOutputPath}`);
