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
    "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
    "0000011111000000", "0000110001100000","0000110001100000", "0000011111000000", 
    "0000000110000000", "0000111111110000", "0001100000011000", "0001100000011000", 
    "0001100000011000", "0000111111110000", "0000000000000000", "0000000000000000",
  ],
  connect: [
    "0000000000000000", "0000000000000000", "0000000000000111", "0000000000011100",
    "0000000000010000", "0000000000011000", "0000000000001100", "0011111111000110",
    "0110000000100010", "0100000000101110", "0100000111111000", "0100000000100000",
    "0110000000100000", "0011111111000000", "0000000000000000", "0000000000000000",
  ],
};

// ===== YOUTUBE AVATAR HELPERS =====
// Auto-fetches YouTube channel profile pics for marquee items without a custom image.
// Free key: https://console.cloud.google.com/apis/credentials (enable "YouTube Data API v3")
const YT_API_KEY = "AIzaSyAdWVMzNDqIaanL_c46jjArsSP2DvwRmug";

function extractYTHandle(url) {
  if (!url) return null;
  const h = url.match(/youtube\.com\/@([^/?&#]+)/);
  if (h) return { type: "handle", value: h[1] };
  const c = url.match(/youtube\.com\/channel\/([^/?&#]+)/);
  if (c) return { type: "id", value: c[1] };
  return null;
}

async function fetchYTAvatar(ytUrl) {
  if (!YT_API_KEY) return null;
  const cacheKey = "ytav_" + ytUrl;
  try { const c = localStorage.getItem(cacheKey); if (c) return c; } catch (_) {}

  const info = extractYTHandle(ytUrl);
  if (!info) return null;

  try {
    const param = info.type === "id" ? `id=${info.value}` : `forHandle=${info.value}`;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&${param}&key=${YT_API_KEY}`
    );
    if (!res.ok) return null;
    const json = await res.json();
    const thumbs = json.items?.[0]?.snippet?.thumbnails;
    const src = thumbs?.medium?.url || thumbs?.default?.url || null;
    if (src) { try { localStorage.setItem(cacheKey, src); } catch (_) {} }
    return src;
  } catch (_) {
    return null;
  }
}

// ===== TOAST NOTIFICATION =====
function showToast(msg, duration = 3000) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(el._tid);
  el._tid = setTimeout(() => el.classList.remove("is-visible"), duration);
}

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

// ===== BOOT SCREEN SEQUENCE =====
function runBootSequence(callback) {
  const screen = document.getElementById("bootScreen");
  const log = document.getElementById("bootLog");
  const bar = document.getElementById("bootBar");
  const pct = document.getElementById("bootPct");

  if (!screen || !log || !bar || !pct) { callback(); return; }

  const SEGS = 20;
  for (let i = 0; i < SEGS; i++) {
    const s = document.createElement("div");
    s.className = "bootSeg";
    bar.appendChild(s);
  }
  const segs = bar.querySelectorAll(".bootSeg");

  const lines = [
    { t: 0,    msg: "CRACKED CONCRETE SYSTEM v2.0" },
    { t: 200,  msg: "INITIALIZING DISPLAY..." },
    { t: 500,  msg: "LOADING MODULES... OK" },
    { t: 850,  msg: "CHECKING ASSETS............. OK" },
    { t: 1300, msg: "MOUNTING BRANCHES... OK" },
    { t: 1700, msg: "RENDERING OSD... OK" },
    { t: 2100, msg: "SYSTEM READY" },
  ];

  const totalTime = 2100;

  lines.forEach(({ t, msg }) => {
    setTimeout(() => {
      log.textContent += msg + "\n";
      const progress = Math.min(t / totalTime, 1);
      const filled = Math.round(progress * SEGS);
      segs.forEach((s, i) => { if (i < filled) s.classList.add("on"); });
      pct.textContent = Math.round(progress * 100) + "%";
    }, t);
  });

  // Bar hits 100%
  setTimeout(() => {
    segs.forEach(s => s.classList.add("on"));
    pct.textContent = "100%";
  }, totalTime + 100);

  // Hard cut + callback
  setTimeout(() => {
    screen.remove();
    callback();
  }, totalTime + 300);
}

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

  // Run boot screen first, then boot tiles, then show reel
  runBootSequence(() => {
    items.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("booted");
      }, index * 120);
    });
    // Show reel 1s after icons appear
    setTimeout(() => { showReels(); }, 1000);
  });

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
  // REEL POPUPS (3 windows — Films, Music Videos, Misc)
  // =========================================================
  const REEL_CONFIGS = [
    { id: "reelFilms",       label: "FILMS",        text: "FILMS REEL COMING SOON" },
    { id: "reelMusicVideos", label: "MUSIC VIDEOS",  text: "MUSIC VIDEOS REEL COMING SOON" },
    { id: "reelMisc",        label: "MISC",          text: "MISC REEL COMING SOON" },
  ];

  const reelContainer = document.getElementById("reelContainer");
  const reelPopups = []; // { el, dismissed }

  // Build popup DOM for each config
  REEL_CONFIGS.forEach(cfg => {
    const el = document.createElement("div");
    el.className = "reelPopup";
    el.id = cfg.id;
    el.innerHTML = `
      <div class="reelHeader">
        <div class="reelLabel">${cfg.label}</div>
        <button class="reelClose" type="button">CLOSE</button>
      </div>
      <div class="reelPlayer">
        <div class="reelPlaceholder">
          <div class="reelNoise"></div>
          <div class="reelText">${cfg.text}</div>
        </div>
      </div>
    `;
    if (reelContainer) reelContainer.appendChild(el);
    reelPopups.push({ el, dismissed: false });
  });

  // Random non-overlapping placement below the icon grid
  function placeReelsRandomly() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gridEl = document.getElementById("grid");
    const minY = gridEl ? gridEl.getBoundingClientRect().bottom + 12 : vh * 0.3;
    const placed = []; // { x, y, w, h }

    reelPopups.forEach(reel => {
      // Temporarily show to measure
      reel.el.style.visibility = "hidden";
      reel.el.style.display = "block";
      const w = reel.el.offsetWidth;
      const h = reel.el.offsetHeight;
      reel.el.style.display = "";
      reel.el.style.visibility = "";

      const pad = 16;
      let x, y, attempts = 0, ok = false;

      while (attempts < 80 && !ok) {
        x = pad + Math.random() * Math.max(0, vw - w - pad * 2);
        y = minY + Math.random() * Math.max(0, vh - minY - h - pad);
        ok = true;
        for (const p of placed) {
          if (x < p.x + p.w + pad && x + w + pad > p.x &&
              y < p.y + p.h + pad && y + h + pad > p.y) {
            ok = false;
            break;
          }
        }
        attempts++;
      }

      reel.el.style.left = Math.round(x) + "px";
      reel.el.style.top  = Math.round(y) + "px";
      placed.push({ x, y, w, h });
    });
  }

  placeReelsRandomly();

  // Show / hide popups (mobile: one random pick from Films or Music Videos)
  function showReels() {
    const isMobile = window.innerWidth <= 720;

    if (isMobile) {
      // Pick randomly between Films (0) and Music Videos (1)
      const pick = Math.random() < 0.5 ? 0 : 1;
      reelPopups.forEach((r, i) => {
        if (i === pick && !r.dismissed) r.el.classList.add("is-visible");
        else r.el.classList.remove("is-visible");
      });
    } else {
      reelPopups.forEach(r => {
        if (!r.dismissed) r.el.classList.add("is-visible");
      });
    }
  }
  function hideReels() {
    reelPopups.forEach(r => r.el.classList.remove("is-visible"));
  }

  // Close buttons (independent dismiss)
  reelPopups.forEach(reel => {
    const btn = reel.el.querySelector(".reelClose");
    if (btn) {
      btn.addEventListener("click", () => {
        reel.dismissed = true;
        reel.el.classList.remove("is-visible");
      });
    }
  });

  // Draggable — each popup via its header
  reelPopups.forEach(reel => {
    const header = reel.el.querySelector(".reelHeader");
    if (!header) return;

    let ox = 0, oy = 0;

    function onMove(e) {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      reel.el.style.left = (cx - ox) + "px";
      reel.el.style.top  = (cy - oy) + "px";
    }
    function onEnd() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    }
    function onStart(e) {
      if (e.target.closest(".reelClose")) return;
      e.preventDefault();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      ox = cx - parseFloat(reel.el.style.left);
      oy = cy - parseFloat(reel.el.style.top);
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    }

    header.addEventListener("mousedown", onStart);
    header.addEventListener("touchstart", onStart, { passive: false });
  });

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

  // =========================================================
  // TEAM MEMBER CARDS
  // =========================================================
  let activeTeam = null;

  function mountTeam(loglineEl, members) {
    if (!loglineEl) return null;

    const data = Array.isArray(members) ? members : [];
    if (!data.length) {
      loglineEl.textContent = "";
      return null;
    }

    const cards = data.map(m => {
      const linksHtml = (m.links || [])
        .filter(l => l && l.url)
        .map(l => `<a class="mLink" href="${l.url}" target="_blank" rel="noopener">${l.label || "LINK"}</a>`)
        .join("");

      return `
        <div class="teamCard">
          <div class="teamPhoto">
            ${m.img ? `<img src="${m.img}" alt="${m.name}" loading="lazy" />` : `<span class="teamPhotoPlaceholder">IMG</span>`}
          </div>
          <div class="teamBody">
            <div class="teamName">${m.name || "MEMBER"}</div>
            <div class="teamRole">${m.role || ""}</div>
            ${m.bio ? `<div class="teamBio">${m.bio}</div>` : ""}
            ${linksHtml ? `<div class="teamLinks">${linksHtml}</div>` : ""}
          </div>
        </div>
      `;
    }).join("");

    loglineEl.innerHTML = `<div class="teamGrid">${cards}</div>`;

    // Make team photos clickable → open in lightbox
    loglineEl.querySelectorAll(".teamPhoto img").forEach(img => {
      img.addEventListener("click", () => {
        const lb = document.getElementById("lightbox");
        const lbImg = document.getElementById("lightboxImg");
        const lbLabel = document.getElementById("lightboxLabel");
        const lbCount = document.getElementById("lightboxCount");
        if (!lb || !lbImg) return;

        lbImg.src = img.src;
        lbImg.alt = img.alt || "Team photo";
        if (lbLabel) lbLabel.textContent = img.alt || "";
        if (lbCount) lbCount.textContent = "";

        lb.classList.remove("has-multi");
        lb.classList.add("is-open");
        lb.setAttribute("aria-hidden", "false");
        document.documentElement.style.overflow = "hidden";
      });
    });

    // Add class to panel to hide clutter
    const panel = loglineEl.closest(".projectPanel");
    if (panel) panel.classList.add("is-team");

    return {
      destroy() {
        loglineEl.innerHTML = "";
        if (panel) panel.classList.remove("is-team");
      }
    };
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

    const desc = opts.description || "";

    loglineEl.innerHTML = `
      ${desc ? `<div class="marqueeDesc">${desc}</div>` : ""}
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

    // Auto-fetch YouTube avatars for items without a custom image
    if (YT_API_KEY) {
      data.forEach((it, i) => {
        if (it.img) return;
        const ytLink = (it.links || []).find(l => (l.label || "").toUpperCase() === "YT");
        if (!ytLink) return;
        fetchYTAvatar(ytLink.url).then(src => {
          if (!src) return;
          // Update both copies in the doubled marquee
          [i, i + data.length].forEach(idx => {
            const avatar = track.querySelector(`[data-card="${idx}"] .mAvatar`);
            if (avatar) avatar.innerHTML = `<img src="${src}" alt="${it.name}" loading="lazy" />`;
          });
        });
      });
    }

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

        // Seamless infinite loop: reset when first set of items scrolls fully off-screen
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          // Keep mx within the repeating bounds for smooth endless scrolling
          while (mx <= -halfWidth) mx += halfWidth;
          while (mx > 0) mx -= halfWidth;
        }

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

      // Keep within loop bounds
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        while (mx <= -halfWidth) mx += halfWidth;
        while (mx > 0) mx -= halfWidth;
      }

      apply();
    }

    root.addEventListener("wheel", onWheel, { passive: false });

    function onKey(e) {
      if (!interactive) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        paused = true;
        mx += 55;

        // Keep within loop bounds
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          while (mx <= -halfWidth) mx += halfWidth;
          while (mx > 0) mx -= halfWidth;
        }

        apply();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        paused = true;
        mx -= 55;

        // Keep within loop bounds
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          while (mx <= -halfWidth) mx += halfWidth;
          while (mx > 0) mx -= halfWidth;
        }

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
      showReels();
    }

    open() {
      if (state.activeBranch && state.activeBranch !== this) state.activeBranch.close();
      state.activeBranch = this;

      hideReels();

      this.isOpen = true;
      this.branch.classList.add("is-open");
      this.branch.classList.remove("is-ready");

      hardResetXScroll();

      // Optimized: Single RAF instead of triple-nested
      requestAnimationFrame(() => {
        this.layoutLines();
        if (this.defaultKey) this.setActive(this.defaultKey);

        this.branch.classList.remove("is-drawing");
        void this.branch.offsetHeight;
        this.branch.classList.add("is-drawing");

        window.setTimeout(() => {
          if (this.isOpen) this.branch.classList.add("is-ready");
          hardResetXScroll();
        }, REVEAL_AFTER_MS);
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
          if (activeTeam) { activeTeam.destroy(); activeTeam = null; }

          if (Array.isArray(c.teamMembers) && c.teamMembers.length) {
            activeTeam = mountTeam(this.ui.logline, c.teamMembers);
          } else if (Array.isArray(c.marquee) && c.marquee.length) {
            activeMarquee = mountMarquee(this.ui.logline, c.marquee, { title: c.title || "MARQUEE", description: c.marqueeDesc || "" });
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

      // Detect mobile for layout adjustments
      const isMobile = window.innerWidth <= 720;

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

      // On mobile, need more clearance to avoid clipping icons
      const clearance = isMobile ? 100 : 22;

      let elbowY = startY + 56; // fallback
      if (pplRect && conRect) {
        const lowerRowTop = Math.min(pplRect.top, conRect.top);
        elbowY = Math.round(lowerRowTop - linesRect.top - clearance); // clearance above labels
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
      let preferredX = (gridR.left + gridR.width / 2) - linesRect.left;

      // On mobile/narrow screens, align routing column with button centers instead of grid center
      if (isMobile && centers.length > 0) {
        // Use the average of button centers for better alignment on mobile
        preferredX = Math.round(centers.reduce((sum, x) => sum + x, 0) / centers.length);
      }

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

      const routeX = isMobile ? preferredX : findSafeSpineX(preferredX, yTop, yBot, obstacles, spineMinX, spineMaxX, routeStep);
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
              const progress = quantize(Math.max(0, Math.min(1, t / DURATION)), 12);
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
      defaultKey: "originals",
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
          teamMembers: [
            {
              name: "BEN MOULAND",
              role: "CEO / DIRECTOR / DP / EDITOR",
              img: "assets/people/ben.png",
              bio: "Ben Mouland is a Vancouver-based filmmaker and visual artist, born in New York City and raised in Montreal, whose practice spans tender, emotionally driven directing and more outlandish experiments with analog filmmaking.",
              links: [
                { label: "IG", url: "https://www.instagram.com/benmouland/" },
                { label: "LINKEDIN", url: "www.linkedin.com/in/ben-mouland-720082234" },
              ]
            },
          ]
        },
        collabs: {
          meta: "COLLABS",
          title: "COLLABORATORS",
          cover: "NETWORK",
          badges: ["MUSIC", "SPORT", "ARTS"],
          marqueeDesc: "TRUSTED ONGOING WORKING RELATIONSHIPS",
          marquee: [
            { name: "MAFUBA", img: "", links: [{ label: "IG", url: "https://www.instagram.com/mafuba.music?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@Mafubamusic" }] },
            { name: "TREVOR-J", img: "", links: [{ label: "IG", url: "https://www.instagram.com/i.mtrevorj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@intelligentminded514/featured" }] },
            { name: "FIRST FLOOR COLLECTIVE", img: "", links: [{ label: "IG", url: "https://www.instagram.com/firstfloorcollective?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@firstfloorcollective" }] },
            { name: "GREEN THUMBS", img: "", links: [{ label: "IG", url: "https://www.instagram.com/greenthumbscanada?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@QuarterBrainProductions" }] },
            { name: "FORM", img: "assets/people/form.jpeg", links: [{ label: "IG", url: "https://www.instagram.com/formvancouver?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "WEB", url: "https://www.f-o-r-m.ca/" }] },
            { name: "604 RECORDS", img: "assets/people/604.jpeg", links: [{ label: "IG", url: "https://www.instagram.com/604recordsinc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "WEB", url: "https://www.604records.com/" }] },
          ]
        },
        clients: {
          meta: "CLIENTS",
          title: "CLIENTS",
          cover: "BRANDS / ARTISTS",
          badges: ["RETAINERS", "PROJECT", "LOCAL"],
          marqueeDesc: "CLIENTS SPANNING DIFFERENT MEDIUMS AND PRACTICES",
          marquee: [
            { name: "FKA RAYNE", img: "", links: [{ label: "IG", url: "https://www.instagram.com/fkarayne?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@FKARayne" }] },
            { name: "JIA", img: "", links: [{ label: "IG", url: "https://www.instagram.com/whoisjiaaaa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/channel/UCxwI2MjY-EJwRmNwaUXbBmA" }] },
            { name: "SPANK WILLIAMS", img: "", links: [{ label: "IG", url: "https://www.instagram.com/spank_williams?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@Spank_Williams" }] },
            { name: "PISS", img: "", links: [{ label: "IG", url: "https://www.instagram.com/piss_theband?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@piss_theband" }] },
            { name: "OOGWAY", img: "", links: [{ label: "IG", url: "https://www.instagram.com/oogway_the_okay?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/channel/UCBsXl9QvTILN1fE27SVK5iw" }] },
            { name: "FIONAVAIR", img: "", links: [{ label: "IG", url: "https://www.instagram.com/fionavair?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@Fionavair" }] },
            { name: "Justii_DC", img: "", links: [{ label: "IG", url: "https://www.instagram.com/justii_dc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }, { label: "YT", url: "https://www.youtube.com/@justii_dc" }] },
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
      content: {
        email: {},
        ig: {},
        book: {}
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

  // =========================================================
  // GEAR RENTAL SYSTEM
  // =========================================================

  const gearRentalEl = document.getElementById("gearRental");
  const servicesDefaultEl = document.getElementById("servicesDefault");
  const gearCategoriesEl = document.getElementById("gearCategories");
  const cartItemsEl = document.getElementById("cartItems");
  const cartEmptyEl = document.getElementById("cartEmpty");
  const cartFooterEl = document.getElementById("cartFooter");
  const cartTotalEl = document.getElementById("cartTotalAmount");
  const cartClearBtn = document.getElementById("cartClear");
  const cartCheckoutBtn = document.getElementById("cartCheckout");
  const checkoutFormEl = document.getElementById("checkoutForm");
  const formCloseBtn = document.getElementById("formClose");
  const quoteFormEl = document.getElementById("quoteForm");
  const formSummaryItemsEl = document.getElementById("formSummaryItems");

  // Cart state
  let cart = [];
  let expandedItemId = null;

  // Load cart from localStorage
  function loadCart() {
    try {
      const saved = localStorage.getItem("gearCart");
      if (saved) cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }

  // Save cart to localStorage
  function saveCart() {
    try {
      localStorage.setItem("gearCart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart");
    }
  }

  // Initialize gear rental system
  function initGearRental() {
    if (!gearRentalEl || !GEAR_DATA) return;

    loadCart();
    renderCategories();
    renderCart();

    // Listen for services subsection changes
    const servicesBranch = branches.find(b => b.id === "services");
    const productionServicesEl = document.getElementById("productionServices");
    const tapeTransferEl = document.getElementById("tapeTransfer");

    function showServiceSection(sub) {
      // Hide all service sections first
      if (servicesDefaultEl) servicesDefaultEl.style.display = "none";
      if (gearRentalEl) gearRentalEl.style.display = "none";
      if (productionServicesEl) productionServicesEl.style.display = "none";
      if (tapeTransferEl) tapeTransferEl.style.display = "none";

      // Show the selected section
      if (sub === "video" && productionServicesEl) {
        productionServicesEl.style.display = "block";
      } else if (sub === "gear" && gearRentalEl) {
        gearRentalEl.style.display = "block";
      } else if (sub === "tape" && tapeTransferEl) {
        tapeTransferEl.style.display = "block";
      } else if (servicesDefaultEl) {
        servicesDefaultEl.style.display = "block";
      }
    }

    // Listen for branch:subchange (fires on initial open AND on click)
    document.addEventListener("branch:subchange", (e) => {
      if (!e.detail) return;

      // Services section toggle
      if (e.detail.branchId === "services") {
        showServiceSection(e.detail.key);
      }

      // Connect section toggle
      if (e.detail.branchId === "connect") {
        const connectEmail = document.getElementById("connectEmail");
        const connectSocials = document.getElementById("connectSocials");
        const connectBooking = document.getElementById("connectBooking");

        if (connectEmail) connectEmail.style.display = "none";
        if (connectSocials) connectSocials.style.display = "none";
        if (connectBooking) connectBooking.style.display = "none";

        if (e.detail.key === "email" && connectEmail) {
          connectEmail.style.display = "flex";
        } else if (e.detail.key === "ig" && connectSocials) {
          connectSocials.style.display = "flex";
        } else if (e.detail.key === "book" && connectBooking) {
          connectBooking.style.display = "flex";
        }
      }
    });

    // Cart event listeners
    if (cartClearBtn) {
      cartClearBtn.addEventListener("click", () => {
        if (confirm("Clear all items from cart?")) {
          cart = [];
          saveCart();
          renderCart();
        }
      });
    }

    if (cartCheckoutBtn) {
      cartCheckoutBtn.addEventListener("click", () => {
        showCheckoutForm();
      });
    }

    if (formCloseBtn) {
      formCloseBtn.addEventListener("click", () => {
        checkoutFormEl.style.display = "none";
      });
    }

    if (quoteFormEl) {
      quoteFormEl.addEventListener("submit", (e) => {
        e.preventDefault();
        handleQuoteSubmit();
      });
    }
  }

  // Render all categories
  function renderCategories() {
    if (!gearCategoriesEl) return;

    gearCategoriesEl.innerHTML = "";

    Object.keys(GEAR_DATA).forEach(catKey => {
      const category = GEAR_DATA[catKey];

      const catDiv = document.createElement("div");
      catDiv.className = "gearCategory";
      catDiv.dataset.category = catKey;

      const headerDiv = document.createElement("div");
      headerDiv.className = "categoryHeader";
      headerDiv.innerHTML = `
        <div class="categoryTitle">${category.title}</div>
        <div class="categoryToggle">▼</div>
      `;

      const contentDiv = document.createElement("div");
      contentDiv.className = "categoryContent";

      const gridDiv = document.createElement("div");
      gridDiv.className = "gearGrid";

      let lastSub = null;
      category.items.forEach(item => {
        if (item.subsection && item.subsection !== lastSub) {
          lastSub = item.subsection;
          const subHeader = document.createElement("div");
          subHeader.className = "gearSubHeader";
          subHeader.textContent = item.subsection;
          gridDiv.appendChild(subHeader);
        }
        const itemDiv = renderGearItem(item);
        gridDiv.appendChild(itemDiv);
      });

      contentDiv.appendChild(gridDiv);
      catDiv.appendChild(headerDiv);
      catDiv.appendChild(contentDiv);
      gearCategoriesEl.appendChild(catDiv);

      // Toggle category
      headerDiv.addEventListener("click", () => {
        const wasOpen = catDiv.classList.contains("open");

        // Close all categories
        document.querySelectorAll(".gearCategory").forEach(c => c.classList.remove("open"));

        // Open this one if it wasn't already open
        if (!wasOpen) {
          catDiv.classList.add("open");
        }
      });
    });
  }

  // Render individual gear item
  function renderGearItem(item) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "gearItem";
    itemDiv.dataset.id = item.id;

    // Compact view
    itemDiv.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.name}" class="gearThumb" />
      <div class="gearName">${item.name}</div>
      <div class="gearStatus ${item.status}">${item.status.toUpperCase()}</div>

      <div class="gearDetails">
        <div class="gearPhotos">
          <img src="${item.photos[0]}" alt="${item.name}" class="gearPhotoMain" id="photo-main-${item.id}" />
          <div class="gearPhotoThumbs">
            ${item.photos.map((photo, idx) => `
              <img src="${photo}" alt="${item.name} ${idx + 1}" class="gearPhotoThumb ${idx === 0 ? 'active' : ''}" data-photo-idx="${idx}" />
            `).join('')}
          </div>
        </div>

        <div class="gearInfo">
          <div class="gearDescription">${item.description}</div>

          <div class="gearPricing">
            ${item.qty ? `<div><strong>QUANTITY:</strong> ${item.qty}</div>` : ''}
            <div><strong>DAY RATE:</strong> $${item.dayRate}</div>
            <div><strong>WEEK RATE:</strong> $${item.weekRate}</div>
          </div>

          <div class="gearRentalForm">
            <label for="days-${item.id}">RENTAL DURATION (DAYS)</label>
            <input type="number" id="days-${item.id}" min="1" value="1" />
            <button class="gearAddCart" data-id="${item.id}" ${item.status !== 'available' ? 'disabled' : ''}>
              ${item.status === 'available' ? 'ADD TO CART' : item.status.toUpperCase()}
            </button>
          </div>
        </div>

        <button class="gearCloseDetail" data-id="${item.id}">✕</button>
      </div>
    `;

    // Click to expand (only on compact part)
    itemDiv.addEventListener("click", (e) => {
      if (itemDiv.classList.contains("expanded")) return;
      if (e.target.closest(".gearDetails")) return;
      expandItem(item.id);
    });

    // Photo carousel
    itemDiv.querySelectorAll(".gearPhotoThumb").forEach(thumb => {
      thumb.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(thumb.dataset.photoIdx);
        const mainImg = itemDiv.querySelector(".gearPhotoMain");
        mainImg.src = item.photos[idx];

        itemDiv.querySelectorAll(".gearPhotoThumb").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    // Close button
    const closeBtn = itemDiv.querySelector(".gearCloseDetail");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        collapseItem();
      });
    }

    // Add to cart button
    const addBtn = itemDiv.querySelector(".gearAddCart");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const daysInput = itemDiv.querySelector(`#days-${item.id}`);
        const days = parseInt(daysInput.value) || 1;
        addToCart(item, days);
      });
    }

    return itemDiv;
  }

  // Expand item details
  function expandItem(itemId) {
    // Collapse any currently expanded item
    collapseItem();

    const itemDiv = document.querySelector(`[data-id="${itemId}"]`);
    if (itemDiv && itemDiv.classList.contains("gearItem")) {
      itemDiv.classList.add("expanded");
      expandedItemId = itemId;

      // Scroll into view
      setTimeout(() => {
        itemDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }

  // Collapse expanded item
  function collapseItem() {
    if (expandedItemId) {
      const itemDiv = document.querySelector(`[data-id="${expandedItemId}"]`);
      if (itemDiv) itemDiv.classList.remove("expanded");
      expandedItemId = null;
    }
  }

  // Add item to cart
  function addToCart(item, days) {
    // Check if item already in cart
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
      existing.days = days;
      existing.price = calculatePrice(item, days);
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        days: days,
        dayRate: item.dayRate,
        weekRate: item.weekRate,
        price: calculatePrice(item, days)
      });
    }

    saveCart();
    renderCart();

    // Show feedback
    showToast(`${item.name} added to cart for ${days} day(s)`);
  }

  // Calculate price based on days
  function calculatePrice(item, days) {
    if (days >= 7) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (weeks * item.weekRate) + (remainingDays * item.dayRate);
    } else {
      return days * item.dayRate;
    }
  }

  // Remove item from cart
  function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    saveCart();
    renderCart();
  }

  // Render cart
  function renderCart() {
    if (!cartItemsEl) return;

    if (cart.length === 0) {
      cartEmptyEl.style.display = "block";
      cartItemsEl.innerHTML = "";
      cartFooterEl.style.display = "none";
      return;
    }

    cartEmptyEl.style.display = "none";
    cartFooterEl.style.display = "block";

    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cartItem">
        <div class="cartItemName">${item.name}</div>
        <div class="cartItemDays">${item.days} DAY${item.days > 1 ? 'S' : ''}</div>
        <div class="cartItemPrice">$${item.price}</div>
        <button class="cartItemRemove" data-id="${item.id}">REMOVE</button>
      </div>
    `).join('');

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.textContent = `$${total}`;

    // Add remove listeners
    cartItemsEl.querySelectorAll(".cartItemRemove").forEach(btn => {
      btn.addEventListener("click", () => {
        removeFromCart(btn.dataset.id);
      });
    });
  }

  // Show checkout form
  function showCheckoutForm() {
    if (!checkoutFormEl || cart.length === 0) return;

    // Populate summary
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    formSummaryItemsEl.innerHTML = cart.map(item => `
      <div><strong>${item.name}</strong> - ${item.days} day(s) - $${item.price}</div>
    `).join('') + `<div style="margin-top: 15px; font-weight: bold; font-size: 16px;">TOTAL: $${total}</div>`;

    checkoutFormEl.style.display = "block";
  }

  // Handle quote form submission
  function handleQuoteSubmit() {
    const formData = new FormData(quoteFormEl);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const project = formData.get("project");

    // Build quote summary
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartSummary = cart.map(item =>
      `${item.name} - ${item.days} day(s) - $${item.price}`
    ).join('\n');

    const message = `
GEAR RENTAL QUOTE REQUEST

Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}

Project Details:
${project || 'N/A'}

Rental Items:
${cartSummary}

ESTIMATED TOTAL: $${total}
    `.trim();

    // In a real implementation, you'd send this to a server
    // For now, we'll create a mailto link
    const subject = encodeURIComponent("Gear Rental Quote Request");
    const body = encodeURIComponent(message);
    const mailtoLink = `mailto:ben@cracked-concrete.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    // Close form and clear cart
    checkoutFormEl.style.display = "none";
    cart = [];
    saveCart();
    renderCart();

    showToast("Quote request prepared! Your email client should open shortly.");
  }

  // Initialize gear rental if available
  if (typeof GEAR_DATA !== "undefined") {
    initGearRental();
  }

  // =========================================================
  // END GEAR RENTAL SYSTEM
  // =========================================================

  // =========================================================
  // PRODUCTION SERVICES CTA BUTTONS
  // =========================================================
  const productionServicesEl = document.getElementById("productionServices");

  if (productionServicesEl) {
    const ctaButtons = productionServicesEl.querySelectorAll(".serviceCTA");

    ctaButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const service = btn.dataset.service;
        let serviceName = "";

        switch(service) {
          case "development":
            serviceName = "Project Development";
            break;
          case "cinematography":
            serviceName = "Cinematography";
            break;
          case "post":
            serviceName = "Post-Production";
            break;
          default:
            serviceName = "Production Services";
        }

        const subject = encodeURIComponent(`${serviceName} Quote Request`);
        const body = encodeURIComponent(`Hi Cracked Concrete,

I'm interested in learning more about your ${serviceName} services.

Project Details:
[Please describe your project here]

Timeline:
[When do you need this completed?]

Budget:
[What is your approximate budget?]

Additional Notes:
[Any other relevant information]

Thanks!`);

        const mailtoLink = `mailto:ben@cracked-concrete.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
      });
    });
  }

  // =========================================================
  // END PRODUCTION SERVICES
  // =========================================================

  // =========================================================
  // TAPE TRANSFER CTA BUTTONS
  // =========================================================
  const tapeTransferEl = document.getElementById("tapeTransfer");

  if (tapeTransferEl) {
    const tapeCTAButtons = tapeTransferEl.querySelectorAll(".tapeCTA");

    tapeCTAButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const format = btn.dataset.format;
        let formatName = "";

        switch(format) {
          case "8mm":
            formatName = "8mm";
            break;
          case "hi8":
            formatName = "Hi8";
            break;
          case "minidv":
            formatName = "MiniDV";
            break;
          default:
            formatName = "Tape Transfer";
        }

        const subject = encodeURIComponent(`${formatName} Tape Transfer Quote Request`);
        const body = encodeURIComponent(`Hi Cracked Concrete,

I'm interested in your tape transfer services for ${formatName} tapes.

Number of Tapes:
[How many tapes do you need transferred?]

Tape Condition:
[Please describe the condition of your tapes]

Preferred Delivery:
[ ] Cloud Link (Free)
[ ] USB Drive (+$10)

Timeline:
[When do you need these completed?]

Additional Notes:
[Any other relevant information]

Thanks!`);

        const mailtoLink = `mailto:ben@cracked-concrete.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
      });
    });
  }

  // =========================================================
  // END TAPE TRANSFER
  // =========================================================

  setSelected(0);
  hardResetXScroll();
});
