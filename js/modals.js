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

// Menu modals

// Info modal (nav menu: "Om")

const infoModal = document.createElement("div");
infoModal.className ="info-modal hidden";
infoModal.innerHTML = `
    <div class="info-content">
        <button class="sound-toggle">
            <img src="assets/icons/icon_soundon.svg" alt="Toggle sound" />
        </button>

        <button class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFDDB5"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
        </button>

        <h2 class="info-title">Om projektet</h2>

        <nav class="info-tabs">
            <button data-file="about.html" class="active">Bakgrund</button>
            <button data-file="process.html">Processen</button>
            <button data-file="me.html">Om mig</button>
        </nav>

        <div class="info-body">
            <p>Laddar innehåll...</p>        
        </div>
    </div>
    `;

// Add modal to document
document.body.appendChild(infoModal);

const infoCloseBtn = infoModal.querySelector(".close-btn");
const infoTabs = infoModal.querySelectorAll(".info-tabs button");
const infoBody = infoModal.querySelector(".info-body");

// Opens the modal and loads html file
function openInfoModal(file) {
    infoModal.classList.remove("hidden");
    loadInfoContent(file);

    if (typeof setMusicVolume == "function") {
        setMusicVolume(0.15) // Softly fade the backgrund music
    }
}

// Fetch and inject html content
function loadInfoContent(fileName) {
  infoBody.innerHTML = "<p>Laddar innehåll...</p>";

  fetch(`content/${fileName}`)
    .then(res => {
      if (!res.ok) throw new Error("Kunde inte ladda innehållet.");
      return res.text();
    })
    .then(html => {
      infoBody.innerHTML = html;      
    })
    .catch(() => {
      infoBody.innerHTML = "<p>Kunde inte ladda innehållet just nu.</p>";
    });
}

// Close the modal
infoCloseBtn.addEventListener("click", () => {
  infoModal.classList.add("hidden");
  if (typeof setMusicVolume == "function") {
    setMusicVolume(0.3);
  }
  collapseMobileMenu();
});

// Collaspe mobile menu if modal was open
function collapseMobileMenu () {
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileButton = document.querySelector(".menu-toggle-mobile");

    if (mobileMenu && mobileMenu.classList.contains("menu-mobile-active")) {
        mobileMenu.classList.remove("menu-mobile-active");
    }

    if (mobileButton) {
        mobileButton.classList.remove("active");
    }
}

// Tab switching
infoTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    infoTabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadInfoContent(btn.dataset.file);
  });
});

// When clicking "Om" in any menu (desktop or mobile)
document.querySelectorAll("a").forEach(link => {
  if (link.textContent.trim() === "Om") {
    link.addEventListener("click", e => {
      e.preventDefault();
      openInfoModal("about.html");
    });
  }
});

// Close modals with esc
document.addEventListener("keydown", function(e){
  if (e.key === "Escape" || e.key === "Esc") {
    // poem modal
    if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
      if (typeof setMusicVolume == "function") setMusicVolume(0.3);
    }

    // info modal
    if (!infoModal.classList.contains("hidden")) {
      infoModal.classList.add("hidden");
      if (typeof setMusicVolume == "function") setMusicVolume(0.3);
    }
  }
});