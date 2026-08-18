// ============================================================
// forgot-password.js — working password reset (against accounts
// created via signup.html, stored in localStorage under "netflixUsers")
// ============================================================

const LS_USERS = "netflixUsers";

const getUsers = () => JSON.parse(localStorage.getItem(LS_USERS) || "[]");
const setUsers = (arr) => localStorage.setItem(LS_USERS, JSON.stringify(arr));

const stepEmail = document.getElementById("stepEmail");
const stepReset = document.getElementById("stepReset");
const stepDone = document.getElementById("stepDone");
const stepNotFound = document.getElementById("stepNotFound");

const emailForm = document.getElementById("emailForm");
const resetEmailInput = document.getElementById("resetEmail");
const emailError = document.getElementById("emailError");

const resetForm = document.getElementById("resetForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const resetError = document.getElementById("resetError");
const resetEmailLabel = document.getElementById("resetEmailLabel");

const tryAgainLink = document.getElementById("tryAgainLink");

let targetEmail = null;

function showStep(step) {
  [stepEmail, stepReset, stepDone, stepNotFound].forEach((s) => (s.hidden = true));
  step.hidden = false;
}

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  emailError.hidden = true;

  const email = resetEmailInput.value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.hidden = false;
    return;
  }

  const users = getUsers();
  const match = users.find((u) => u.email.toLowerCase() === email);

  if (match) {
    targetEmail = match.email;
    resetEmailLabel.textContent = match.email;
    showStep(stepReset);
  } else {
    showStep(stepNotFound);
  }
});

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  resetError.hidden = true;

  const pw = newPasswordInput.value;
  const confirm = confirmPasswordInput.value;

  if (pw.length < 4) {
    resetError.textContent = "Password must be at least 4 characters.";
    resetError.hidden = false;
    return;
  }
  if (pw !== confirm) {
    resetError.textContent = "Passwords don't match.";
    resetError.hidden = false;
    return;
  }

  const users = getUsers().map((u) =>
    u.email.toLowerCase() === targetEmail.toLowerCase() ? { ...u, password: pw } : u
  );
  setUsers(users);

  showStep(stepDone);
});

tryAgainLink.addEventListener("click", (e) => {
  e.preventDefault();
  resetEmailInput.value = "";
  showStep(stepEmail);
});
