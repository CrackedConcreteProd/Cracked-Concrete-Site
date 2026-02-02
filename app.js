// ==============================
// Cracked Concrete — app.js (RESTORED)
// - Working branching animation order (CSS-driven)
// - Fast, no duplicated open() logic
// ==============================

// ===== ICONS =====
const ICONS = {
  projects: [
    "0000000000000000","0000000000000000","0000000000000000","0000001111111000",
    "0000001000001000","0100011111111110","0110110000000110","0111100111110100",
    "0110100100010100","0110100100010100","0111100111110100","0110110000000100",
    "0100011111111100","0000000000000000","0000000000000000","0000000000000000",
  ],
  services: [
    "0000000000000000","0000000000000000","0000000000000000","0011111111111100",
    "0100000000000010","0100110000110010","0101001111001010","0101001111001010",
    "0100110000110010","0100000000000010","0100000000000010","0100000000000010",
    "0100111111110010","0111111111111110","0000000000000000","0000000000000000",
  ],
  people: [
    "0000000000000000","0000000000000000","0000000000000000","0000011111000000",
    "0000110001100000","0000110001100000","0000011111000000","0000000110000000",
    "0000111111110000","0001100000011000","0001100000011000","0001100000011000",
    "0000111111110000","0000000000000000","0000000000000000","0000000000000000",
  ],
  connect: [
    "0000000000000000","0000000000000000","0000000000000111","0000000000011100",
    "0000000000010000","0000000000011000","0000000000001100","0011111111000110",
    "0110000000100010","0100000000101110","0100000111111000","0100000000100000",
    "0110000000100000","0011111111000000","0000000000000000","0000000000000000",
  ],
};

function buildIcon(el, pattern){
  el.innerHTML = "";
  for (let y = 0; y < pattern.length; y++){
    for (let x = 0; x < pattern[y].length; x++){
      const d = document.createElement("div");
      d.className = "px" + (pattern[y][x] === "1" ? " on" : "");
      el.appendChild(d);
    }
  }
}

document.querySelectorAll(".pixel").forEach((el) => {
  const key = el.dataset.icon;
  if (ICONS[key]) buildIcon(el, ICONS[key]);
});

document.addEventListener("DOMContentLoaded", () => {
  const items = Array.from(document.querySelectorAll(".item"));
  const grid = document.getElementById("grid");
  if (!items.length || !grid) return;

  function setSelected(i){
    items.forEach((b, idx) =>
      b.setAttribute("aria-selected", idx === i ? "true" : "false")
    );
    items[i].focus({ preventScroll: true });
  }

  function selectedIndex(){
    return items.findIndex(b => b.getAttribute("aria-selected") === "true");
  }

  function cols(){
    const style = window.getComputedStyle(grid);
    return style.gridTemplateColumns.split(" ").length;
  }

  function getBranchW(){
    const v = getComputedStyle(document.documentElement).getPropertyValue("--branchW").trim();
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 8;
  }

  const REVEAL_AFTER_MS = 2300;
  const state = { activeBranch: null };

  class BranchController {
    constructor(opts){
      this.id = opts.id;

      this.tile   = document.getElementById(opts.tileId);
      this.branch = document.getElementById(opts.branchId);
      this.subRow = document.getElementById(opts.subRowId);
      this.subBtns = this.subRow ? Array.from(this.subRow.querySelectorAll(".subBtn")) : [];
      
      this.barFrom = (opts.barFrom || "left").toLowerCase();


      this.linesEl = this.branch ? this.branch.querySelector(".branchLines") : null;

      this.trunk = this.branch ? this.branch.querySelector(".bLine.trunk") : null;
      this.bar   = this.branch ? this.branch.querySelector(".bLine.bar") : null;
      this.drops = this.branch ? Array.from(this.branch.querySelectorAll(".bLine.drop")) : [];
      this.stem  = this.branch ? this.branch.querySelector(".bLine.stem") : null;

      this.ui = opts.ui ? {
        meta:   document.getElementById(opts.ui.meta),
        title:  document.getElementById(opts.ui.title),
        cover:  document.getElementById(opts.ui.cover),
        logline:document.getElementById(opts.ui.logline),
        badges: document.getElementById(opts.ui.badges),
      } : null;

      this.content = opts.content || {};
      this.defaultKey = opts.defaultKey || (this.subBtns[0] ? this.subBtns[0].dataset.sub : null);

      this.isOpen = false;

this.valid = !!(
  this.tile &&
  this.branch &&
  this.subRow &&
  this.linesEl &&
  this.trunk &&
  this.bar &&
  this.stem &&
  this.subBtns.length > 0 &&
  this.drops.length === this.subBtns.length
);

      if (!this.valid) return;

      this.tile.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle();
      });

      this.subRow.addEventListener("click", (e) => {
        const btn = e.target.closest(".subBtn");
        if (!btn) return;
        this.setActive(btn.dataset.sub);
      });

      window.addEventListener("resize", () => {
        if (!this.isOpen) return;
        this.layoutLines();
      });
    }

    close(){
      this.isOpen = false;
      this.branch.classList.remove("is-open", "is-drawing", "is-ready");
    }

    open(){
      if (state.activeBranch && state.activeBranch !== this) state.activeBranch.close();
      state.activeBranch = this;

      this.isOpen = true;
      this.branch.classList.add("is-open");
      this.branch.classList.remove("is-ready");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.layoutLines();
          requestAnimationFrame(() => this.layoutLines());
          if (this.defaultKey) this.setActive(this.defaultKey);

          this.branch.classList.remove("is-drawing");
          void this.branch.offsetHeight;
          this.branch.classList.add("is-drawing");

          window.setTimeout(() => {
            if (this.isOpen) this.branch.classList.add("is-ready");
          }, REVEAL_AFTER_MS);
        });
      });
    }

    toggle(){
      if (this.isOpen) this.close();
      else this.open();
    }

    setActive(key){
      this.subBtns.forEach(b =>
        b.setAttribute("aria-current", b.dataset.sub === key ? "true" : "false")
      );

      const c = this.content[key];
      if (c && this.ui){
        if (this.ui.meta)   this.ui.meta.textContent   = c.meta || "";
        if (this.ui.title)  this.ui.title.textContent  = c.title || "";
        if (this.ui.cover)  this.ui.cover.textContent  = c.cover || "";
        if (this.ui.logline)this.ui.logline.textContent= c.logline || "";

        if (this.ui.badges){
          this.ui.badges.innerHTML = "";
          (c.badges || []).forEach(x => {
            const s = document.createElement("span");
            s.className = "badge";
            s.textContent = x;
            this.ui.badges.appendChild(s);
          });
        }
      }
  // Notify other scripts (like projects.js) that a sub-tab changed
  this.subRow.dispatchEvent(new CustomEvent("branch:subchange", {
    bubbles: true,
    detail: { branchId: this.id, key }
  }));

      if (this.isOpen) this.layoutLines();
    }

    layoutLines() {
      if (!this.tile || !this.subRow || !this.linesEl) return;
      const tRect = this.tile.getBoundingClientRect();
      const subRect = this.subRow.getBoundingClientRect();
      const linesRect = this.linesEl.getBoundingClientRect();


  const branchW = getBranchW();
  const overlap = Math.ceil(branchW / 2);

  // --- X positions (pixel-snapped) ---
  const startX = Math.round(
    (tRect.left + tRect.width / 2) - linesRect.left
  );

  const centers = this.subBtns.map(btn => {
    const r = btn.getBoundingClientRect();
    return Math.round(
      (r.left + r.width / 2) - linesRect.left
    );
  });

  const minX = Math.min(...centers);
  const maxX = Math.max(...centers);

  // --- Y positions (pixel-snapped) ---
// Start trunk exactly at the bottom edge of the tile box
const CONNECT_Y = 2; // tweak 0–4 if you want micro-adjust
const startY = Math.round(tRect.bottom - linesRect.top + CONNECT_Y);


// How far below the tile you want the horizontal bar to sit
const BAR_DROP = 140; // tweak: 110–170

const barY = startY + BAR_DROP;


  // Trunk overlaps INTO the bar
  const trunkH = Math.max(
    6,
    (barY - startY) + overlap
  );

// Bar overlaps trunk + drops
let barLeft  = Math.min(minX, startX) - overlap;
let barRight = Math.max(maxX, startX) + overlap;

// --- remove the “lip” ONLY for SERVICES (left-drawing) ---
if (this.id === "services" && this.barFrom !== "right") {
  // trunk’s outer left edge (not centerline)
  const trunkLeftEdge = Math.round(startX - branchW / 2);

  // Don't allow the bar to extend left of the trunk edge
  barLeft = Math.max(barLeft, trunkLeftEdge);
}

const barLen = Math.max(6, barRight - barLeft);



  // Apply styles (TRUNK + BAR) — REQUIRED for animation
this.trunk.style.left = `${Math.round(startX - branchW / 2)}px`;
this.trunk.style.top = `${startY}px`;
this.trunk.style.setProperty("--len", `${trunkH}px`);

this.bar.style.top = `${barY}px`;
this.bar.style.left = `${barLeft}px`;          // always position with left
this.bar.style.right = "auto";                 // clear any old right value
this.bar.style.setProperty("--len", `${barLen}px`);

// only change draw direction
this.bar.style.transformOrigin = (this.barFrom === "right") ? "right" : "left";




// Drops start INSIDE the bar
const dropTop = barY;


// Short, consistent drops (CRT OSD style)
const DROP_DEPTH = 110; // <- tweak this number (80–140 usually feels right)

this.drops.forEach((d, i) => {
  const dropLen = Math.max(6, DROP_DEPTH);

  // default: align to button center
  let dropLeft = Math.round(centers[i] - branchW / 2);

// SNAP RULE — only for SERVICES
if (this.id === "services" && i === 0 && this.barFrom !== "right") {
  dropLeft = Math.round(barLeft);
}


  // If you ever want the mirror behavior when barFrom is right:
  // if (i === this.drops.length - 1 && this.barFrom === "right") {
  //   dropLeft = Math.round(barRight - branchW);
  // }

  d.style.left = `${dropLeft}px`;
  d.style.top = `${dropTop}px`;
  d.style.setProperty("--len", `${dropLen}px`);
});


// Baseline for sub UI reveal (keep it just below the drops)
// Sub-row TOUCHES the drop ends
const TOUCH_TRIM = -6.5; // tweak 6–14 until it kisses perfectly
this.branch.style.setProperty(
  "--sub-top",
  `${barY + DROP_DEPTH - TOUCH_TRIM}px`
);




}

  }

  const branches = [
    new BranchController({
      id: "projects",
      tileId: "tile-projects",
      branchId: "projectsBranch",
      subRowId: "projectsSubRow",
      defaultKey: "films",
    }),
    new BranchController({
      id: "services",
      tileId: "tile-services",
      branchId: "servicesBranch",
      subRowId: "servicesSubRow",
      defaultKey: "video",
      ui: { meta: "srvMeta", title: "srvTitle", cover: "srvCoverLabel", logline: "srvLogline", badges: "srvBadges" },
      content: {
        video: { meta:"VIDEO / POST", title:"VIDEO / POST PRODUCTION", cover:"EDIT / COLOR / DELIVER", badges:["EDIT","COLOR","EXPORTS"], logline:"CUTS THAT LAND CLEAN. FAST TURNAROUNDS, CONSISTENT LOOKS, DELIVERABLES THAT MATCH PLATFORM SPECS." },
        gear:  { meta:"GEAR RENTAL", title:"GEAR RENTAL", cover:"CAMERA / LENS / AUDIO", badges:["LOCAL","PACKAGED","INSURED"], logline:"PICKUP-READY PACKAGES FOR SMALL CREWS. SIMPLE RATES, CLEAN KIT, REAL-WORLD OPTIONS." },
        tape:  { meta:"TAPE TRANSFER", title:"TAPE TRANSFER SERVICES", cover:"VHS / MINI-DV / HI8", badges:["DIGITIZE","ARCHIVE","FILES"], logline:"DIGITIZE TAPES WITH CLEAN SIGNAL CHAIN. FILE NAMING + ORGANIZATION SO YOUR ARCHIVE STAYS USEFUL." }
      }
    }),
    new BranchController({
      id: "people",
      tileId: "tile-people",
      branchId: "peopleBranch",
      subRowId: "peopleSubRow",
      defaultKey: "team",
      barFrom: "right",
      ui: { meta: "pplMeta", title: "pplTitle", cover: "pplCoverLabel", logline: "pplLogline", badges: "pplBadges" },
      content: {
        team:   { meta:"TEAM", title:"TEAM", cover:"CORE CREW", badges:["DIRECTOR","DP","PRODUCER"], logline:"PLACEHOLDER: YOUR CORE TEAM LIST + ROLES WILL LIVE HERE." },
        collabs:{ meta:"COLLABS", title:"COLLABORATORS", cover:"NETWORK", badges:["MUSIC","SPORT","ARTS"], logline:"PLACEHOLDER: RECURRING COLLABS / FREQUENT PARTNERS." },
        clients:{ meta:"CLIENTS", title:"CLIENT LIST", cover:"BRANDS / ARTISTS", badges:["RETAINERS","PROJECT","LOCAL"], logline:"PLACEHOLDER: FEATURED CLIENTS / PARTNERSHIPS." }
      }
    }),
    new BranchController({
      id: "connect",
      tileId: "tile-connect",
      branchId: "connectBranch",
      subRowId: "connectSubRow",
      defaultKey: "email",
      barFrom: "right",
      ui: { meta: "conMeta", title: "conTitle", cover: "conCoverLabel", logline: "conLogline", badges: "conBadges" },
      content: {
        email:{ meta:"EMAIL", title:"EMAIL", cover:"DIRECT", badges:["FASTEST","INQUIRIES"], logline:"PLACEHOLDER: YOUR EMAIL + A SIMPLE CONTACT CTA." },
        ig:   { meta:"INSTAGRAM", title:"INSTAGRAM", cover:"DM", badges:["SOCIAL","UPDATES"], logline:"PLACEHOLDER: YOUR IG HANDLE + LINK/CTA." },
        book: { meta:"BOOKING", title:"BOOKING", cover:"AVAILABILITY", badges:["CALENDAR","FORM"], logline:"PLACEHOLDER: BOOKING FLOW (FORM / CALENDLY / EMAIL TEMPLATE)." }
      }
    }),
  ].filter(b => b && b.valid);

  function controllerForSelectedTile(){
    const idx = selectedIndex();
    if (idx < 0) return null;
    const el = items[idx];
    return branches.find(b => b.tile && b.tile.id === el.id) || null;
  }

  document.addEventListener("keydown", (e) => {
    const idx = selectedIndex();
    if (idx < 0) return;

    let next = idx;
    const c = cols();

    if (e.key === "ArrowRight") next = (idx + 1) % items.length;
    if (e.key === "ArrowLeft")  next = (idx - 1 + items.length) % items.length;
    if (e.key === "ArrowDown")  next = (idx + c) % items.length;
    if (e.key === "ArrowUp")    next = (idx - c + items.length) % items.length;

    if (next !== idx){
      e.preventDefault();
      setSelected(next);
      return;
    }

    if (e.key === "Enter"){
      e.preventDefault();
      const ctrl = controllerForSelectedTile();
      if (ctrl) ctrl.toggle();
      else window.location.href = items[idx].getAttribute("href");
      return;
    }

    if (e.key === "Escape"){
      if (state.activeBranch){
        e.preventDefault();
        state.activeBranch.close();
        state.activeBranch = null;
      }
    }
  });

  setSelected(0);
});
