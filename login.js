// ============================================================
// login.js — sign-in form behaviour
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("togglePassword");
  const errorBox = document.getElementById("formError");
  const rememberMe = document.getElementById("rememberMe");

  // Pre-fill the email if the visitor typed one into the homepage hero form
  // (index.html submits to login.html?email=...).
  const params = new URLSearchParams(window.location.search);
  const prefillEmail = params.get("email");
  if (prefillEmail) {
    emailInput.value = prefillEmail;
  }

  // Restore a remembered email address, if any.
  const rememberedEmail = localStorage.getItem("netflixRememberedEmail");
  if (rememberedEmail && !prefillEmail) {
    emailInput.value = rememberedEmail;
    rememberMe.checked = true;
  }

  // Show / hide password text.
  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtn.textContent = isPassword ? "Hide" : "Show";
  });

  const showError = (message) => {
    errorBox.textContent = message;
    errorBox.hidden = false;
  };

  const hideError = () => {
    errorBox.hidden = true;
    errorBox.textContent = "";
  };

  const setInvalid = (input, invalid) => {
    input.classList.toggle("field--invalid", invalid);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^\+?\d{7,15}$/.test(email);
    const passwordValid = password.length >= 4;

    setInvalid(emailInput, !emailValid);
    setInvalid(passwordInput, !passwordValid);

    if (!emailValid || !passwordValid) {
      showError("Please enter a valid email or phone number, and a password of at least 4 characters.");
      return;
    }

    // If this email belongs to an account created via signup.html, its real
    // password must match. Otherwise (no such account on record) this is a
    // static demo, so any well-formed credentials are accepted.
    const users = JSON.parse(localStorage.getItem("netflixUsers") || "[]");
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser && existingUser.password !== password) {
      setInvalid(passwordInput, true);
      showError("Incorrect password for this account.");
      return;
    }

    localStorage.setItem("netflixLoggedIn", "true");
    localStorage.setItem("netflixEmail", existingUser ? existingUser.email : email);

    if (rememberMe.checked) {
      localStorage.setItem("netflixRememberedEmail", email);
    } else {
      localStorage.removeItem("netflixRememberedEmail");
    }

    // Signing in always returns to the profile picker, matching real Netflix.
    localStorage.removeItem("netflixActiveProfile");
    window.location.href = "profiles.html";
  });

  // Clear the invalid state as the person retypes.
  emailInput.addEventListener("input", () => setInvalid(emailInput, false));
  passwordInput.addEventListener("input", () => setInvalid(passwordInput, false));
});
