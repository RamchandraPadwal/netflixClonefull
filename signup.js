// ============================================================
// signup.js — new member account creation
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const confirmInput = document.getElementById("signupConfirm");
  const agreeInput = document.getElementById("agreeTerms");
  const toggleBtn = document.getElementById("togglePassword");
  const errorBox = document.getElementById("formError");

  // Pre-fill from the homepage hero email box, if the visitor came from there.
  const params = new URLSearchParams(window.location.search);
  const prefillEmail = params.get("email");
  if (prefillEmail) emailInput.value = prefillEmail;

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
  const setInvalid = (input, invalid) => input.classList.toggle("field--invalid", invalid);
  [nameInput, emailInput, passwordInput, confirmInput].forEach((input) =>
    input.addEventListener("input", () => setInvalid(input, false))
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    const nameValid = name.length >= 2;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = password.length >= 4;
    const confirmValid = password === confirm;

    setInvalid(nameInput, !nameValid);
    setInvalid(emailInput, !emailValid);
    setInvalid(passwordInput, !passwordValid);
    setInvalid(confirmInput, !confirmValid);

    if (!nameValid || !emailValid || !passwordValid || !confirmValid) {
      showError(
        !confirmValid && passwordValid
          ? "Passwords don't match."
          : "Please fill out every field correctly — password must be at least 4 characters."
      );
      return;
    }

    if (!agreeInput.checked) {
      showError("Please agree to the Terms of Use and Privacy Statement to continue.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("netflixUsers") || "[]");
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      showError("An account with that email already exists. Try signing in instead.");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("netflixUsers", JSON.stringify(users));

    // Auto sign-in, matching real Netflix's flow of moving straight from
    // signup into the app (profile picker) without a separate login step.
    localStorage.setItem("netflixLoggedIn", "true");
    localStorage.setItem("netflixEmail", email);
    localStorage.removeItem("netflixActiveProfile");

    // A brand-new account should also start with a clean profile list,
    // named after the person who just signed up.
    localStorage.removeItem("netflixProfiles");

    window.location.href = "profiles.html";
  });
});
