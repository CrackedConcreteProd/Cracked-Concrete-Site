// ==============================
// Cracked Concrete — app.js
// - Home: branching animation order (CSS-driven)
// - People: marquee for COLLABS + CLIENTS
// - Marquee cards support: photo + name + social links
// - Wheel behavior:
//    * wheelOnly mode: normal wheel scrubs marquee
//    * otherwise: Shift + wheel scrubs marquee (page can scroll)
// ==============================

// ===== ICONS =====
const ICONS = {
  projects: [
    "0000000000000000", "0000000000000000", "0000000000000000", "0000001111111000",
    "0000001000001000", "0100011111111110", "0110110000000110", "0111100111110100",
    "0110100100010100", "0110100100010100", "0111100111110100", "0110110000000100",
    "0100011111111100", "0000000000000000", "0000000000000000", "0000000000000000",
  ],
  services: [
    "0000000000000000", "0000000000000000", "0000000000000000", "0011111111111100",
    "0100000000000010", "0100110000110010", "0101001111001010", "0101001111001010",
    "0100110000110010", "0100000000000010", "0100000000000010", "0100000000000010",
    "0100111111110010", "0111111111111110", "0000000000000000", "0000000000000000",
  ],
  people: [
    "0000000000000000", "0000000000000000", "0000000000000000", "0000011111000000",
    "0000110001100000", "0000110001100000", "0000011111000000", "0000000110000000",
    "0000111111110000", "0001100000011000", "0001100000011000", "0001100000011000",
    "0000111111110000", "0000000000000000", "0000000000000000", "0000000000000000",
  ],
  connect: [
    "0000000000000000", "0000000000000000", "0000000000000111", "0000000000011100",
    "0000000000010000", "0000000000011000", "0000000000001100", "0011111111000110",
    "0110000000100010", "0100000000101110", "0100000111111000", "0100000000100000",
    "0110000000100000", "0011111111000000", "0000000000000000", "0000000000000000",
  ],
};

function buildIcon(el, pattern) {
  el.innerHTML = "";
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      const d = document.createElement("div");
      d.className = "px" + (pattern[y][x] === "1" ? " on" : "");
      el.appendChild(d);
    }
  }
}

// Render icons anywhere they exist (safe on all pages)
document.querySelectorAll(".pixel").forEach((el) => {
  const key = el.dataset.icon;
  if (ICONS[key]) buildIcon(el, ICONS[key]);
});

document.addEventListener("DOMContentLoaded", () => {
  // ---------- PAGE GUARD (HOME ONLY) ----------
  const path = (window.location.pathname || "").toLowerCase();
  const isHome =
    path === "/" ||
    path.endsWith("/index.html") ||
    path.endsWith("index.html");

  if (!isHome) return;

  const items = Array.from(document.querySelectorAll(".item"));
  const grid = document.getElementById("grid");
  if (!items.length || !grid) return;

  // Safety: if a tile has a branch attached, never navigate away on click.
  items.forEach((a) => {
    a.addEventListener("click", (e) => {
      const page = a.dataset.page; // "projects/services/people/connect"
      if (!page) return;
      const branchEl = document.getElementById(`${page}Branch`);
      if (branchEl) e.preventDefault();
    }, true);
  });

  function setSelected(i) {
    items.forEach((b, idx) =>
      b.setAttribute("aria-selected", idx === i ? "true" : "false")
    );
    items[i].focus({ preventScroll: true });
  }

  function selectedIndex() {
    return items.findIndex(b => b.getAttribute("aria-selected") === "true");
  }

  function cols() {
    const style = window.getComputedStyle(grid);
    return style.gridTemplateColumns.split(" ").length;
  }

  function getBranchW() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--branchW").trim();
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 8;
  }

  // Only ever reset horizontal scroll (never vertical)
  function hardResetXScroll() {
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }

  // Reveal UI after branch animation completes
  const REVEAL_AFTER_MS = 1500; // Updated to match actual animation duration
  const state = { activeBranch: null };

  // =========================================================
  // PEOPLE MARQUEE (COLLABS + CLIENTS)
  // =========================================================
  let activeMarquee = null;

  function normMarqueeItem(it) {
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
      </div>
    `;

    const root = loglineEl.querySelector(".marquee");
    const track = loglineEl.querySelector(".marqueeTrack");

    const doubled = data.concat(data);

    track.innerHTML = doubled.map((it, idx) => {
      const name = it.name;
      const img = it.img;

      const linksHtml = (it.links || []).map((l) => {
        const label = (l.label || "LINK").toUpperCase();
        const url = l.url;
        return `<a class="mLink" href="${url}" target="_blank" rel="noopener">${label}</a>`;
      }).join("");

      return `
        <div class="mCard" data-card="${idx}" aria-label="${name}">
          <div class="mAvatar">
            ${img
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
    let interactive = false;

    function apply() {
      track.style.setProperty("--mx", `${mx}px`);
    }

    function loop(now) {
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

    function pause() { paused = true; }
    function play() { paused = false; }

    function enterInteractive() { interactive = true; pause(); }
    function leaveInteractive() { interactive = false; play(); }

    root.addEventListener("mouseenter", enterInteractive);
    root.addEventListener("mouseleave", leaveInteractive);
    root.addEventListener("focusin", enterInteractive);
    root.addEventListener("focusout", leaveInteractive);

    function onWheel(e) {
      const wheelOnly = !!root.closest("#peopleBranch.wheelOnly");
      if (!wheelOnly && !e.shiftKey) return; // allow page scroll
      e.preventDefault();

      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      mx -= d * 0.85;
      apply();
    }

    root.addEventListener("wheel", onWheel, { passive: false });

    function onKey(e) {
      if (!interactive) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        paused = true;
        mx += 55;
        apply();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        paused = true;
        mx -= 55;
        apply();
      } else if (e.key === " ") {
        e.preventDefault();
        paused = !paused;
      }
    }
    window.addEventListener("keydown", onKey);

    raf = requestAnimationFrame(loop);
    hardResetXScroll();

    return {
      destroy() {
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
  // ---- BRANCH SVG HELPERS (STEP 1) ----
  function svgEl(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  function ptsToPath(points) {
    if (!points || !points.length) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`;
    return d;
  }

  function pathLen(points) {
    let len = 0;
    for (let i = 1; i < points.length; i++) {
      len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    }
    return Math.max(1, len);
  }

  function dash(path, len, p) {
    const clamped = Math.max(0, Math.min(1, p));
    const drawn = len * clamped;
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len - drawn}`;
  }

  // Chunky “OSD” stepping
  function quantize(p, steps) {
    const s = Math.max(1, steps | 0);
    return Math.floor(p * s) / s;
  }

  // ---- CENTER SPINE + OBSTACLE AVOIDANCE (STEP 2) ----
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function rectsOverlap(a, b) {
    return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
  }

  // Does a vertical segment at x from y1..y2 hit rect r?
  function verticalHitsRect(x, y1, y2, r) {
    const top = Math.min(y1, y2);
    const bot = Math.max(y1, y2);
    if (x < r.x || x > r.x + r.w) return false;
    return !(bot < r.y || top > r.y + r.h);
  }

  // Get obstacles for all tiles except selected.
  // coords are local to linesEl (your branchLines overlay)
  function getTileObstacles(linesEl, selectedTile, pad) {
    const obs = [];
    const tiles = Array.from(document.querySelectorAll(".tile"));

    tiles.forEach(t => {
      if (t === selectedTile) return;
      const r = t.getBoundingClientRect();
      const base = linesEl.getBoundingClientRect();

      const x = (r.left - base.left) - pad;
      const y = (r.top - base.top) - pad;
      const w = r.width + pad * 2;
      const h = r.height + pad * 2;

      obs.push({ x, y, w, h });
    });

    return obs;
  }

  // Find a safe X near preferredX that does NOT cut through any obstacles for the trunk span.
  // Searches left/right in steps until it finds a clear line.
  function findSafeSpineX(preferredX, yTop, yBot, obstacles, minX, maxX, step) {
    const tries = Math.ceil((maxX - minX) / step);
    const candidates = [];

    // Build an alternating list: 0, +1, -1, +2, -2...
    for (let i = 0; i <= tries; i++) {
      candidates.push(i);
      if (i !== 0) candidates.push(-i);
    }

    for (const k of candidates) {
      const x = preferredX + k * step;
      if (x < minX || x > maxX) continue;

      let hit = false;
      for (const r of obstacles) {
        if (verticalHitsRect(x, yTop, yBot, r)) {
          hit = true; break;
        }
      }
      if (!hit) return x;
    }

    // Fallback: return preferred even if it hits (should be rare)
    return clamp(preferredX, minX, maxX);
  }
  // Does a horizontal segment at y from x1..x2 hit rect r?
  function horizontalHitsRect(y, x1, x2, r) {
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    if (y < r.y || y > r.y + r.h) return false;
    return !(right < r.x || left > r.x + r.w);
  }

  // Find a safe barY near preferredY that does NOT cut through obstacles for x span.
  function findSafeBarY(preferredY, xLeft, xRight, obstacles, minY, maxY, step) {
    const tries = Math.ceil((maxY - minY) / step);
    const candidates = [];
    for (let i = 0; i <= tries; i++) {
      candidates.push(i);
      if (i !== 0) candidates.push(-i);
    }

    for (const k of candidates) {
      const y = preferredY + k * step;
      if (y < minY || y > maxY) continue;

      let hit = false;
      for (const r of obstacles) {
        if (horizontalHitsRect(y, xLeft, xRight, r)) {
          hit = true; break;
        }
      }
      if (!hit) return y;
    }

    return clamp(preferredY, minY, maxY);
  }
  // Find a safe elbowY near preferredY so the knee segment (startX -> routeX) doesn't hit obstacles.
  function findSafeElbowY(preferredY, startX, routeX, obstacles, minY, maxY, step) {
    const tries = Math.ceil((maxY - minY) / step);
    const candidates = [];
    for (let i = 0; i <= tries; i++) {
      candidates.push(i);
      if (i !== 0) candidates.push(-i);
    }

    for (const k of candidates) {
      const y = preferredY + k * step;
      if (y < minY || y > maxY) continue;

      let hit = false;
      for (const r of obstacles) {
        if (horizontalHitsRect(y, startX, routeX, r)) {
          hit = true; break;
        }
      }
      if (!hit) return y;
    }

    return clamp(preferredY, minY, maxY);
  }


  class BranchController {
    constructor(opts) {
      this.id = opts.id;

      this.tile = document.getElementById(opts.tileId);
      this.branch = document.getElementById(opts.branchId);
      this.subRow = document.getElementById(opts.subRowId);
      this.subBtns = this.subRow ? Array.from(this.subRow.querySelectorAll(".subBtn")) : [];

      this.barFrom = (opts.barFrom || "left").toLowerCase();

      this.linesEl = this.branch ? this.branch.querySelector(".branchLines") : null;

      // --- IMPORTANT: these MUST exist for valid branches ---
      // (PATCH: auto-create missing lines + force drops to match subBtns)
      const ensureLine = (selector, className, parent) => {
        if (!parent) return null;
        let el = parent.querySelector(selector);
        if (!el) {
          el = document.createElement("div");
          el.className = className;
          parent.appendChild(el);
        }
        return el;
      };

      // Ensure .branchLines exists
      if (this.branch && !this.linesEl) {
        this.linesEl = document.createElement("div");
        this.linesEl.className = "branchLines";
        this.branch.prepend(this.linesEl);
      }

      // Ensure core segments exist
      this.trunk = this.branch ? this.branch.querySelector(".bLine.trunk") : null;
      this.trunk = ensureLine(".bLine.trunk", "bLine v trunk", this.linesEl);

      // Knee + stem are extra routing segments (to bend around icons)
      this.knee = this.branch ? this.branch.querySelector(".bLine.knee") : null;
      this.knee = ensureLine(".bLine.knee", "bLine h knee", this.linesEl);

      this.stem = this.branch ? this.branch.querySelector(".bLine.stem") : null;
      this.stem = ensureLine(".bLine.stem", "bLine v stem", this.linesEl);

      this.bar = this.branch ? this.branch.querySelector(".bLine.bar") : null;
      this.bar = ensureLine(".bLine.bar", "bLine h bar", this.linesEl);

      // Drops
      this.drops = this.linesEl ? Array.from(this.linesEl.querySelectorAll(".bLine.drop")) : [];
      const need = this.subBtns.length;
      const have = this.drops.length;

      if (need > have) {
        for (let i = have; i < need; i++) {
          const d = document.createElement("div");
          d.className = "bLine v drop";
          this.linesEl.appendChild(d);
          this.drops.push(d);
        }
      } else if (need < have) {
        for (let i = have - 1; i >= need; i--) {
          this.drops[i].remove();
          this.drops.pop();
        }
      }

      // --- STEP 1: SVG renderer (kept alongside legacy div segments) ---
      this.svg = this.linesEl ? this.linesEl.querySelector(".branchSvg") : null;
      if (this.linesEl && !this.svg) {
        this.svg = svgEl("svg");
        this.svg.setAttribute("class", "branchSvg");
        this.svg.setAttribute("aria-hidden", "true");

        this.pTrunk = svgEl("path"); this.pTrunk.setAttribute("class", "branchPath");
        this.pTrunk.setAttribute("stroke-dasharray", "1");
        this.pTrunk.setAttribute("stroke-dashoffset", "1");

        this.pStem = svgEl("path"); this.pStem.setAttribute("class", "branchPath");
        this.pStem.setAttribute("stroke-dasharray", "1");
        this.pStem.setAttribute("stroke-dashoffset", "1");

        this.pBar = svgEl("path"); this.pBar.setAttribute("class", "branchPath");
        this.pBar.setAttribute("stroke-dasharray", "1");
        this.pBar.setAttribute("stroke-dashoffset", "1");

        this.svg.appendChild(this.pTrunk);
        this.svg.appendChild(this.pStem);
        this.svg.appendChild(this.pBar);

        this.pDrops = [];
        for (let i = 0; i < this.subBtns.length; i++) {
          const p = svgEl("path");
          p.setAttribute("class", "branchPath");
          p.setAttribute("stroke-dasharray", "1");
          p.setAttribute("stroke-dashoffset", "1");
          this.svg.appendChild(p);
          this.pDrops.push(p);
        }

        this.linesEl.appendChild(this.svg);
      } else if (this.svg) {
        // Ensure drop paths match buttons
        const existing = Array.from(this.svg.querySelectorAll("path")).slice(3); // after trunk/stem/bar
        existing.forEach(p => p.remove());
        this.pDrops = [];
        for (let i = 0; i < this.subBtns.length; i++) {
          const p = svgEl("path");
          p.setAttribute("class", "branchPath");
          p.setAttribute("stroke-dasharray", "1");
          p.setAttribute("stroke-dashoffset", "1");
          this.svg.appendChild(p);
          this.pDrops.push(p);
        }
      }

      this.ui = opts.ui ? {
        meta: document.getElementById(opts.ui.meta),
        title: document.getElementById(opts.ui.title),
        cover: document.getElementById(opts.ui.cover),
        logline: document.getElementById(opts.ui.logline),
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
        this.knee &&
        this.stem &&
        this.bar &&
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

    close() {
      this.isOpen = false;
      this.branch.classList.remove("is-open", "is-drawing", "is-ready");
      if (activeMarquee) { activeMarquee.destroy(); activeMarquee = null; }
      hardResetXScroll();
    }

    open() {
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

    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    }

    setActive(key) {
      this.subBtns.forEach(b =>
        b.setAttribute("aria-current", b.dataset.sub === key ? "true" : "false")
      );

      const c = this.content[key];
      if (c && this.ui) {
        if (this.id === "people" && this.branch) {
          const wheelOnly = (key === "collabs" || key === "clients");
          this.branch.classList.toggle("wheelOnly", wheelOnly);
        }

        if (this.ui.meta) this.ui.meta.textContent = c.meta || "";
        if (this.ui.title) this.ui.title.textContent = c.title || "";
        if (this.ui.cover) this.ui.cover.textContent = c.cover || "";

        if (this.ui.logline) {
          if (activeMarquee) { activeMarquee.destroy(); activeMarquee = null; }

          if (Array.isArray(c.marquee) && c.marquee.length) {
            activeMarquee = mountMarquee(this.ui.logline, c.marquee, { title: c.title || "MARQUEE" });
          } else {
            this.ui.logline.textContent = c.logline || "";
          }
        }

        if (this.ui.badges) {
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

      // Don't restart animation when switching subsections
      // (animation only plays when initially opening the branch)
      hardResetXScroll();
    }

    // Bend-route layout:
    // trunk down -> knee (horizontal to a safe corridor) -> stem down -> bar -> drops
    layoutLines() {
      if (!this.tile || !this.subRow || !this.linesEl) return;

      const tRect = this.tile.getBoundingClientRect();
      const linesRect = this.linesEl.getBoundingClientRect();

      const branchW = getBranchW();
      const overlap = Math.ceil(branchW / 2);

      // Start from tile center
      const startX = Math.round((tRect.left + tRect.width / 2) - linesRect.left);

      // Y positions
      const CONNECT_Y = 2;
      const startY = Math.round(tRect.bottom - linesRect.top + CONNECT_Y);

      // Sub button centers (bar + drops)
      const centers = this.subBtns.map(btn => {
        const r = btn.getBoundingClientRect();
        return Math.round((r.left + r.width / 2) - linesRect.left);
      });

      const centersMinX = Math.min(...centers);
      const centersMaxX = Math.max(...centers);

      // Elbow Y: try to sit between top row and lower row labels
      const tilePeople = document.getElementById("tile-people");
      const tileConnect = document.getElementById("tile-connect");
      const pplRect = tilePeople ? tilePeople.getBoundingClientRect() : null;
      const conRect = tileConnect ? tileConnect.getBoundingClientRect() : null;

      let elbowY = startY + 56; // fallback
      if (pplRect && conRect) {
        const lowerRowTop = Math.min(pplRect.top, conRect.top);
        elbowY = Math.round(lowerRowTop - linesRect.top - 22); // clearance above labels
        elbowY = Math.max(elbowY, startY + 44);
      }

      // Bar Y should sit above subRow
      const subRect = this.subRow.getBoundingClientRect();
      const desiredBarY = Math.round(subRect.top - linesRect.top - 18);

      const minExtra = 80;
      const maxExtra = 170;

      // First compute the preferred barY in your existing range
      let barY = Math.max(elbowY + minExtra, Math.min(desiredBarY, elbowY + maxExtra));

      // Now nudge barY to avoid cutting through other tiles/labels (chunky OSD steps)
      const barSpanLeft = Math.min(centersMinX, startX);   // conservative span (we’ll refine after routeX too)
      const barSpanRight = Math.max(centersMaxX, startX);

      const barMinY = elbowY + 28;                         // don't go above elbow too tightly
      const barMaxY = Math.min(barY + 220, (subRect.top - linesRect.top) - 10); // don't crash into subRow

      // --- STEP 2: Center spine that avoids other tiles/labels ---
      const gridEl = document.getElementById("grid") || this.tile.closest(".grid") || document.body;
      const gridR = gridEl.getBoundingClientRect();

      // preferredX in branchLines-local coords
      const preferredX = (gridR.left + gridR.width / 2) - linesRect.left;

      // Get obstacles (other tiles) BEFORE any safe-bar or safe-spine calls
      const obstacles = getTileObstacles(this.linesEl, this.tile, 12);

      // Now nudge barY to avoid cutting through other tiles/labels (chunky OSD steps)
      barY = findSafeBarY(barY, barSpanLeft, barSpanRight, obstacles, barMinY, barMaxY, 10);


      // obstacles (other tiles)

      // Keep the spine within safe margins of the branch area
      const spineMinX = 18;
      const spineMaxX = (linesRect.width - 18);

      // trunk span: from just below selected tile down to just above the bar
      const yTop = startY;
      const yBot = barY;

      // Nudge spine in chunky steps to keep OSD feel
      const routeStep = 10;

      const routeX = findSafeSpineX(preferredX, yTop, yBot, obstacles, spineMinX, spineMaxX, routeStep);
      // --- STEP 4: Nudge elbowY so the knee doesn't cross tiles/labels ---
      const elbowStep = 10;

      // keep elbow in a sensible band: below startY, above barY
      const elbowMinY = startY + 34;
      const elbowMaxY = barY - 34;

      elbowY = findSafeElbowY(elbowY, startX, routeX, obstacles, elbowMinY, elbowMaxY, elbowStep);


      // Hide all DIV-based branch elements immediately (we only use SVG now)
      if (this.trunk) this.trunk.style.display = "none";
      if (this.stem) this.stem.style.display = "none";
      if (this.knee) this.knee.style.display = "none";
      if (this.bar) this.bar.style.display = "none";
      this.drops.forEach(d => d.style.display = "none");

      // Calculate drop depth for SVG rendering
      const dropDepth = Math.max(
        60,
        Math.min(120, Math.round((subRect.top - linesRect.top) - barY - 8))
      );

      const TOUCH_TRIM = -6.5;
      this.branch.style.setProperty("--sub-top", `${barY + dropDepth - TOUCH_TRIM}px`);

      // --- SVG PATH RENDERING: Single continuous path per button ---
      if (this.svg && this.pDrops) {
        // Hide unused paths
        if (this.pTrunk) this.pTrunk.style.display = "none";
        if (this.pStem) this.pStem.style.display = "none";
        if (this.pBar) this.pBar.style.display = "none";

        // Clear old data and hide everything
        this.svg.style.visibility = "hidden";
        this.pDrops.forEach(p => {
          p.removeAttribute("d");
          p.removeAttribute("stroke-dasharray");
          p.removeAttribute("stroke-dashoffset");
          p.classList.remove("animating");
        });

        // Build path data for each button
        const pathData = centers.map((cx, i) => {
          const pts = [
            { x: startX, y: startY },
            { x: startX, y: elbowY },
            { x: routeX, y: elbowY },
            { x: routeX, y: barY },
            { x: cx, y: barY },
            { x: cx, y: barY + dropDepth }
          ];
          return {
            path: this.pDrops[i],
            d: ptsToPath(pts),
            length: pathLen(pts)
          };
        });

        const DURATION = 1200;
        const STAGGER = 60;

        // Start animation on next frame
        requestAnimationFrame(() => {
          const startTime = performance.now();

          // Set geometry and make visible immediately
          pathData.forEach(data => {
            data.path.setAttribute("d", data.d);
            data.path.setAttribute("stroke-dasharray", data.length);
            data.path.classList.add("animating");
          });
          this.svg.style.visibility = "visible";

          const animate = (now) => {
            const elapsed = now - startTime;

            pathData.forEach((data, i) => {
              const t = elapsed - (i * STAGGER);
              const progress = quantize(Math.max(0, Math.min(1, t / DURATION)), 30);
              const offset = data.length * (1 - progress);
              data.path.setAttribute("stroke-dashoffset", offset);
            });

            const totalDuration = DURATION + ((pathData.length - 1) * STAGGER) + 100;
            if (elapsed < totalDuration) {
              requestAnimationFrame(animate);
            } else {
              // Animation complete - trigger section reveal
              this.branch.classList.add("done");
            }
          };

          animate(startTime);
        });
      }
    }
  }

  // ==============================
  // BRANCHES
  // ==============================
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
        video: { meta: "Production", title: "Production", cover: "EDIT / COLOR / DELIVER", badges: ["EDIT", "COLOR", "EXPORTS"], logline: "CUTS THAT LAND CLEAN. FAST TURNAROUNDS, CONSISTENT LOOKS, DELIVERABLES THAT MATCH PLATFORM SPECS." },
        gear: { meta: "GEAR RENTAL", title: "GEAR RENTAL", cover: "CAMERA / LENS / AUDIO", badges: ["LOCAL", "PACKAGED", "INSURED"], logline: "PICKUP-READY PACKAGES FOR SMALL CREWS. SIMPLE RATES, CLEAN KIT, REAL-WORLD OPTIONS." },
        tape: { meta: "TAPE TRANSFER", title: "TAPE TRANSFER SERVICES", cover: "VHS / MINI-DV / HI8", badges: ["DIGITIZE", "ARCHIVE", "FILES"], logline: "DIGITIZE TAPES WITH CLEAN SIGNAL CHAIN. FILE NAMING + ORGANIZATION SO YOUR ARCHIVE STAYS USEFUL." }
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
          meta: "TEAM",
          title: "TEAM",
          cover: "CORE CREW",
          badges: ["DIRECTOR", "DP", "PRODUCER"],
          logline: "PLACEHOLDER: YOUR CORE TEAM LIST + ROLES WILL LIVE HERE."
        },
        collabs: {
          meta: "COLLABS",
          title: "COLLABORATORS",
          cover: "NETWORK",
          badges: ["MUSIC", "SPORT", "ARTS"],
          marquee: [
            { name: "MAFUBA", img: "assets/people/mafuba.jpg", links: [{ label: "IG", url: "https://instagram.com/" }] },
            { name: "VANCOUVER BANDITS", img: "assets/people/bandits.jpg", links: [{ label: "IG", url: "https://instagram.com/" }] },
            { name: "FIRST FLOOR COLLECTIVE", img: "assets/people/firstfloor.jpg", links: [{ label: "IG", url: "https://instagram.com/" }] },
            { name: "JAMIE MITRI", img: "assets/people/jamie.jpg", links: [{ label: "IG", url: "https://instagram.com/" }] },
            { name: "SATCHEL RAMRAJ", img: "assets/people/satchel.jpg", links: [{ label: "IG", url: "https://instagram.com/" }] },
            { name: "JOSHUA GARRIDO", img: "assets/people/joshua.jpg", links: [{ label: "IG", url: "https://instagram.com/" }] },
          ]
        },
        clients: {
          meta: "CLIENTS",
          title: "CLIENTS",
          cover: "BRANDS / ARTISTS",
          badges: ["RETAINERS", "PROJECT", "LOCAL"],
          marquee: [
            { name: "PLACEHOLDER CLIENT 01", img: "assets/clients/client-01.jpg", links: [{ label: "IG", url: "https://instagram.com/" }, { label: "YT", url: "https://youtube.com/" }] },
            { name: "PLACEHOLDER CLIENT 02", img: "assets/clients/client-02.jpg", links: [{ label: "IG", url: "https://instagram.com/" }] },
            { name: "PLACEHOLDER CLIENT 03", img: "assets/clients/client-03.jpg", links: [{ label: "WEB", url: "https://example.com" }] },
            { name: "PLACEHOLDER CLIENT 04", img: "assets/clients/client-04.jpg", links: [{ label: "IG", url: "https://instagram.com/" }] },
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
        email: { meta: "EMAIL", title: "EMAIL", cover: "DIRECT", badges: ["FASTEST", "INQUIRIES"], logline: "PLACEHOLDER: YOUR EMAIL + A SIMPLE CONTACT CTA." },
        ig: { meta: "INSTAGRAM", title: "INSTAGRAM", cover: "DM", badges: ["SOCIAL", "UPDATES"], logline: "PLACEHOLDER: YOUR IG HANDLE + LINK/CTA." },
        book: { meta: "BOOKING", title: "BOOKING", cover: "AVAILABILITY", badges: ["CALENDAR", "FORM"], logline: "PLACEHOLDER: BOOKING FLOW (FORM / CALENDLY / EMAIL TEMPLATE)." }
      }
    }),
  ].filter(b => b && b.valid);

  function controllerForSelectedTile() {
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
    if (e.key === "ArrowLeft") next = (idx - 1 + items.length) % items.length;
    if (e.key === "ArrowDown") next = (idx + c) % items.length;
    if (e.key === "ArrowUp") next = (idx - c + items.length) % items.length;

    if (next !== idx) {
      e.preventDefault();
      setSelected(next);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const ctrl = controllerForSelectedTile();
      if (ctrl) ctrl.toggle();
      else window.location.href = items[idx].getAttribute("href");
      return;
    }

    if (e.key === "Escape") {
      if (state.activeBranch) {
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
