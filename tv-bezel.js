(() => {
  function inject() {
    if (document.getElementById("tvb-root")) return;

    // Compute styles (your page likely sets background on html OR body)
    const bodyCS = getComputedStyle(document.body);
    const htmlCS = getComputedStyle(document.documentElement);

    function pickBackground() {
      // Prefer whichever has a real background-image first (gradients count)
      const bodyHasImg = bodyCS.backgroundImage && bodyCS.backgroundImage !== "none";
      const htmlHasImg = htmlCS.backgroundImage && htmlCS.backgroundImage !== "none";

      if (bodyHasImg) return bodyCS.background; // shorthand keeps gradient details
      if (htmlHasImg) return htmlCS.background;

      // Otherwise prefer non-transparent background color
      const bodyColor = bodyCS.backgroundColor;
      const htmlColor = htmlCS.backgroundColor;

      const bodyHasColor = bodyColor && bodyColor !== "rgba(0, 0, 0, 0)" && bodyColor !== "transparent";
      const htmlHasColor = htmlColor && htmlColor !== "rgba(0, 0, 0, 0)" && htmlColor !== "transparent";

      if (bodyHasColor) return bodyCS.background;
      if (htmlHasColor) return htmlCS.background;

      return "transparent";
    }

    const pickedBg = pickBackground();

    // Save layout + typography from body so centering stays consistent
    const saved = {
      display: bodyCS.display,
      flexDirection: bodyCS.flexDirection,
      justifyContent: bodyCS.justifyContent,
      alignItems: bodyCS.alignItems,
      textAlign: bodyCS.textAlign,

      color: bodyCS.color,
      fontFamily: bodyCS.fontFamily,
      letterSpacing: bodyCS.letterSpacing,
      textTransform: bodyCS.textTransform
    };

    // Build bezel + screen mount
    const root = document.createElement("div");
    root.id = "tvb-root";
    root.className = "tvb";
    root.innerHTML = `
      <div class="tvb__body" aria-hidden="true">
        <div class="tvb__cutout">
          <div class="tvb__screen" id="tvb-screen">
            <div class="tvb__site" id="tvb-site"></div>
          </div>
          <div class="tvb__scanlines"></div>
          <div class="tvb__vignette"></div>
        </div>

        <div class="tvb__controls">
          <div class="tvb__btnrow">
            <button class="tvb__button" data-tvb="menu">MENU</button>

            <button class="tvb__button tvb__button--mini" data-tvb="vol-down">−</button>
            <button class="tvb__button" data-tvb="vol">VOLUME</button>
            <button class="tvb__button tvb__button--mini" data-tvb="vol-up">+</button>

            <button class="tvb__button tvb__button--mini" data-tvb="ch-down">−</button>
            <button class="tvb__button" data-tvb="ch">CHANNEL</button>
            <button class="tvb__button tvb__button--mini" data-tvb="ch-up">+</button>

            <button class="tvb__button" data-tvb="tvvideo">TV/VIDEO</button>
          </div>
        </div>
      </div>
    `;

    // Append bezel last so it sits above everything
    document.body.appendChild(root);

    // ✅ NOW query screenEl (it exists only after append)
    const screenEl = root.querySelector("#tvb-screen");
    const mount = root.querySelector("#tvb-site");

    // ✅ Apply the page background (html OR body) to the scroll container
    screenEl.style.setProperty("--tv-page-bg", pickedBg);

    // Move existing page content into the screen mount
    const kids = Array.from(document.body.children).filter(el => el !== root);

    const wrapper = document.createElement("div");
    wrapper.className = "tvb__site-inner";

    kids.forEach(el => wrapper.appendChild(el));
    mount.appendChild(wrapper);

    // Allow tall pages to grow, but still fill short pages
    wrapper.style.width = "100%";
    wrapper.style.height = "auto";
    wrapper.style.minHeight = "100%";

    // Apply body layout styles to wrapper (keeps your icon centering)
    wrapper.style.display = saved.display;
    wrapper.style.flexDirection = saved.flexDirection;
    wrapper.style.justifyContent = saved.justifyContent;
    wrapper.style.alignItems = saved.alignItems;
    wrapper.style.textAlign = saved.textAlign;

    // Typography
    wrapper.style.color = saved.color;
    wrapper.style.fontFamily = saved.fontFamily;
    wrapper.style.letterSpacing = saved.letterSpacing;
    wrapper.style.textTransform = saved.textTransform;

    // Scroll inside the screen, not the body
    document.body.style.overflow = "hidden";
    document.body.style.background = "transparent"; // don't double-render behind bezel

    // Buttons (minimal feedback)
    const scanlines = root.querySelector(".tvb__scanlines");
    const bodyEl = root.querySelector(".tvb__body");

    function flash() {
      bodyEl.animate(
        [{ filter: "brightness(1)" }, { filter: "brightness(1.08)" }, { filter: "brightness(1)" }],
        { duration: 180, easing: "ease-out" }
      );
    }

    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tvb]");
      if (!btn) return;

      const action = btn.getAttribute("data-tvb");

      if (action === "tvvideo") {
        scanlines.style.display = (scanlines.style.display === "none") ? "" : "none";
        flash();
        return;
      }

      if (action === "menu") {
        document.documentElement.classList.toggle("tvb-menu");
        flash();
        return;
      }

      flash();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
