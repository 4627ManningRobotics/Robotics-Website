'use strict';

/**
 * Reused Element Toggle Utility
 */
const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }


/**
 * Header Fade-in (Sticky) + Back to Top
 */
const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  if (window.scrollY >= 10) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }

});


/**
 * Navbar Toggle
 */
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

navToggleBtn.addEventListener("click", function () {

  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);

  header.classList.add("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", function () {
  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);

  header.classList.add("active");
  overlay.classList.toggle("active");
});

const navLinks = document.querySelectorAll(".navbar-link");

navLinks.forEach(link => {
  link.addEventListener("click", function () {
    navToggleBtn.classList.remove("active");
    navbar.classList.remove("active");
    document.body.classList.remove("active");
    header.classList.add("active");
    overlay.classList.remove("active");
  });
});


/**
 * Theme Button Toggle
 * dark & light theme toggle
 */
const themeToggleBtn = document.querySelector("[data-theme-btn]");

themeToggleBtn.addEventListener("click", function () {

  elemToggleFunc(themeToggleBtn);

  if (themeToggleBtn.classList.contains("active")) {
    document.body.classList.remove("dark_theme");
    document.body.classList.add("light_theme");

    localStorage.setItem("theme", "light_theme");
  } else {
    document.body.classList.add("dark_theme");
    document.body.classList.remove("light_theme");

    localStorage.setItem("theme", "dark_theme");
  }
});


/**
 * Theme Storage
 * check & apply last time selected theme from localStorage
 */
if (localStorage.getItem("theme") === "light_theme") {
  themeToggleBtn.classList.add("active");
  document.body.classList.remove("dark_theme");
  document.body.classList.add("light_theme");
} else {
  themeToggleBtn.classList.remove("active");
  document.body.classList.remove("light_theme");
  document.body.classList.add("dark_theme");
}


/**
 * Scroll Reveal Fancy
 * uses the [data-reveal] so you can set different reveal directions and delays with just html
 */
const revealElements = document.querySelectorAll("[data-reveal]");
const revealDelayElements = document.querySelectorAll("[data-reveal-delay]");

const reveal = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.2) {
      revealElements[i].classList.add("revealed");
    }
  }
}

for (let i = 0, len = revealDelayElements.length; i < len; i++) {
  revealDelayElements[i].style.transitionDelay = revealDelayElements[i].dataset.revealDelay;
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);


/**
 * This is so the user can scroll horizontally in the awards section on PC by just dragging
 * Borrowed from a past project of mine, hence why it's the only thing that uses jQuery when
 * everything else in this file is pure js.
 */
var isEnabled = false;
var isDrag = false;
var startX;
var scrollbarElem;

const awardsScrollbar = (elem, unsubscribe=false) => {
  scrollbarElem = elem;
  if (unsubscribe) {
    unsubscribeSelf();
  } else {
    subscribeSelf();
  };
};

const scrollIntoViewHorizontally = (container, child) => {
  scrollbarElem.style.cursor = "auto";
  scrollbarElem.style.scrollBehavior = "smooth";

  const containerRect = container.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  const isChildFullyVisible = childRect.left >= containerRect.left && childRect.right <= containerRect.right;

  if (isChildFullyVisible) return;

  container.scrollLeft += childRect.left - containerRect.left;
};

const dragStart = (ev) => {
  isDrag = true;
  startX = ev.clientX;

  scrollbarElem.style.cursor = "grabbing";
  scrollbarElem.style.scrollBehavior = "auto";
};

const dragEnd = (ev) => {
  if (!isDrag) return;

  isDrag = false;
  const scrollDirection = startX - ev.clientX > 0 ? 1 : -1;

  // Find the element that is currently nearest to the middle in the direction of the scroll
  const scrollbarArr = $(scrollbarElem).find(".scrollbar-item").toArray();
  if (scrollbarArr.length === 0) return;

  const $middleElem = scrollbarArr.reduce((prev, curr) => {
    const prevDiff = Math.abs(prev.getBoundingClientRect().left - scrollbarElem.getBoundingClientRect().left - scrollDirection * 450);
    const currDiff = Math.abs(curr.getBoundingClientRect().left - scrollbarElem.getBoundingClientRect().left - scrollDirection * 450);
    return prevDiff < currDiff ? prev : curr;
  });

  // Now, scroll that element into view
  scrollIntoViewHorizontally(scrollbarElem, $middleElem);
};

const drag = (ev) => {
  if (!isDrag) return;

  scrollbarElem.scrollLeft -= ev.movementX;
  scrollbarElem.scrollTop -= ev.movementY;
};

const subscribeSelf = () => {
  if (isEnabled) return;
  isEnabled = true;

  scrollbarElem.style.scrollSnapType = "none";
  scrollbarElem.style.scrollBehavior = "unset";
  
  scrollbarElem.addEventListener("mousedown", dragStart);
  scrollbarElem.addEventListener("mouseup", dragEnd);
  scrollbarElem.addEventListener("mouseleave", dragEnd);
  scrollbarElem.addEventListener("mousemove", drag);
};

const unsubscribeSelf = () => {
  if (!isEnabled) return;
  isEnabled = false;

  scrollbarElem.style.scrollSnapType = "inline mandatory";
  scrollbarElem.style.scrollBehavior = "smooth";

  scrollbarElem.removeEventListener("mousedown", dragStart);
  scrollbarElem.removeEventListener("mouseup", dragEnd);
  scrollbarElem.removeEventListener("mouseleave", dragEnd);
  scrollbarElem.removeEventListener("mousemove", drag);
};


/**
 * Resize event
 */
const resize = function () {
  // Super nice mobile detection
  // https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
  let isMobile = (window.matchMedia("(pointer: coarse)").matches);

  // Check to unsubscribe (or re-subscribe) the awardsScrollbar function
  $(".has-scrollbar").each(function () {
    awardsScrollbar(this, isMobile);
  });
}

$(window).resize(resize);


/**
 * Main
 */
const main = function () {
  $(".has-scrollbar").each(function () {
    awardsScrollbar(this);
  });
};

$(document).ready(function () {
  main(); // Wait until ready, otherwise the subscribes for the scrollbar might fail
});