// ==============================
// Cracked Concrete — app.js
// FIXES:
// 1) NO MORE global line IDs (prevents everything breaking when IDs get duplicated)
//    -> Each branch finds its own .bLine.trunk/.bar/.drop/.stem INSIDE that branch.
// 2) Stem goes DOWN to the panel, anchored under the ACTIVE sub button.
// 3) “Chunky” retro draw is driven by CSS steps — JS just retriggers is-drawing cleanly.
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


// ==============================
// Branch Controller
// ==============================
document.addEventListener("DOMContentLoaded", () => {

  // Keyboard navigation (grid)
  const items = Array.from(document.querySelectorAll(".item"));
  const grid = document.getElementById("grid");

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

  // Read branch thickness from CSS so JS stays in sync
  function getBranchW(){
    const v = getComputedStyle(document.documentElement).getPropertyValue("--branchW").trim();
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 8;
  }

  // Match your CSS timing (update if you change CSS delays)
  const REVEAL_AFTER_MS = 1150;

  const state = { activeBranch: null };

  class BranchController {
    constructor(opts){
      this.id = opts.id;

      this.tile   = document.getElementById(opts.tileId);
      this.branch = document.getElementById(opts.branchId);
      this.subRow = document.getElementById(opts.subRowId);
      this.subBtns = this.subRow ? Array.from(this.subRow.querySelectorAll(".subBtn")) : [];

      this.linesEl = this.branch ? this.branch.querySelector(".branchLines") : null;

      // ✅ IMPORTANT: find lines INSIDE this branch (no global IDs)
      // Your HTML must have:
      // .bLine.v.trunk
      // .bLine.h.bar
      // .bLine.v.drop   (x3)
      // .bLine.v.stem
      this.trunk = this.branch ? this.branch.querySelector(".bLine.trunk") : null;
      this.bar   = this.branch ? this.branch.querySelector(".bLine.bar") : null;
      this.drops = this.branch ? Array.from(this.branch.querySelectorAll(".bLine.drop")) : [];
      this.stem  = this.branch ? this.branch.querySelector(".bLine.stem") : null;

      this.ui = {
        meta:   document.getElementById(opts.ui.meta),
        title:  document.getElementById(opts.ui.title),
        cover:  document.getElementById(opts.ui.cover),
        logline:document.getElementById(opts.ui.logline),
        badges: document.getElementById(opts.ui.badges),
      };

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
        this.subBtns.length === 3 &&
        this.drops.length === 3
      );
      if (!this.valid) return;

      // Tile click toggles this branch (no navigation on index)
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
      if (state.activeBranch && state.activeBranch !== this) {
        state.activeBranch.close();
      }
      state.activeBranch = this;

      this.isOpen = true;

      // Open, but keep content hidden until ready
      this.branch.classList.add("is-open");
      this.branch.classList.remove("is-ready");

      // Force layout AFTER it is visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
this.layoutLines();
requestAnimationFrame(() => this.layoutLines()); // second pass after --sub-top affects layout
if (this.defaultKey) this.setActive(this.defaultKey);


          // Restart chunky draw (CSS controls the stepped chunks)
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
      if (!c) {
        // still move stem even if content missing
        if (this.isOpen) this.layoutLines();
        return;
      }

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

      // ✅ Update branch geometry so stem snaps under active section
      if (this.isOpen) this.layoutLines();
    }

    layoutLines(){
      const linesRect = this.linesEl.getBoundingClientRect();
      const tRect = this.tile.getBoundingClientRect();
      const subRect = this.subRow.getBoundingClientRect();

      const branchW = getBranchW();

      // Start X = center of tile (relative to branchLines box)
      const startX = (tRect.left + tRect.width / 2) - linesRect.left;

      // Button centers (relative)
      const centers = this.subBtns.map(btn => {
        const r = btn.getBoundingClientRect();
        return (r.left + r.width / 2) - linesRect.left;
      });

      const minX = Math.min(...centers);
      const maxX = Math.max(...centers);

      const dropGap = 10;

      // Where trunk starts (bottom of tile) and where bar sits (just above buttons)
      const startY = (tRect.bottom - linesRect.top);
      const barY   = (subRect.top  - linesRect.top) - dropGap;

      const trunkH = Math.max(6, barY - startY);
      const dropH  = Math.max(6, (subRect.top - linesRect.top) - barY);

      // Bar includes trunk so it always intersects
      const barLeft  = Math.min(minX, startX);
      const barRight = Math.max(maxX, startX);
      const barLen   = Math.max(6, barRight - barLeft);

      // Trunk
      this.trunk.style.left = `${startX - (branchW / 2)}px`;
      this.trunk.style.top  = `${startY}px`;
      this.trunk.style.setProperty("--len", `${trunkH}px`);

      // Bar
      this.bar.style.left = `${barLeft}px`;
      this.bar.style.top  = `${barY}px`;
      this.bar.style.setProperty("--len", `${barLen}px`);

      // Drops go down to each sub button
      this.drops.forEach((d, i) => {
        d.style.left = `${centers[i] - (branchW / 2)}px`;
        d.style.top  = `${barY}px`;
        d.style.setProperty("--len", `${dropH}px`);
      });

      // Place the buttons row after drops
      this.branch.style.setProperty("--sub-top", `${barY + dropH}px`);

      // ===== STEM: connect ACTIVE category to the panel =====
      const panel = this.branch.querySelector(".branchPanel");
      if (panel && this.stem) {
        const panelRect = panel.getBoundingClientRect();

        const activeBtn = this.subRow.querySelector('.subBtn[aria-current="true"]');
        const anchorX = activeBtn
          ? ((activeBtn.getBoundingClientRect().left + activeBtn.getBoundingClientRect().width / 2) - linesRect.left)
          : centers[1]; // fallback: middle button

        // Start stem BELOW the button row so it doesn’t slice through buttons
        const STEM_GAP = 10;
        const stemTop = (subRect.bottom - linesRect.top) + STEM_GAP;

        // Reach panel top
        const stemH = Math.max(6, (panelRect.top - linesRect.top) - stemTop);

        this.stem.style.left = `${anchorX - (branchW / 2)}px`;
        this.stem.style.top  = `${stemTop}px`;
        this.stem.style.setProperty("--len", `${stemH}px`);
      }
    }
  }

  // ==============================
  // Register branches
  // ==============================
  const branches = [
    new BranchController({
      id: "projects",
      tileId: "tile-projects",
      branchId: "projectsBranch",
      subRowId: "projectsSubRow",
      ui: { meta: "projMeta", title: "projTitle", cover: "projCoverLabel", logline: "projLogline", badges: "projBadges" },
      defaultKey: "films",
      content: {
        films: { meta:"FILMS", title:"FILMS", cover:"FILM REEL", badges:["SHORTS","FEATURES","FESTIVAL"], logline:"SELECTED NARRATIVE WORK. STRONG VISUAL LANGUAGE, CLEAN DELIVERY, AND A TACTILE FINISH." },
        musicvideos: { meta:"MUSIC VIDEOS", title:"MUSIC VIDEOS", cover:"PERFORMANCE / CONCEPT", badges:["LIVE SESSIONS","1:1","9:16"], logline:"PERFORMANCE CAPTURE + CONCEPT PIECES. SOCIAL DELIVERABLES, MULTI-ASPECT EXPORTS." },
        docs: { meta:"DOCUMENTARIES", title:"DOCUMENTARIES", cover:"OBSERVATIONAL", badges:["CULTURE","COMMUNITY","ARCHIVAL"], logline:"EXPERIMENTAL + CULTURE-DRIVEN DOC WORK. CHARACTER, PLACE, AND RHYTHM." }
      }
    }),

    new BranchController({
      id: "services",
      tileId: "tile-services",
      branchId: "servicesBranch",
      subRowId: "servicesSubRow",
      ui: { meta: "srvMeta", title: "srvTitle", cover: "srvCoverLabel", logline: "srvLogline", badges: "srvBadges" },
      defaultKey: "video",
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
      ui: { meta: "pplMeta", title: "pplTitle", cover: "pplCoverLabel", logline: "pplLogline", badges: "pplBadges" },
      defaultKey: "team",
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
      ui: { meta: "conMeta", title: "conTitle", cover: "conCoverLabel", logline: "conLogline", badges: "conBadges" },
      defaultKey: "email",
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

  // Keyboard handler:
  // - arrows move selection
  // - Enter toggles branch if available; otherwise navigates
  // - Escape closes active branch
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
