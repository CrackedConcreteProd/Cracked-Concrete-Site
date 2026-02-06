// === SCROLL SAFETY: never stay locked unless lightbox is open ===
(function () {
  function unlockIfNeeded() {
    const lb = document.getElementById("lightbox");
    const lbOpen = lb && lb.classList.contains("is-open");

    // If lightbox isn't open, ensure we aren't stuck in overflow:hidden
    if (!lbOpen) {
      const html = document.documentElement;
      const ov = getComputedStyle(html).overflowY;
      if (ov === "hidden") {
        html.style.overflow = "";
        document.body.style.overflow = "";
      }
    }
  }

  window.addEventListener("pageshow", unlockIfNeeded);
  window.addEventListener("load", unlockIfNeeded);
  document.addEventListener("visibilitychange", unlockIfNeeded);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") unlockIfNeeded();
  });
})();

// Cracked Concrete — project.js
// - Renders project list + right-side panel
// - Supports category switching via branch:subchange
// - Lightbox gallery for poster + stills (locks scroll safely)

// Placeholder data (projects)
const PROJECTS = [
  {
    slug: "project-01",
    category: "films",
    title: "LIVE at the Court",
    year: "2026",
    type: "SHORT DOCUMENTARY",
    involvement: ["Cracked Concrete Original"],
    status: "FESTIVAL CIRCUIT",
    logline:
      "Three basketball players step onto the court, each with a rhythm of their own. As their movements are studied and reimagined, their game is recontextualized into jazz, revealing the artistry within sport and the music hidden in motion.",
    poster: "assets/projects/live-at-the-court/poster.jpg",
    stills: [
      "assets/projects/live-at-the-court/still-01.jpg",
      "assets/projects/live-at-the-court/still-02.jpg",
      "assets/projects/live-at-the-court/still-03.jpg",
    ],
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
    poster: "assets/projects/pulse/poster.jpg",
  stills: [
  ],
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
    logline:
      "A neon-forward product promo built around motion, reflections, and analog grit.",
    poster: "assets/projects/goldfish/poster.png",
  stills: [
    "assets/projects/goldfish/still-01.png",
    "assets/projects/goldfish/still-02.png",
    "assets/projects/goldfish/still-03.png",
  ],
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
    logline:
      "A frivolous group of teenagers are slowly picked off by a crude forest entity.",
    poster: "assets/projects/ultra-violent-light/poster.jpg",
    stills: [
    ],
      credits: [
        ["Director", "Ben Mouland"],
       ["Cinematographer", "Arsh Buttan"],
       ["PRODUCER", "Ngaire Le"],
       ["Editor", "Chris Berry"],
       ["Composer", "Trevor-J"],
    ],
    links: [
      ["WATCH", "TBD"],
      ["TRAILER", "TBD"],
      ["IMDB", "https://www.imdb.com/title/tt35682746/?ref_=ext_shr_lnk"],
      ["LETTERBOXD", "https://boxd.it/JeVk"],
    ],
  },
  {
    slug: "project-05",
    category: "films",
    title: "Sunny Chibas: The Shit Hot Eatery",
    year: "2022",
    type: "Short Documentary",
    involvement: ["Cracked Concrete Original"],
    status: "RELEASED",
    logline:
      "A frivolous group of teenagers are slowly picked off by a crude forest entity.",
    poster: "assets/projects/sunny-chiba/poster.jpg",
    stills: [
    ],
      credits: [
        ["Director", "Ben Mouland"],
       ["Cinematographer", "Ben Mouland"],
       ["Editor", "Ben Mouland"],
       ["Additional Photography", "Chris Berry"],
       ["Location Sound Mixer", "Chris Berry"],
       ],
    links: [
      ["WATCH", "https://youtu.be/Ae76BGpjYjU"],
      ["LETTERBOXD", "https://boxd.it/JeVk"],
    ],
  },
];

// ---- Elements (safe-guard) ----
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

// If this script is included on a page without these elements, do nothing.
if (!els.grid || !els.panel) {
  // eslint-disable-next-line no-console
  console.warn("[project.js] Required DOM nodes not found; script skipped.");
} else {
  let selectedIndex = 0;
  let activeCategory = "films";

  function getVisible() {
    return PROJECTS.filter((p) => (p.category || "films") === activeCategory);
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

    if (visible.length === 0) {
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
          <div class="cardInvolvement">${(p.involvement || []).join(" • ")}</div>
        </div>
      `;

      btn.addEventListener("click", () => selectIndex(i));
      els.grid.appendChild(btn);
    });
  }

  // =========================================================
  // LIGHTBOX GALLERY (CLICK + ARROWS + KEYBOARD)
  // =========================================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxLabel = document.getElementById("lightboxLabel");
  const lightboxCount = document.getElementById("lightboxCount");

  let lbItems = []; // [{ src, label }]
  let lbIndex = 0;

  // store previous overflow so we can restore correctly
  let prevHtmlOverflow = "";

  function renderLightbox() {
    if (!lightbox || !lightboxImg) return;

    const item = lbItems[lbIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.label || "Image preview";

    if (lightboxLabel) lightboxLabel.textContent = item.label || "";
    if (lightboxCount) {
      lightboxCount.textContent =
        lbItems.length > 1 ? `${lbIndex + 1} / ${lbItems.length}` : "";
    }
  }

  function setLightboxIndex(nextIndex) {
    if (!lbItems.length) return;

    const len = lbItems.length;
    lbIndex = ((nextIndex % len) + len) % len;
    renderLightbox();
  }

  function openLightboxGallery(items, startIndex = 0) {
    if (!lightbox || !lightboxImg) return;

    lbItems = Array.isArray(items) ? items.filter(Boolean) : [];
    lbIndex = Math.max(0, Math.min(startIndex, lbItems.length - 1));
    if (!lbItems.length) return;

    lightbox.classList.toggle("has-multi", lbItems.length > 1);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");

    // lock scroll, but restore exactly what was there before
    prevHtmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    renderLightbox();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("is-open", "has-multi");
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImg.src = "";
    if (lightboxLabel) lightboxLabel.textContent = "";
    if (lightboxCount) lightboxCount.textContent = "";

    lbItems = [];
    lbIndex = 0;

    // restore previous overflow
    document.documentElement.style.overflow = prevHtmlOverflow || "";
    prevHtmlOverflow = "";
  }

  // Click handling: backdrop/close + arrows
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      const t = e.target;
      if (!t) return;

      if (t.matches("[data-close]")) {
        closeLightbox();
        return;
      }

      if (t.matches("[data-nav='prev']")) {
        setLightboxIndex(lbIndex - 1);
        return;
      }

      if (t.matches("[data-nav='next']")) {
        setLightboxIndex(lbIndex + 1);
        return;
      }
    });
  }

  // Keyboard: ESC closes, Left/Right navigates (only when open)
  window.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      closeLightbox();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setLightboxIndex(lbIndex - 1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setLightboxIndex(lbIndex + 1);
      return;
    }
  });

  // Safety: if lightbox isn't open, never allow overflow to stay hidden
  window.addEventListener("pointerdown", () => {
    if (!lightbox) return;
    if (
      !lightbox.classList.contains("is-open") &&
      getComputedStyle(document.documentElement).overflow === "hidden"
    ) {
      document.documentElement.style.overflow = "";
      prevHtmlOverflow = "";
    }
  });

  function renderPanel(p) {
    if (!p) return;

    els.meta.textContent = `${p.year} • ${p.type} • ${p.status}`;

    // Media (poster + stills)
    const hasPoster = Boolean(p.poster);
    const hasStills = Array.isArray(p.stills) && p.stills.length > 0;

    // Build gallery: poster first, then all stills
    const gallery = [];
    if (hasPoster) gallery.push({ src: p.poster, label: `${p.title} poster` });
    (p.stills || []).forEach((src, i) =>
      gallery.push({ src, label: `${p.title} still ${i + 1}` })
    );

    if (!hasPoster && !hasStills) {
      els.cover.innerHTML = `
        <div class="coverLabel">STILL / POSTER PLACEHOLDER</div>
        <div class="coverNoise"></div>
      `;
    } else {
      const stillsShown = (p.stills || []).slice(0, 3);

      els.cover.innerHTML = `
        <div class="panelMedia">
          <div class="panelPoster ${hasPoster ? "" : "is-missing"}">
            ${
              hasPoster
                ? `<img src="${p.poster}" data-gindex="0" alt="${p.title} poster" loading="lazy" />`
                : `<div class="mediaLabel">POSTER</div><div class="coverNoise"></div>`
            }
          </div>

          <div class="panelStills">
            ${stillsShown
              .map(
                (src, idx) => `
                  <div class="panelStill">
                    <img src="${src}" data-gindex="${
                      hasPoster ? idx + 1 : idx
                    }" alt="${p.title} still ${idx + 1}" loading="lazy" />
                  </div>
                `
              )
              .join("")}

            ${
              stillsShown.length < 3
                ? Array.from({ length: 3 - stillsShown.length })
                    .map(
                      () => `
                        <div class="panelStill is-missing">
                          <div class="mediaLabel">STILL</div>
                          <div class="coverNoise"></div>
                        </div>
                      `
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
      `;
    }

    // Bind clicks after HTML injection (poster + stills)
    const clickableImgs = els.cover.querySelectorAll(
      ".panelPoster img, .panelStill img"
    );
    clickableImgs.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        const startAt = Number(img.dataset.gindex || 0);
        openLightboxGallery(gallery, startAt);
      });
    });

    els.title.textContent = p.title;

    els.badges.innerHTML = "";
    (p.involvement || []).forEach((t) => els.badges.appendChild(badge(t)));

    els.logline.textContent = p.logline || "";

    els.credits.innerHTML = "";
    (p.credits || []).forEach(([k, v]) => {
      const row = document.createElement("div");
      row.className = "creditRow";
      row.innerHTML = `<span class="creditKey">${k}</span><span class="creditVal">${v}</span>`;
      els.credits.appendChild(row);
    });

    els.links.innerHTML = "";
    (p.links || []).forEach(([label, href]) => {
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

  // Listen for category changes from the branch system
  document.addEventListener("branch:subchange", (e) => {
    if (!e.detail || e.detail.branchId !== "projects") return;

    activeCategory = e.detail.key || "films";
    selectedIndex = 0; // default to first project in category

    renderGrid();

    const visible = getVisible();
    if (visible.length) {
      renderPanel(visible[0]);
    } else {
      els.meta.textContent = "SELECT A PROJECT";
      els.title.textContent = "—";
      els.badges.innerHTML = "";
      els.logline.textContent = "No projects in this category yet.";
      els.credits.innerHTML = "";
      els.links.innerHTML = "";
      els.cover.innerHTML = "";
    }
  });

  // Initial paint
  renderGrid();
  const initialVisible = getVisible();
  if (initialVisible.length) renderPanel(initialVisible[selectedIndex]);
}
