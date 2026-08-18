// ============================================================
// index.js — landing page behaviour
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");

  // Darken the navbar background once the user scrolls past the hero.
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("navbar--scrolled");
    } else {
      navbar.classList.remove("navbar--scrolled");
    }
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  // If someone is already "signed in" (from a previous session), skip straight
  // to the profile picker instead of the sign-in form.
  const isLoggedIn = localStorage.getItem("netflixLoggedIn") === "true";
  const signInBtn = document.querySelector(".navbar__right a.btn");
  if (isLoggedIn && signInBtn) {
    signInBtn.textContent = "Go to Netflix";
    signInBtn.setAttribute("href", "profiles.html");
  }
});
