import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appDir = join(scriptDir, "..");
const csvPath = join(appDir, "data", "episodes.csv");

const expectedHeaders = ["show", "season", "episode", "title", "description"];
const csvText = await readFile(csvPath, "utf8");
const lines = csvText.trim().split(/\r?\n/);
const headers = parseCsvLine(lines.shift() || "");
const rows = lines.map((line, index) => ({
  lineNumber: index + 2,
  values: parseCsvLine(line)
}));

const warnings = [];
const seenEpisodes = new Set();
const counts = new Map();

if (headers.join(",") !== expectedHeaders.join(",")) {
  warnings.push(`Header row should be: ${expectedHeaders.join(",")}`);
}

for (const row of rows) {
  const record = toRecord(row.values);
  const rowLabel = `row ${row.lineNumber}`;

  if (row.values.length !== expectedHeaders.length) {
    warnings.push(`${rowLabel}: expected ${expectedHeaders.length} columns, found ${row.values.length}`);
  }

  if (!record.show) {
    warnings.push(`${rowLabel}: missing show name`);
  }

  if (!record.title) {
    warnings.push(`${rowLabel}: missing episode title`);
  }

  if (!isPositiveInteger(record.season)) {
    warnings.push(`${rowLabel}: season must be a positive whole number`);
  }

  if (!isPositiveInteger(record.episode)) {
    warnings.push(`${rowLabel}: episode must be a positive whole number`);
  }

  const episodeKey = `${record.show}::${record.season}::${record.episode}`;
  if (seenEpisodes.has(episodeKey)) {
    warnings.push(`${rowLabel}: duplicate episode number for ${record.show}, season ${record.season}, episode ${record.episode}`);
  }
  seenEpisodes.add(episodeKey);

  if (record.show && isPositiveInteger(record.season)) {
    const countKey = `${record.show}::${record.season}`;
    counts.set(countKey, (counts.get(countKey) || 0) + 1);
  }
}

printReport();

if (warnings.length) {
  process.exitCode = 1;
}

function printReport() {
  console.log("Episode data check");
  console.log("==================");
  console.log(`File: data/episodes.csv`);
  console.log(`Total rows: ${rows.length}`);
  console.log("");

  const groupedCounts = new Map();
  for (const [key, count] of counts) {
    const [show, season] = key.split("::");
    if (!groupedCounts.has(show)) {
      groupedCounts.set(show, []);
    }
    groupedCounts.get(show).push({ season: Number(season), count });
  }

  for (const [show, seasons] of groupedCounts) {
    const total = seasons.reduce((sum, season) => sum + season.count, 0);
    console.log(show);
    for (const season of seasons.sort((a, b) => a.season - b.season)) {
      console.log(`  Season ${season.season}: ${season.count}`);
    }
    console.log(`  Total: ${total}`);
    console.log("");
  }

  if (!warnings.length) {
    console.log("No data problems found.");
    return;
  }

  console.log("Warnings");
  console.log("--------");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

function toRecord(values) {
  const record = {};
  expectedHeaders.forEach((header, index) => {
    record[header] = values[index] || "";
  });
  return record;
}

function isPositiveInteger(value) {
  return /^[1-9]\d*$/.test(String(value));
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}
