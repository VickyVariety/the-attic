// handles left nav menu toggle (desktop)
const menuButton = document.querySelector(".menu-toggle");
const menuLinks = document.querySelector(".menu-links");
const menuIcon = menuButton.querySelector("svg path"); // Just the path, not whole SVG
const menuWrapper = document.querySelector(".menu"); // Cache this too

let isMenuOpen = true;

// swapped from arrow fn for style variety
menuButton.addEventListener("click", function () {
  isMenuOpen = !isMenuOpen;

  menuLinks.classList.toggle("collapsed", !isMenuOpen);
  menuWrapper.classList.toggle("collapsed", !isMenuOpen);

  // Just update the path `d` attribute instead of replacing all innerHTML
  if (isMenuOpen == true) {
    menuIcon.setAttribute("d", "M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z");
  } else {
    menuIcon.setAttribute("d", "M560-80 960-480 560-880l-71 71 329 329-329 329 71 71Z");
  }

  //playGlobalClick(); // optional audio feedback
});

// toggle mobile menu (separate logic from desktop)
var mobileButton = document.querySelector(".menu-toggle-mobile");
var mobileMenu = document.querySelector(".mobile-menu");

mobileButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("menu-mobile-active");
});