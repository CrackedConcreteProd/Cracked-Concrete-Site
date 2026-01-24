const ICONS = {
  projects: [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000001111111000",
    "0000001000001000",
    "0100011111111110",
    "0110110000000110",
    "0111100111110100",
    "0110100100010100",
    "0110100100010100",
    "0111100111110100",
    "0110110000000100",
    "0100011111111100",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
  ],
  services: [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0011111111111100",
    "0100000000000010",
    "0100110000110010",
    "0101001111001010",
    "0101001111001010",
    "0100110000110010",
    "0100000000000010",
    "0100000000000010",
    "0100000000000010",
    "0100111111110010",
    "0111111111111110",
    "0000000000000000",
    "0000000000000000",
  ],
  people: [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000011111000000",
    "0000110001100000",
    "0000110001100000",
    "0000011111000000",
    "0000000110000000",
    "0000111111110000",
    "0001100000011000",
    "0001100000011000",
    "0001100000011000",
    "0000111111110000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
  ],
  connect: [
    "0000000000000000",
    "0000000000000000",
    "0000000000000111",
    "0000000000011100",
    "0000000000010000",
    "0000000000011000",
    "0000000000001100",
    "0011111111000110",
    "0110000000100010",
    "0100000000101110",
    "0100000111111000",
    "0100000000100000",
    "0110000000100000",
    "0011111111000000",
    "0000000000000000",
    "0000000000000000",
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
  buildIcon(el, ICONS[el.dataset.icon]);
});

// Keyboard navigation
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
  }

  if (e.key === "Enter"){
    e.preventDefault();
    window.location.href = items[selectedIndex()].getAttribute("href");
  }
});

setSelected(0);
