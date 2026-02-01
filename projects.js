// Placeholder data (5 projects) — later you’ll replace these with real work.
// Add new projects by adding one object to this array.
const PROJECTS = [
  {
    slug: "project-01",
    category: "films",
    title: "LIVE at the Court",
    year: "2026",
    type: "SHORT DOC",
    involvement: ["Cracked Concrete Original"],
    status: "FESTIVAL CIRCUIT",
    logline: "Three basketball players step onto the court, each with a rhythm of their own. As their movements are studied and reimagined, their game is recontextualized into jazz, revealing the artistry within sport and the music hidden in motion.",
    credits: [
      ["DIRECTOR", "BEN MOULAND"],
      ["Cinematographer", "JAMIE MITRI"],
      ["PRODUCER", "Satchel Ramraj"],
      ["Editor(s)", "Ben Mouland & Joshua Garrido"],
      ["Composer", "Mafuba"],
      ["B-Cam", "Chris Berry"],
      ["C-Cam", "Andrew Lee"],
      ["Location Sound Mixer", "Juliette Leach"],
    ],
    links: [
      ["TRAILER", "TBD"],
      ["IMDB", "https://www.imdb.com/title/tt39393828/?ref_=ext_shr_lnk"],
      ["LETTERBOXD", "https://boxd.it/10j7e"],
    ],
  },
  {
    slug: "project-02",
    category: "films",
    title: "Pulse",
    year: "2025",
    type: "Short Film",
    involvement: ["Cracked Concrete Original"],
    status: "Festival Circuit",
    logline: "Two young boys make the most of their time together in a hospital room.",
    credits: [
      ["DIRECTOR", "Ben Mouland"],
      ["Cinematographer", "Juliette Leach"],
      ["PRODUCER", "Alexandra Sirola"],
      ["Editor", "Ben Mouland"],
      ["Composer", "Mungo McLaggan"],
      ["B-Cam", "Tyler Wu"],
      ["Location Sound Mixer", "Chris Berry"],
    ],
    links: [
      ["TRAILER", "TBD"],
      ["IMDB", "https://www.imdb.com/title/tt34894135/?ref_=ext_shr_lnk"],
      ["LETTERBOXD", "https://boxd.it/QwHE"],
    ],
  },
  {
    slug: "project-03",
    category: "films",
    title: "Goldfish",
    year: "2024",
    type: "Feature Film",
    involvement: ["Cracked Concrete Original"],
    status: "RELEASED",
    logline: "A neon-forward product promo built around motion, reflections, and analog grit.",
    credits: [
      ["DIRECTOR", "Ben Mouland"],
      ["Cinematographer", "Ben Mouland"],
      ["Editor", "Ben Mouland"],
      ["B-Cam", "Andrew Lee"],
    ],
    links: [
      ["WATCH", "#"],
      ["TRAILER", "TBD"],
      ["IMDB", "https://www.imdb.com/title/tt36260793/?ref_=ext_shr_lnk"],
      ["LETTERBOXD", "https://boxd.it/SZog"],
    ],
  },
  {
    slug: "project-04",
    category: "films",
    title: "Ultra Violent Light",
    year: "2023",
    type: "Short Film",
    involvement: ["Cracked Concrete Original"],
    status: "RELEASED",
    logline: "A frivolous group of teenagers are slowly picked off by a crude forest entity.",
    credits: [
      ["Director", "Ben Mouland"],
      ["Cinematographer", "Arsh Buttan"],
    ],
    links: [
      ["WATCH", "#"],
      ["TRAILER", "TBD"],
      ["IMDB", "https://www.imdb.com/title/tt35682746/?ref_=ext_shr_lnk"],
      ["LETTERBOXD", "https://boxd.it/JeVk"],
    ],
  },
  {
    slug: "project-05",
    category: "films",
    title: "ARCHIVE EXPERIMENT #1",
    year: "2024",
    type: "EXPERIMENTAL",
    involvement: ["SHOT", "PRODUCED"],
    status: "RELEASED",
    logline: "Found footage reprocessed through CRT artifacts — memory, signal, distortion.",
    credits: [
      ["DIRECTOR", "BEN MOULAND"],
      ["PRODUCER", "CRACKED CONCRETE"],
      ["POST", "—"],
    ],
    links: [
      ["WATCH", "#"],
      ["NOTES", "#"],
    ],
  },
];

const els = {
  grid: document.getElementById("projectsGrid"),
  panel: document.getElementById("projectPanel"),
  meta: document.getElementById("panelMeta"),
  cover: document.getElementById("panelCover"),
  title: document.getElementById("panelTitle"),
  badges: document.getElementById("panelBadges"),
  logline: document.getElementById("panelLogline"),
  credits: document.getElementById("panelCredits"),
  links: document.getElementById("panelLinks"),
};

let selectedIndex = 0;

let activeCategory = "films";

function getVisible(){
  return PROJECTS.filter(p => (p.category || "films") === activeCategory);
}


function badge(text) {
  const b = document.createElement("span");
  b.className = "badge";
  b.textContent = text;
  return b;
}

function renderGrid() {
  els.grid.innerHTML = "";

  const visible = getVisible();

  if (visible.length === 0){
    const empty = document.createElement("div");
    empty.className = "projectsEmpty";
    empty.textContent = "NO PROJECTS YET";
    els.grid.appendChild(empty);
    return;
  }

  visible.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "projectCard";
    btn.setAttribute("data-index", String(i));
    btn.setAttribute("aria-selected", i === selectedIndex ? "true" : "false");

    btn.innerHTML = `
      <div class="cardTop">
        <div class="cardTitle">${p.title}</div>
        <div class="cardYear">${p.year}</div>
      </div>
      <div class="cardMid">
        <div class="cardType">${p.type}</div>
        <div class="cardStatus">${p.status}</div>
      </div>
      <div class="cardBottom">
        <div class="cardInvolvement">${p.involvement.join(" • ")}</div>
      </div>
    `;

    btn.addEventListener("click", () => selectIndex(i));
    els.grid.appendChild(btn);
  });
}


function renderPanel(p) {
  els.meta.textContent = `${p.year} • ${p.type} • ${p.status}`;

  // cover is intentionally “analog placeholder”
  els.cover.innerHTML = `
    <div class="coverLabel">STILL / POSTER PLACEHOLDER</div>
    <div class="coverNoise"></div>
  `;

  els.title.textContent = p.title;

  els.badges.innerHTML = "";
  p.involvement.forEach(t => els.badges.appendChild(badge(t)));

  els.logline.textContent = p.logline;

  els.credits.innerHTML = "";
  p.credits.forEach(([k, v]) => {
    const row = document.createElement("div");
    row.className = "creditRow";
    row.innerHTML = `<span class="creditKey">${k}</span><span class="creditVal">${v}</span>`;
    els.credits.appendChild(row);
  });

  els.links.innerHTML = "";
  p.links.forEach(([label, href]) => {
    const a = document.createElement("a");
    a.className = "panelLink";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = label;
    els.links.appendChild(a);
  });
}

function selectIndex(i) {
  const visible = getVisible();
  if (visible.length === 0) return;

  selectedIndex = Math.max(0, Math.min(i, visible.length - 1));
  renderGrid();
  renderPanel(visible[selectedIndex]);
}

document.addEventListener("branch:subchange", (e) => {
  if (!e.detail || e.detail.branchId !== "projects") return;

  activeCategory = e.detail.key;

  // Always default to the first project in that category
  selectedIndex = 0;

  renderGrid();

  const visible = getVisible();

  if (visible.length) {
    renderPanel(visible[0]);
  } else {
    // If no projects in this category, clear the panel cleanly
    els.meta.textContent = "SELECT A PROJECT";
    els.title.textContent = "—";
    els.badges.innerHTML = "";
    els.logline.textContent = "No projects in this category yet.";
    els.credits.innerHTML = "";
    els.links.innerHTML = "";
  }
});


// Initial paint
renderGrid();
const initialVisible = getVisible();
if (initialVisible.length) renderPanel(initialVisible[selectedIndex]);
