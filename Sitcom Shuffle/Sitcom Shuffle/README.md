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

There is also a copy inside the project folder:

```text
open-app.html
```

The standalone file is the easiest one to open directly in Chrome because it has the HTML, CSS, JavaScript, and episode data bundled together.

## Project files

```text
Sitcom Shuffle/
  index.html
  open-app.html
  README.md
  src/
    app.js
    styles.css
  data/
    episodes.csv
  scripts/
    build-standalone.mjs
```

What each file does:

- `index.html` is the source HTML layout.
- `src/styles.css` controls the visual design.
- `src/app.js` controls the picker behavior and animation.
- `data/episodes.csv` is the editable episode list.
- `scripts/build-standalone.mjs` rebuilds `open-app.html`.
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

## How to rebuild the standalone app

From inside the `Sitcom Shuffle` folder, run:

```bash
node scripts/build-standalone.mjs
```

That updates:

```text
open-app.html
```

Then copy the updated `open-app.html` to the Desktop standalone file if needed.

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
- Change button or title text in `index.html`.
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
