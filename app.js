// ==============================
// Cracked Concrete — app.js (RESTORED)
// - Working branching animation order (CSS-driven)
// - People: marquee for COLLABS + CLIENTS
// - Marquee cards support: photo + name + social links
// - Optional: click card background opens first link (if present)
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

  // If anything ever causes horizontal scroll, snap back.
  function hardResetXScroll(){
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }

  const REVEAL_AFTER_MS = 2300;
  const state = { activeBranch: null };

  // =========================================================
  // PEOPLE MARQUEE (COLLABS + CLIENTS)
  // - supports item.links: [{label:"IG", url:"..."}, ...]
  // =========================================================
  let activeMarquee = null;

  function normMarqueeItem(it){
    if (typeof it === "string") return { name: it, img: "", links: [] };
    if (it && typeof it === "object") {
      return {
        name: it.name || "ITEM",
        img: it.img || "",
        links: Array.isArray(it.links) ? it.links.filter(l => l && l.url) : []
      };
    }
    return { name: "ITEM", img: "", links: [] };
  }

  function mountMarquee(loglineEl, items, opts = {}) {
    if (!loglineEl) return null;

    const title = opts.title || "MARQUEE";
    const speed = Number.isFinite(opts.speed) ? opts.speed : 0.60;
    const hint  = opts.hint || "HOVER: PAUSE • SCROLL: SCRUB • ←/→: NUDGE • SPACE: PLAY/PAUSE";

    const data = (Array.isArray(items) ? items : []).map(normMarqueeItem);
    if (!data.length) {
      loglineEl.textContent = "";
      return null;
    }

    loglineEl.innerHTML = `
      <div class="marquee" tabindex="0" aria-label="${title}">
        <div class="marqueeViewport">
          <div class="marqueeTrack"></div>
        </div>
        <div class="mHint">${hint}</div>
      </div>
    `;

    const root = loglineEl.querySelector(".marquee");
    const track = loglineEl.querySelector(".marqueeTrack");

    // Duplicate for seamless loop
    const doubled = data.concat(data);

    track.innerHTML = doubled.map((it, idx) => {
      const name = it.name;
      const img  = it.img;

      const linksHtml = (it.links || []).map((l) => {
        const label = (l.label || "LINK").toUpperCase();
        const url = l.url;
        return `<a class="mLink" href="${url}" target="_blank" rel="noopener">${label}</a>`;
      }).join("");

      return `
        <div class="mCard" data-card="${idx}" aria-label="${name}">
          <div class="mAvatar">
            ${
              img
                ? `<img src="${img}" alt="${name}" loading="lazy" />`
                : `<span style="opacity:.6;font-size:10px;letter-spacing:.2em;">IMG</span>`
            }
          </div>

          <div class="mInfo">
            <div class="mName">${name}</div>
            ${linksHtml ? `<div class="mLinks">${linksHtml}</div>` : ``}
          </div>
        </div>
      `;
    }).join("");

    // OPTIONAL: clicking the card background opens the first social link
    // (but clicking a link button behaves normally)
    track.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const card = e.target.closest(".mCard");
      if (!card) return;
      const firstLink = card.querySelector(".mLink");
      if (firstLink) window.open(firstLink.href, "_blank", "noopener");
    });

    let mx = 0;
    let paused = false;
    let raf = 0;
    let last = performance.now();
    let interactive = false; // hovered/focused

    function apply(){
      track.style.setProperty("--mx", `${mx}px`);
    }

    function loop(now){
      const dt = Math.min(40, now - last);
      last = now;

      if (!paused) {
        mx -= speed * (dt / 16.67);

        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && Math.abs(mx) >= halfWidth) mx = 0;

        apply();
      }

      raf = requestAnimationFrame(loop);
    }

    function pause(){ paused = true; }
    function play(){ paused = false; }

    function enterInteractive(){ interactive = true; pause(); }
    function leaveInteractive(){ interactive = false; play(); }

    root.addEventListener("mouseenter", enterInteractive);
    root.addEventListener("mouseleave", leaveInteractive);
    root.addEventListener("focusin", enterInteractive);
    root.addEventListener("focusout", leaveInteractive);

    function onWheel(e){
      e.preventDefault();
      interactive = true;
      paused = true;

      mx -= e.deltaY * 0.85;

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0 && Math.abs(mx) >= halfWidth) mx = 0;

      apply();
    }
    root.addEventListener("wheel", onWheel, { passive:false });

    function onKey(e){
      if (!interactive) return;

      if (e.key === "ArrowLeft"){
        e.preventDefault();
        paused = true;
        mx += 55;
        apply();
      } else if (e.key === "ArrowRight"){
        e.preventDefault();
        paused = true;
        mx -= 55;
        apply();
      } else if (e.key === " "){
        e.preventDefault();
        paused = !paused;
      }
    }
    window.addEventListener("keydown", onKey);

    raf = requestAnimationFrame(loop);
    hardResetXScroll();

    return {
      destroy(){
        cancelAnimationFrame(raf);
        window.removeEventListener("keydown", onKey);
        root.removeEventListener("wheel", onWheel);
        root.removeEventListener("mouseenter", enterInteractive);
        root.removeEventListener("mouseleave", leaveInteractive);
        root.removeEventListener("focusin", enterInteractive);
        root.removeEventListener("focusout", leaveInteractive);
        loglineEl.innerHTML = "";
        hardResetXScroll();
      }
    };
  }

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
        hardResetXScroll();
      });
    }

    close(){
      this.isOpen = false;
      this.branch.classList.remove("is-open", "is-drawing", "is-ready");

      if (activeMarquee) { activeMarquee.destroy(); activeMarquee = null; }
      hardResetXScroll();
    }

    open(){
      if (state.activeBranch && state.activeBranch !== this) state.activeBranch.close();
      state.activeBranch = this;

      this.isOpen = true;
      this.branch.classList.add("is-open");
      this.branch.classList.remove("is-ready");

      hardResetXScroll();

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
            hardResetXScroll();
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
        // PEOPLE: wheel-only mode for collabs/clients
        if (this.id === "people" && this.branch) {
          const wheelOnly = (key === "collabs" || key === "clients");
          this.branch.classList.toggle("wheelOnly", wheelOnly);
        }

        if (this.ui.meta)   this.ui.meta.textContent   = c.meta || "";
        if (this.ui.title)  this.ui.title.textContent  = c.title || "";
        if (this.ui.cover)  this.ui.cover.textContent  = c.cover || "";

        // LOG-LINE AREA:
        // - if c.marquee exists -> marquee
        // - else -> plain text
        if (this.ui.logline){
          if (activeMarquee) { activeMarquee.destroy(); activeMarquee = null; }

          if (Array.isArray(c.marquee) && c.marquee.length){
            activeMarquee = mountMarquee(this.ui.logline, c.marquee, { title: c.title || "MARQUEE" });
          } else {
            this.ui.logline.textContent = c.logline || "";
          }
        }

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

      this.subRow.dispatchEvent(new CustomEvent("branch:subchange", {
        bubbles: true,
        detail: { branchId: this.id, key }
      }));

      if (this.isOpen) this.layoutLines();
      hardResetXScroll();
    }

    layoutLines() {
      if (!this.tile || !this.subRow || !this.linesEl) return;
      const tRect = this.tile.getBoundingClientRect();
      const linesRect = this.linesEl.getBoundingClientRect();

      const branchW = getBranchW();
      const overlap = Math.ceil(branchW / 2);

      const startX = Math.round((tRect.left + tRect.width / 2) - linesRect.left);

      const centers = this.subBtns.map(btn => {
        const r = btn.getBoundingClientRect();
        return Math.round((r.left + r.width / 2) - linesRect.left);
      });

      const minX = Math.min(...centers);
      const maxX = Math.max(...centers);

      const CONNECT_Y = 2;
      const startY = Math.round(tRect.bottom - linesRect.top + CONNECT_Y);

      const BAR_DROP = 140;
      const barY = startY + BAR_DROP;

      const trunkH = Math.max(6, (barY - startY) + overlap);

      let barLeft  = Math.min(minX, startX) - overlap;
      let barRight = Math.max(maxX, startX) + overlap;

      if (this.id === "services" && this.barFrom !== "right") {
        const trunkLeftEdge = Math.round(startX - branchW / 2);
        barLeft = Math.max(barLeft, trunkLeftEdge);
      }

      const barLen = Math.max(6, barRight - barLeft);

      this.trunk.style.left = `${Math.round(startX - branchW / 2)}px`;
      this.trunk.style.top = `${startY}px`;
      this.trunk.style.setProperty("--len", `${trunkH}px`);

      this.bar.style.top = `${barY}px`;
      this.bar.style.left = `${barLeft}px`;
      this.bar.style.right = "auto";
      this.bar.style.setProperty("--len", `${barLen}px`);
      this.bar.style.transformOrigin = (this.barFrom === "right") ? "right" : "left";

      const dropTop = barY;
      const DROP_DEPTH = 110;

      this.drops.forEach((d, i) => {
        const dropLen = Math.max(6, DROP_DEPTH);
        let dropLeft = Math.round(centers[i] - branchW / 2);

        if (this.id === "services" && i === 0 && this.barFrom !== "right") {
          dropLeft = Math.round(barLeft);
        }

        d.style.left = `${dropLeft}px`;
        d.style.top = `${dropTop}px`;
        d.style.setProperty("--len", `${dropLen}px`);
      });

      const TOUCH_TRIM = -6.5;
      this.branch.style.setProperty("--sub-top", `${barY + DROP_DEPTH - TOUCH_TRIM}px`);
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
        video: { meta:"Production", title:"Production", cover:"EDIT / COLOR / DELIVER", badges:["EDIT","COLOR","EXPORTS"], logline:"CUTS THAT LAND CLEAN. FAST TURNAROUNDS, CONSISTENT LOOKS, DELIVERABLES THAT MATCH PLATFORM SPECS." },
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
        team: {
          meta:"TEAM",
          title:"TEAM",
          cover:"CORE CREW",
          badges:["DIRECTOR","DP","PRODUCER"],
          logline:"PLACEHOLDER: YOUR CORE TEAM LIST + ROLES WILL LIVE HERE."
        },
        collabs:{
          meta:"COLLABS",
          title:"COLLABORATORS",
          cover:"NETWORK",
          badges:["MUSIC","SPORT","ARTS"],
          marquee: [
            {
              name:"MAFUBA",
              img:"assets/people/mafuba.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" }
              ]
            },
            {
              name:"VANCOUVER BANDITS",
              img:"assets/people/bandits.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" }
              ]
            },
            {
              name:"FIRST FLOOR COLLECTIVE",
              img:"assets/people/firstfloor.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" }
              ]
            },
            {
              name:"JAMIE MITRI",
              img:"assets/people/jamie.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" }
              ]
            },
            {
              name:"SATCHEL RAMRAJ",
              img:"assets/people/satchel.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" }
              ]
            },
            {
              name:"JOSHUA GARRIDO",
              img:"assets/people/joshua.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" }
              ]
            }
          ]
        },
        clients:{
          meta:"CLIENTS",
          title:"CLIENTS",
          cover:"BRANDS / ARTISTS",
          badges:["RETAINERS","PROJECT","LOCAL"],
          marquee: [
            {
              name:"PLACEHOLDER CLIENT 01",
              img:"assets/clients/client-01.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" },
                { label:"YT", url:"https://youtube.com/" }
              ]
            },
            {
              name:"PLACEHOLDER CLIENT 02",
              img:"assets/clients/client-02.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" }
              ]
            },
            {
              name:"PLACEHOLDER CLIENT 03",
              img:"assets/clients/client-03.jpg",
              links: [
                { label:"WEB", url:"https://example.com" }
              ]
            },
            {
              name:"PLACEHOLDER CLIENT 04",
              img:"assets/clients/client-04.jpg",
              links: [
                { label:"IG", url:"https://instagram.com/" }
              ]
            }
          ]
        }
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
        hardResetXScroll();
      }
    }
  });

  setSelected(0);
  hardResetXScroll();
});
