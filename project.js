// projects.js
// Shared data + renderer for Projects page AND Home Projects branch panel

const PROJECTS = {
  films: [
    {
      title: "PROJECT TITLE A",
      year: "2026",
      type: "SHORT / EXPERIMENTAL",
      status: "IN PROGRESS",
      logline: "Short description goes here.",
      badges: ["OSD", "CRT"],
      credits: [
        ["DIRECTOR", "BEN MOULAND"],
        ["DP", "TBD"],
        ["EDITOR", "TBD"],
      ],
      links: [
        ["TRAILER", "#"],
        ["STILLS", "#"],
      ],
    },
    {
      title: "PROJECT TITLE B",
      year: "2025",
      type: "SHORT",
      status: "COMPLETE",
      logline: "Another short description goes here.",
      badges: ["FILM"],
      credits: [
        ["DIRECTOR", "BEN MOULAND"],
        ["SOUND", "TBD"],
      ],
      links: [
        ["WATCH", "#"],
      ],
    },
  ],

  musicvideos: [
    {
      title: "MUSIC VIDEO A",
      year: "2026",
      type: "MUSIC VIDEO",
      status: "IN PROGRESS",
      logline: "Music video description goes here.",
      badges: ["MV"],
      credits: [
        ["DIRECTOR", "BEN MOULAND"],
        ["ARTIST", "TBD"],
      ],
      links: [
        ["VIMEO", "#"],
      ],
    },
  ],

  docs: [
    {
      title: "DOCUMENTARY A",
      year: "2026",
      type: "DOC",
      status: "IN PROGRESS",
      logline: "Documentary description goes here.",
      badges: ["DOC"],
      credits: [
        ["DIRECTOR", "BEN MOULAND"],
        ["PRODUCER", "TBD"],
      ],
      links: [
        ["INFO", "#"],
      ],
    },
  ],
};

// ---------- helpers ----------
function el(tag, cls, text){
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function clear(node){
  while (node.firstChild) node.removeChild(node.firstChild);
}

// ---------- render ----------
function renderProjectList(category){
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  clear(grid);

  const items = PROJECTS[category] || [];

  items.forEach((p, idx) => {
    const btn = el("button", "projectCard");
    btn.type = "button";
    btn.setAttribute("aria-selected", "false");
    btn.dataset.category = category;
    btn.dataset.index = String(idx);

    const top = el("div", "cardTop");
    top.appendChild(el("div", "cardTitle", p.title));
    top.appendChild(el("div", "cardYear", p.year || "—"));

    const mid = el("div", "cardMid");
    mid.appendChild(el("div", "cardType", p.type || "—"));
    mid.appendChild(el("div", "cardStatus", p.status || "—"));

    const bot = el("div", "cardBottom", p.logline || "");

    btn.appendChild(top);
    btn.appendChild(mid);
    btn.appendChild(bot);

    btn.addEventListener("click", () => {
      selectProject(category, idx);
    });

    grid.appendChild(btn);
  });

  // Auto-select first item
  if (items.length){
    selectProject(category, 0);
  } else {
    renderEmptyPanel();
  }
}

function renderEmptyPanel(){
  const panelMeta = document.getElementById("panelMeta");
  const panelTitle = document.getElementById("panelTitle");
  const panelBadges = document.getElementById("panelBadges");
  const panelLogline = document.getElementById("panelLogline");
  const panelCredits = document.getElementById("panelCredits");
  const panelLinks = document.getElementById("panelLinks");

  if (panelMeta) panelMeta.textContent = "NO PROJECTS";
  if (panelTitle) panelTitle.textContent = "—";
  if (panelBadges) panelBadges.innerHTML = "";
  if (panelLogline) panelLogline.textContent = "No projects found in this category.";
  if (panelCredits) panelCredits.innerHTML = "";
  if (panelLinks) panelLinks.innerHTML = "";
}

function selectProject(category, idx){
  const items = PROJECTS[category] || [];
  const p = items[idx];
  if (!p) return;

  // Update selected state in list
  const grid = document.getElementById("projectsGrid");
  if (grid){
    [...grid.querySelectorAll(".projectCard")].forEach((b) => {
      b.setAttribute("aria-selected", "false");
    });
    const active = grid.querySelector(`.projectCard[data-index="${idx}"]`);
    if (active) active.setAttribute("aria-selected", "true");
  }

  // Fill panel
  const panelMeta = document.getElementById("panelMeta");
  const panelTitle = document.getElementById("panelTitle");
  const panelBadges = document.getElementById("panelBadges");
  const panelLogline = document.getElementById("panelLogline");
  const panelCredits = document.getElementById("panelCredits");
  const panelLinks = document.getElementById("panelLinks");

  if (panelMeta) panelMeta.textContent = `${(p.type || "PROJECT")} • ${(p.year || "—")}`;
  if (panelTitle) panelTitle.textContent = p.title || "—";
  if (panelLogline) panelLogline.textContent = p.logline || "";

  if (panelBadges){
    panelBadges.innerHTML = "";
    (p.badges || []).forEach((b) => {
      const s = el("span", "badge", b);
      panelBadges.appendChild(s);
    });
  }

  if (panelCredits){
    panelCredits.innerHTML = "";
    (p.credits || []).forEach(([k, v]) => {
      const row = el("div", "creditRow");
      row.appendChild(el("div", "creditKey", k));
      row.appendChild(el("div", "creditVal", v));
      panelCredits.appendChild(row);
    });
  }

  if (panelLinks){
    panelLinks.innerHTML = "";
    (p.links || []).forEach(([label, href]) => {
      const a = el("a", "panelLink", label);
      a.href = href || "#";
      a.target = "_blank";
      a.rel = "noopener";
      panelLinks.appendChild(a);
    });
  }
}

// ---------- init ----------
function initProjectsUI(){
  // default category
  let activeCat = "films";

  // Sub buttons (on homepage branch + projects page)
  document.querySelectorAll('#projectsSubRow .subBtn').forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCat = btn.dataset.sub || "films";
      renderProjectList(activeCat);
    });
  });

  // First render
  renderProjectList(activeCat);
}

// Run on DOM ready
document.addEventListener("DOMContentLoaded", initProjectsUI);
