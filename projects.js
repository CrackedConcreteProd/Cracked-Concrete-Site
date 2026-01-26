// Placeholder data (5 projects) — later you’ll replace these with real work.
// Add new projects by adding one object to this array.
const PROJECTS = [
  {
    slug: "project-01",
    title: "LIVE AT THE COURT",
    year: "2026",
    type: "SHORT DOC",
    involvement: ["SHOT", "PRODUCED"],
    status: "IN PROGRESS",
    logline: "A jazz band translates basketball playstyles into music — a portrait of movement, rhythm, and local courts.",
    credits: [
      ["DIRECTOR", "BEN MOULAND"],
      ["DP", "BEN MOULAND"],
      ["PRODUCER", "CRACKED CONCRETE"],
    ],
    links: [
      ["TRAILER", "#"],
      ["STILLS", "#"],
    ],
  },
  {
    slug: "project-02",
    title: "CONCRETE SESSIONS",
    year: "2025",
    type: "LIVE SESSION",
    involvement: ["PRODUCED", "SUPPORTED"],
    status: "RELEASED",
    logline: "A stripped-down performance series: one room, one take, raw sound, real texture.",
    credits: [
      ["DIRECTOR", "—"],
      ["AUDIO", "—"],
      ["PRODUCTION", "CRACKED CONCRETE"],
    ],
    links: [
      ["WATCH", "#"],
      ["PRESS", "#"],
    ],
  },
  {
    slug: "project-03",
    title: "NIGHT DRIVE PROMO",
    year: "2025",
    type: "COMMERCIAL",
    involvement: ["SHOT"],
    status: "RELEASED",
    logline: "A neon-forward product promo built around motion, reflections, and analog grit.",
    credits: [
      ["DP", "BEN MOULAND"],
      ["EDITOR", "—"],
      ["CLIENT", "—"],
    ],
    links: [
      ["WATCH", "#"],
    ],
  },
  {
    slug: "project-04",
    title: "COMMUNITY PORTRAITS",
    year: "2024",
    type: "MINI DOCS",
    involvement: ["SUPPORTED"],
    status: "RELEASED",
    logline: "Short profiles celebrating local artists and organizers — community as archive.",
    credits: [
      ["PRODUCTION SUPPORT", "CRACKED CONCRETE"],
      ["DIRECTOR", "—"],
    ],
    links: [
      ["PLAYLIST", "#"],
    ],
  },
  {
    slug: "project-05",
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

function badge(text) {
  const b = document.createElement("span");
  b.className = "badge";
  b.textContent = text;
  return b;
}

function renderGrid() {
  els.grid.innerHTML = "";

  PROJECTS.forEach((p, i) => {
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
  selectedIndex = i;
  renderGrid();
  renderPanel(PROJECTS[selectedIndex]);
}

// Initial paint
renderGrid();
renderPanel(PROJECTS[selectedIndex]);
