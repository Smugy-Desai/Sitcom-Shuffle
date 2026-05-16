# Sitcom Shuffle

Sitcom Shuffle is a lightweight local-first app for picking a random sitcom rerun when you are too tired to choose.

The app is intentionally simple:

- No login
- No backend
- No database
- Episode data lives in a CSV file
- The final app can run as one standalone HTML file

## What to open

For normal review, open the standalone file:

```text
Sitcom Shuffle.html
```

There are also copies inside the project folder:

```text
open-app.html
index.html
```

The standalone file is the easiest one to open directly in Chrome because it has the HTML, CSS, JavaScript, and episode data bundled together.

## Project files

```text
Sitcom Shuffle/
  index.html
  open-app.html
  README.md
  src/
    index.template.html
    app.js
    styles.css
  data/
    episodes.csv
    import-template.csv
  scripts/
    build-standalone.mjs
    check-data.mjs
  publish/
    index.html
    README.md
```

What each file does:

- `index.html` is a standalone app file you can open directly.
- `src/index.template.html` is the source HTML template used by the build script.
- `src/styles.css` controls the visual design.
- `src/app.js` controls the picker behavior and animation.
- `data/episodes.csv` is the editable episode list.
- `data/import-template.csv` is a safe starter template for drafting a new show.
- `scripts/build-standalone.mjs` rebuilds `open-app.html` and `index.html`.
- `scripts/check-data.mjs` checks the episode CSV for common data mistakes.
- `publish/index.html` is the clean file for GitHub Pages.
- `open-app.html` is the one-file app you can open directly.
- `README.md` is this guide.

## How the app works

1. The app reads episode rows from `data/episodes.csv`.
2. It finds the available shows and seasons.
3. You pick a show and choose which seasons are allowed.
4. When you click `Pick an episode`, the card does a channel-changing shuffle.
5. The final result is chosen randomly from the allowed episodes.

The random selection is currently true random. It does not remember what you watched before.

## Episode CSV format

Use this exact column order:

```csv
show,season,episode,title,description
The Office (US),2,12,The Injury,Michael burns his foot and expects the office to treat it like a crisis.
```

Column meanings:

- `show`: The show name shown in the dropdown.
- `season`: The season number.
- `episode`: The episode number inside that season.
- `title`: The episode title.
- `description`: A short plain-English description.

Keep descriptions short and factual. One sentence is enough.

The current Office data uses titles only, so the `description` column is intentionally blank for now.

## How to add more episodes

Open:

```text
data/episodes.csv
```

Add more rows below the existing rows.

Example:

```csv
The Office (US),3,20,Safety Training,The office reacts to safety training after a warehouse incident.
```

Then rebuild the standalone file.

## How to add another show

Use the same CSV file. Add rows with a new show name:

```csv
Parks and Recreation,1,1,Pilot,Leslie tries to turn an abandoned lot into a park.
```

The app will automatically add the new show to the dropdown after you rebuild.

## How to draft a new show safely

Use this template as a starting point:

```text
data/import-template.csv
```

Copy its rows into a separate draft file or use it as a visual guide while adding rows to `data/episodes.csv`.

The important rule: keep the same columns in the same order.

```csv
show,season,episode,title,description
```

## How to check episode data

Before rebuilding the app, run:

```bash
node scripts/check-data.mjs
```

The checker reads `data/episodes.csv` and reports:

- total episode rows
- episode counts by show and season
- blank show names
- blank titles
- invalid season or episode numbers
- duplicate show + season + episode rows

If the checker says `No data problems found.`, the CSV is safe to rebuild into the standalone app.

## How to rebuild the standalone app

From inside the `Sitcom Shuffle` folder, run:

```bash
node scripts/build-standalone.mjs
```

That updates both standalone files:

```text
open-app.html
index.html
publish/index.html
```

## How to publish online with GitHub Pages

Use this approach when you want a shareable link for other people.

1. Sign in to GitHub.
2. Create a new public repository named something like `sitcom-shuffle`.
3. Upload the project files through the GitHub website.
4. Make sure the repository includes:

```text
publish/index.html
publish/README.md
README.md
```

5. In the GitHub repository, go to `Settings`.
6. Go to `Pages`.
7. Under `Build and deployment`, choose `Deploy from a branch`.
8. Set the branch to `main`.
9. Set the folder to `/publish`.
10. Click `Save`.

After a minute or two, GitHub will give you a link like:

```text
https://YOUR-USERNAME.github.io/sitcom-shuffle/
```

For future updates:

1. Edit the local data or app files.
2. Run:

```bash
node scripts/check-data.mjs
node scripts/build-standalone.mjs
```

3. Upload the updated `publish/index.html` to GitHub.
4. Wait for GitHub Pages to refresh the live site.

## Current visual direction

The app is aiming for bright sitcom energy:

- Stage lights
- Live audience feeling
- Channel-changing shuffle
- Cue-card and studio-set details
- Playful labels without making the app cluttered

The design should stay fun, but the main job is still simple: pick an episode fast.

## Current scope

Included now:

- Show selector
- Season filters
- True random episode picker
- Channel-changing shuffle animation
- Bright sitcom-style result card
- Complete The Office (US) title data: 201 episodes across 9 seasons
- Complete Parks and Recreation title data: 125 regular-series episodes across 7 seasons
- Complete Friends title data: 236 episodes across 10 seasons
- Complete Seinfeld title data: 180 episodes across 9 seasons
- Local CSV episode data
- Standalone HTML build

Not included yet:

- Episode descriptions
- Watched history
- Favorites
- Streaming-service links
- Login or cloud sync
- Mobile install/PWA setup

## Safe things to edit

These are beginner-friendly:

- Edit episode rows in `data/episodes.csv`.
- Change button or title text in `src/index.template.html`.
- Adjust colors in the `:root` section of `src/styles.css`.
- Change shuffle phrases in `channelPhrases` inside `src/app.js`.

## Things to be careful with

Be careful changing:

- CSV column names
- Element IDs like `episode-title` or `show-select`
- The build script replacement text
- JavaScript function names unless you understand where they are used

Those pieces connect the files together.

## Name options

The working name is `Sitcom Shuffle`.

Other possible names:

- `Rerun Roulette`
- `Couch Shuffle`
- `Episode Easy`
- `Remote Randomizer`
- `Comfort Queue`

My current recommendation is still `Sitcom Shuffle` for clarity, or `Rerun Roulette` if you want the app to feel more game-like.
