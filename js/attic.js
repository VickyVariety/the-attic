// Setup the canvas and context for our attic scene
const canvas = document.getElementById("atticCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to always fill the screen (might be worth throttling later?)
function fitCanvasToWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
fitCanvasToWindow();
window.addEventListener("resize", fitCanvasToWindow);

// Load the background image of the attic
const atticBg = new Image();
atticBg.src = "assets/images/the_attic.png";

// Define the objects in the attic
// Positions manually measured
const notebook = { img: new Image(), x: 1033, y: 1234, w: 376, h: 266, alpha: 0 };
notebook.img.src = "assets/images/notebook.png";

const bottle = { img: new Image(), x: 1292, y: 199, w: 242, h: 338, alpha: 0 };
bottle.img.src = "assets/images/message_in_a_bottle.png";

const wallNotes = { img: new Image(), x: 1525, y: 609, w: 105, h: 276, alpha: 0 };
wallNotes.img.src = "assets/images/notes_on_wall.png";

const keyboardThing = { img: new Image(), x: 1135, y: 722, w: 298, h: 278, alpha: 0 };
keyboardThing.img.src = "assets/images/keyboard.png";

const scroll = { img: new Image(), x: 1646, y: 986, w: 136, h: 81, alpha: 0 };
scroll.img.src = "assets/images/scroll.png";

const candleItem = { img: new Image(), x: 1618, y: 1232, w: 186, h: 176, alpha: 0 };
candleItem.img.src = "assets/images/candle.png";

// Pack everything in one array for easier iteration
const atticObjects = [notebook, bottle, wallNotes, keyboardThing, scroll, candleItem];

// Future debug toggles (unused right now)
var debugMode = false;

let currentHover = null;

// Main draw loop
// Runs with requestAnimationFrame
function renderAttic() {
  const sceneRatio = 2880 / 1620;
  const screenRatio = canvas.width / canvas.height;

  let w, h, offsetX = 0, offsetY = 0;

  if (screenRatio > sceneRatio) {
    w = canvas.width;
    h = w / sceneRatio;
    offsetY = (canvas.height - h) / 2;
  } else {
    h = canvas.height;
    w = h * sceneRatio;
    offsetX = (canvas.width - w) / 2;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(atticBg, offsetX, offsetY, w, h);

  atticObjects.forEach(function(item) {
    const scaleX = w / 2880;
    const scaleY = h / 1620;

    const xPos = offsetX + item.x * scaleX;
    const yPos = offsetY + item.y * scaleY;
    const itemWidth = item.w * scaleX;
    const itemHeight = item.h * scaleY;

    const shouldBeVisible = (currentHover == item) ? 1 : 0; // loose equality, intentional
    item.alpha += (shouldBeVisible - item.alpha) * 0.4;

    if (item.alpha < 0.01) return;

    if (currentHover === item) {
      ctx.save();
      ctx.globalAlpha = item.alpha * 0.85;
      ctx.filter = "blur(2px) contrast(150%)";
      ctx.shadowColor = "rgba(255, 200, 120, 0.9)";
      ctx.shadowBlur = 15;
      ctx.drawImage(item.img, xPos - 2, yPos - 2, itemWidth + 4, itemHeight + 4);
      ctx.restore();
    }

    ctx.globalAlpha = item.alpha;
    ctx.drawImage(item.img, xPos, yPos, itemWidth, itemHeight);
    ctx.globalAlpha = 1;
  });

  // console.log("rendering frame...");
  requestAnimationFrame(renderAttic);
}

// Basic loading counter
let loadedCount = 0;
const totalAssets = atticObjects.length + 1;

atticBg.onload = assetLoaded;
atticObjects.forEach(function(obj) {
  obj.img.onload = assetLoaded;
});

function assetLoaded() {
  loadedCount++;
  if (loadedCount == totalAssets) {
    renderAttic();  // everything's in, let’s go!
  }
}

// Mouse move (track hover status)
canvas.addEventListener("mousemove", function(evt) {
  const bounds = canvas.getBoundingClientRect();
  const mx = evt.clientX - bounds.left;
  const my = evt.clientY - bounds.top;

  const ratio = 2880 / 1620;
  const currentRatio = canvas.width / canvas.height;
  let viewW, viewH, ox = 0, oy = 0;

  if (currentRatio > ratio) {
    viewW = canvas.width;
    viewH = viewW / ratio;
    oy = (canvas.height - viewH) / 2;
  } else {
    viewH = canvas.height;
    viewW = viewH * ratio;
    ox = (canvas.width - viewW) / 2;
  }

  currentHover = null;

  atticObjects.forEach(function(obj) {
    const scaleX = viewW / 2880;
    const scaleY = viewH / 1620;

    const sx = ox + obj.x * scaleX;
    const sy = oy + obj.y * scaleY;
    const sw = obj.w * scaleX;
    const sh = obj.h * scaleY;

    if (mx >= sx && mx <= sx + sw && my >= sy && my <= sy + sh) {
      currentHover = obj;
    }
  });
});

// Mouse click (detect object clicks with a little padding)
canvas.addEventListener("click", function(evt) {
  const bounds = canvas.getBoundingClientRect();
  const cx = evt.clientX - bounds.left;
  const cy = evt.clientY - bounds.top;

  const baseRatio = 2880 / 1620;
  const currentRatio = canvas.width / canvas.height;
  let dw, dh, offX = 0, offY = 0;

  if (currentRatio > baseRatio) {
    dw = canvas.width;
    dh = dw / baseRatio;
    offY = (canvas.height - dh) / 2;
  } else {
    dh = canvas.height;
    dw = dh * baseRatio;
    offX = (canvas.width - dw) / 2;
  }

  atticObjects.forEach(function(item) {
    const scaleX = dw / 2880;
    const scaleY = dh / 1620;
    const ix = offX + item.x * scaleX;
    const iy = offY + item.y * scaleY;
    const iw = item.w * scaleX;
    const ih = item.h * scaleY;

    const padX = iw * 0.15;
    const padY = ih * 0.15;

    if (
      cx >= ix - padX && cx <= ix + iw + padX &&
      cy >= iy - padY && cy <= iy + ih + padY
    ) {
      // playGlobalClick();
      const evt = new CustomEvent("objectClicked", {
        detail: resolveObjectName(item)
      });
      document.dispatchEvent(evt);
    }
  });
});

// Rough object to name mapping (could probably be a map instead)
function resolveObjectName(o) {
  if (o === keyboardThing) return "keyboard";
  if (o === notebook) return "notebook";
  if (o === bottle) return "bottle";
  if (o === wallNotes) return "notes";
  if (o === scroll) return "paperscroll";
  if (o === candleItem) return "candle";
}