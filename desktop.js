// ==============================
// Cracked Concrete — Desktop Windows
// - Floating draggable windows
// - Random scatter on load
// - Project list population
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const desktop = document.getElementById("desktop");
  const windows = document.querySelectorAll(".window");

  if (!desktop || !windows.length) return;

  // ===== PROJECTS DATA =====
  // Use PROJECTS from projects.js if available
  const projectData = typeof PROJECTS !== "undefined" ? PROJECTS : [];

  // ===== RANDOM POSITIONING =====
  function positionWindowsRandomly() {
    const desktopRect = desktop.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Safe area boundaries (avoid edges and icon grid)
    const minX = 20;
    const maxX = Math.max(minX + 100, viewportWidth - 560);
    const minY = 220; // Below icons
    const maxY = Math.max(minY + 100, viewportHeight - 450);

    windows.forEach((win, index) => {
      const winWidth = parseInt(win.style.width) || 400;
      const winHeight = parseInt(win.style.height) || 350;

      // Generate random position within safe bounds
      let x, y;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        x = minX + Math.random() * (maxX - minX - winWidth);
        y = minY + Math.random() * (maxY - minY - winHeight);
        attempts++;
      } while (attempts < maxAttempts && !isPositionSafe(x, y, winWidth, winHeight, index));

      // Clamp to viewport
      x = Math.max(minX, Math.min(x, maxX - winWidth));
      y = Math.max(minY, Math.min(y, maxY - winHeight));

      win.style.left = `${x}px`;
      win.style.top = `${y}px`;
      win.style.zIndex = 100 + index;
    });
  }

  // Check if position overlaps too much with existing windows
  function isPositionSafe(x, y, width, height, currentIndex) {
    const currentRect = { x, y, width, height };

    for (let i = 0; i < currentIndex; i++) {
      const otherWin = windows[i];
      const otherRect = {
        x: parseInt(otherWin.style.left) || 0,
        y: parseInt(otherWin.style.top) || 0,
        width: parseInt(otherWin.style.width) || 400,
        height: parseInt(otherWin.style.height) || 350
      };

      // Allow some overlap but not complete overlap
      const overlapX = Math.max(0, Math.min(currentRect.x + currentRect.width, otherRect.x + otherRect.width) - Math.max(currentRect.x, otherRect.x));
      const overlapY = Math.max(0, Math.min(currentRect.y + currentRect.height, otherRect.y + otherRect.height) - Math.max(currentRect.y, otherRect.y));
      const overlapArea = overlapX * overlapY;
      const currentArea = currentRect.width * currentRect.height;

      // Reject if more than 30% overlap
      if (overlapArea > currentArea * 0.3) {
        return false;
      }
    }

    return true;
  }

  // ===== POPULATE WINDOWS WITH PROJECTS =====
  function populateWindows() {
    windows.forEach((win) => {
      const category = win.dataset.category;
      const listEl = win.querySelector(".projectList");

      if (!listEl) return;

      // Filter projects by category
      const categoryProjects = projectData.filter(p => (p.category || "films") === category);

      if (categoryProjects.length === 0) {
        listEl.innerHTML = "";
        return;
      }

      // Render project items
      listEl.innerHTML = categoryProjects.map(project => `
        <div class="projectItem" data-slug="${project.slug}">
          <div class="projectItemTitle">${project.title}</div>
          <div class="projectItemMeta">
            <span class="projectItemType">${project.type}</span>
            <span class="projectItemYear">${project.year}</span>
          </div>
        </div>
      `).join("");

      // Add click handlers to project items
      listEl.querySelectorAll(".projectItem").forEach(item => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();

          // Remove active from all items
          document.querySelectorAll(".projectItem").forEach(i => i.classList.remove("is-active"));

          // Add active to clicked item
          item.classList.add("is-active");

          const slug = item.dataset.slug;
          const project = projectData.find(p => p.slug === slug);
        });
      });
    });
  }

  // ===== DRAGGING FUNCTIONALITY =====
  let draggedWindow = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let highestZIndex = 200;

  function startDrag(win, e) {
    // Only drag from title bar
    if (!e.target.closest(".windowTitleBar")) return;

    // Ignore if clicking window controls
    if (e.target.closest(".windowControls")) return;

    draggedWindow = win;
    draggedWindow.classList.add("is-dragging");

    const rect = win.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    // Bring to front
    highestZIndex++;
    win.style.zIndex = highestZIndex;

    e.preventDefault();
  }

  function doDrag(e) {
    if (!draggedWindow) return;

    let x = e.clientX - dragOffsetX;
    let y = e.clientY - dragOffsetY;

    // Clamp to viewport
    const winWidth = draggedWindow.offsetWidth;
    const winHeight = draggedWindow.offsetHeight;
    const maxX = window.innerWidth - winWidth;
    const maxY = window.innerHeight - winHeight;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    draggedWindow.style.left = `${x}px`;
    draggedWindow.style.top = `${y}px`;
  }

  function stopDrag() {
    if (draggedWindow) {
      draggedWindow.classList.remove("is-dragging");
      draggedWindow = null;
    }
  }

  // Attach drag listeners to each window
  windows.forEach((win) => {
    win.addEventListener("mousedown", (e) => startDrag(win, e));

    // Bring to front on click
    win.addEventListener("mousedown", () => {
      highestZIndex++;
      win.style.zIndex = highestZIndex;

      // Remove focus from others
      windows.forEach(w => w.classList.remove("is-focused"));
      win.classList.add("is-focused");
    });

    // Close button
    const closeBtn = win.querySelector(".windowBtn.close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        win.style.display = "none";
      });
    }

    // Minimize button (just hides for now)
    const minimizeBtn = win.querySelector(".windowBtn.minimize");
    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        win.style.display = "none";
      });
    }

    // Maximize button (toggles between normal and fullscreen)
    const maximizeBtn = win.querySelector(".windowBtn.maximize");
    if (maximizeBtn) {
      let isMaximized = false;
      let savedPosition = {};

      maximizeBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        if (!isMaximized) {
          // Save current position
          savedPosition = {
            left: win.style.left,
            top: win.style.top,
            width: win.style.width,
            height: win.style.height
          };

          // Maximize
          win.style.left = "10px";
          win.style.top = "220px";
          win.style.width = `${window.innerWidth - 40}px`;
          win.style.height = `${window.innerHeight - 250}px`;
          isMaximized = true;
        } else {
          // Restore
          win.style.left = savedPosition.left;
          win.style.top = savedPosition.top;
          win.style.width = savedPosition.width;
          win.style.height = savedPosition.height;
          isMaximized = false;
        }
      });
    }
  });

  // Global mouse listeners for dragging
  document.addEventListener("mousemove", doDrag);
  document.addEventListener("mouseup", stopDrag);

  // ===== INITIALIZATION =====
  positionWindowsRandomly();
  populateWindows();

  // Re-position on window resize (optional)
  window.addEventListener("resize", () => {
    windows.forEach(win => {
      const x = parseInt(win.style.left) || 0;
      const y = parseInt(win.style.top) || 0;
      const winWidth = win.offsetWidth;
      const winHeight = win.offsetHeight;

      // Clamp to new viewport size
      const maxX = window.innerWidth - winWidth;
      const maxY = window.innerHeight - winHeight;

      win.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
      win.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    });
  });
});
