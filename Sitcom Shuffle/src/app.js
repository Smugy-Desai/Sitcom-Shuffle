const embeddedCsv = window.EPISODE_CSV;

const elements = {
  showSelect: document.querySelector("#show-select"),
  seasonFilters: document.querySelector("#season-filters"),
  selectAllSeasons: document.querySelector("#select-all-seasons"),
  pickButton: document.querySelector("#pick-button"),
  episodeCard: document.querySelector("#episode-card"),
  channelStatus: document.querySelector("#channel-status"),
  resultKicker: document.querySelector("#result-kicker"),
  episodeTitle: document.querySelector("#episode-title"),
  episodeMeta: document.querySelector("#episode-meta"),
  episodeDescription: document.querySelector("#episode-description")
};

let episodes = [];
let activeShow = "";
let activeSeasons = new Set();
let spinTimer = null;

const channelPhrases = [
  "Switching inputs...",
  "Finding the right rerun...",
  "Checking the studio feed...",
  "Cueing laugh track...",
  "Adjusting rabbit ears...",
  "Calling places...",
  "Rolling tape..."
];

init();

async function init() {
  try {
    const csvText = embeddedCsv || await fetchCsv();
    episodes = parseCsv(csvText);
    setupShowSelect();
    renderSeasonFilters();
    elements.pickButton.addEventListener("click", pickEpisode);
    elements.showSelect.addEventListener("change", handleShowChange);
    elements.selectAllSeasons.addEventListener("click", selectAllVisibleSeasons);
  } catch (error) {
    showError("The episode data could not be loaded.");
    console.error(error);
  }
}

async function fetchCsv() {
  const response = await fetch("data/episodes.csv");

  if (!response.ok) {
    throw new Error(`CSV request failed: ${response.status}`);
  }

  return response.text();
}

function setupShowSelect() {
  const shows = unique(episodes.map((episode) => episode.show));
  activeShow = shows[0] || "";

  elements.showSelect.innerHTML = shows
    .map((show) => `<option value="${escapeHtml(show)}">${escapeHtml(show)}</option>`)
    .join("");

  resetResultForShow();
}

function handleShowChange() {
  activeShow = elements.showSelect.value;
  renderSeasonFilters();
  resetResultForShow();
}

function renderSeasonFilters() {
  const seasons = getVisibleSeasons();
  activeSeasons = new Set(seasons);

  elements.seasonFilters.innerHTML = seasons
    .map((season) => {
      const label = `S${season}`;
      return `
        <label class="season-chip">
          <input type="checkbox" value="${season}" checked>
          <span aria-label="Season ${season}">${label}</span>
        </label>
      `;
    })
    .join("");

  elements.seasonFilters.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", updateActiveSeasons);
  });
}

function selectAllVisibleSeasons() {
  elements.seasonFilters.querySelectorAll("input").forEach((input) => {
    input.checked = true;
  });
  updateActiveSeasons();
}

function updateActiveSeasons() {
  activeSeasons = new Set(
    Array.from(elements.seasonFilters.querySelectorAll("input:checked"))
      .map((input) => Number(input.value))
  );
}

function pickEpisode() {
  const candidates = getCandidateEpisodes();

  if (!candidates.length) {
    showNoSeasonState();
    return;
  }

  elements.pickButton.disabled = true;
  elements.episodeCard.classList.add("is-changing-channel");
  elements.resultKicker.textContent = randomFrom(channelPhrases);
  elements.channelStatus.textContent = "CH ??.?";

  let ticks = 0;
  const maxTicks = 22;

  clearInterval(spinTimer);
  spinTimer = setInterval(() => {
    const preview = randomFrom(candidates);
    renderEpisode(preview, randomFrom(channelPhrases));
    elements.channelStatus.textContent = `CH ${preview.season}.${preview.episode}`;
    ticks += 1;

    if (ticks >= maxTicks) {
      clearInterval(spinTimer);
      const finalPick = randomFrom(candidates);
      renderEpisode(finalPick, "Now airing");
      elements.channelStatus.textContent = "ON AIR";
      elements.episodeCard.classList.remove("is-changing-channel");
      elements.pickButton.disabled = false;
    }
  }, 95);
}

function renderEpisode(episode, kicker) {
  elements.resultKicker.textContent = kicker;
  elements.channelStatus.textContent = "ON AIR";
  elements.episodeTitle.textContent = episode.title;
  elements.episodeMeta.textContent = `${episode.show} - Season ${episode.season}, Episode ${episode.episode}`;
  elements.episodeDescription.textContent = episode.description || "";
  elements.episodeDescription.hidden = !episode.description;
}

function resetResultForShow() {
  elements.resultKicker.textContent = "Cue the theme song";
  elements.channelStatus.textContent = "ON AIR";
  elements.episodeTitle.textContent = "Ready to shuffle?";
  elements.episodeMeta.textContent = `${activeShow} is loaded.`;
  elements.episodeDescription.hidden = false;
  elements.episodeDescription.textContent = "Pick your seasons, then let the remote do the work.";
}

function showError(message) {
  elements.resultKicker.textContent = "Small snag";
  elements.episodeTitle.textContent = message;
  elements.episodeMeta.textContent = "The app is still okay.";
  elements.episodeDescription.hidden = false;
  elements.episodeDescription.textContent = "Check the CSV file or rebuild the standalone HTML if the data changed.";
  elements.pickButton.disabled = false;
  elements.channelStatus.textContent = "CHECK";
  elements.episodeCard.classList.remove("is-changing-channel");
}

function showNoSeasonState() {
  elements.resultKicker.textContent = "No signal";
  elements.channelStatus.textContent = "STATIC";
  elements.episodeTitle.textContent = "Pick at least one season";
  elements.episodeMeta.textContent = "The remote needs a range.";
  elements.episodeDescription.hidden = false;
  elements.episodeDescription.textContent = "Turn one season back on, then shuffle again.";
  elements.pickButton.disabled = false;
  elements.episodeCard.classList.remove("is-changing-channel");
}

function getCandidateEpisodes() {
  return episodes.filter((episode) => (
    episode.show === activeShow && activeSeasons.has(Number(episode.season))
  ));
}

function getVisibleSeasons() {
  return unique(
    episodes
      .filter((episode) => episode.show === activeShow)
      .map((episode) => Number(episode.season))
  ).sort((a, b) => a - b);
}

function parseCsv(csvText) {
  const rows = csvText.trim().split(/\r?\n/).map(parseCsvLine);
  const headers = rows.shift();

  return rows.map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] || "";
    });
    record.season = Number(record.season);
    record.episode = Number(record.episode);
    return record;
  });
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

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
