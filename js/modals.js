// Formats the poem body text with line breaks and wraps title nicely
function getPoemDisplayMarkup(poem) {
  return {
    bodyHTML: poem.text.replace(/\n/g, "<br>"),
    titleText: "– " + poem.title
  };
}

// References to DOM elements
const modal = document.querySelector(".modal");
const modalIcon = modal.querySelector(".modal-icon");
const poemText = modal.querySelector(".poem-text");
const poemTitle = modal.querySelector(".poem-title");
const prevBtn = modal.querySelector(".prev");
const nextBtn = modal.querySelector(".next");
const closeBtn = modal.querySelector(".close-btn");

var contentWrapper = modal.querySelector(".modal-content"); // used more than once

// Holds all loaded poems
var poemsData = {};
let currentGroup = null;
let currentIndex = 0;

// Fetch poems from external JSON file
fetch("poems.json")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    poemsData = data;
    // console.log("Poems loaded:", Object.keys(poemsData));
  });

// Icon map for each clickable object (used in poem modal)
var iconMap = {
  notebook: "assets/icons/icon_notebook.svg",
  candle: "assets/icons/icon_candle.svg",
  bottle: "assets/icons/icon_bottle.svg",
  notes: "assets/icons/icon_notes.svg",
  paperscroll: "assets/icons/icon_scroll.svg",
  keyboard: "assets/icons/icon_keyboard.svg"
};

// Listen for click events coming from the attic scene
document.addEventListener("objectClicked", function (e) {
  var key = e.detail;
  openModal(key);
});

// Open the modal and display the first poem of the clicked object
function openModal(objectKey) {
  modal.classList.remove("hidden");

  if (typeof setMusicVolume == "function") {
    setMusicVolume(0.15); // fade down background music
  }

  if (!poemsData[objectKey]) return; // no poems tied to this object

  currentGroup = poemsData[objectKey];
  currentIndex = 0;

  modalIcon.src = iconMap[objectKey];
  modalIcon.alt = objectKey + " icon";

  showPoem(currentIndex);
}

// Render the poem content inside the modal
function showPoem(i) {
  var poem = currentGroup[i];

  // Animate paper breath and text fade
  poemText.classList.add("fade-out");
  poemTitle.classList.add("fade-out");
  contentWrapper.classList.add("breathe");

  // Wait briefly before showing updated content
  setTimeout(function () {
    poemText.innerHTML = poem.text.replace(/\n/g, "<br>");
    poemTitle.textContent = "– " + poem.title;

    poemText.classList.remove("fade-out");
    poemTitle.classList.remove("fade-out");
    contentWrapper.classList.remove("breathe");
  }, 250);
}

// Go to previous poem
prevBtn.addEventListener("click", function () {
  if (!currentGroup) return;
  currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
  showPoem(currentIndex);
});

// Go to next poem
nextBtn.addEventListener("click", function () {
  if (!currentGroup) return;
  currentIndex = (currentIndex + 1) % currentGroup.length;
  showPoem(currentIndex);
});

// Close the modal
closeBtn.addEventListener("click", function () {
  modal.classList.add("hidden");
  if (typeof setMusicVolume == "function") {
    setMusicVolume(0.3); // restore music volume
  }
});