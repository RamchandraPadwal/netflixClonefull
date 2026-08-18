// ============================================================
// profiles.js — "Who's watching?" + Manage Profiles
// ============================================================

// ---------- Auth guard ---------------------------------------
if (localStorage.getItem("netflixLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const LS_PROFILES = "netflixProfiles";
const LS_ACTIVE_PROFILE = "netflixActiveProfile";
const MAX_PROFILES = 5;

// Netflix-style flat color avatars (no external images needed).
const AVATAR_COLORS = [
  "linear-gradient(135deg,#e50914,#6d1b1b)",
  "linear-gradient(135deg,#0071eb,#00284d)",
  "linear-gradient(135deg,#8e44ad,#2c0735)",
  "linear-gradient(135deg,#f5a623,#7a4b00)",
  "linear-gradient(135deg,#2ecc71,#0b4a26)",
  "linear-gradient(135deg,#1abc9c,#0b4a42)",
  "linear-gradient(135deg,#e91e8c,#5c0033)",
  "linear-gradient(135deg,#546e7a,#1c262b)",
];

// ---------- Storage helpers -----------------------------------
function getProfiles() {
  return JSON.parse(localStorage.getItem(LS_PROFILES) || "[]");
}

function setProfiles(profiles) {
  localStorage.setItem(LS_PROFILES, JSON.stringify(profiles));
}

function seedDefaultProfileIfNeeded() {
  let profiles = getProfiles();
  if (profiles.length === 0) {
    const email = localStorage.getItem("netflixEmail") || "you@example.com";
    const defaultName = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") || "You";
    profiles = [
      { id: 1, name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1), avatarIndex: 0, isKids: false },
      { id: 2, name: "Kids", avatarIndex: 3, isKids: true },
    ];
    setProfiles(profiles);
  }
  return profiles;
}

// ---------- State -----------------------------------------------
let managing = false;
let editingProfileId = null; // null = adding a new profile
let pendingAvatarIndex = 0;

// ---------- DOM references ---------------------------------------
const gridView = document.getElementById("gridView");
const gridHeading = document.getElementById("gridHeading");
const profilesGrid = document.getElementById("profilesGrid");
const manageToggleBtn = document.getElementById("manageToggleBtn");

const editView = document.getElementById("editView");
const editHeading = document.getElementById("editHeading");
const editAvatarPreview = document.getElementById("editAvatarPreview");
const editAvatarInitial = document.getElementById("editAvatarInitial");
const profileNameInput = document.getElementById("profileName");
const profileKidsInput = document.getElementById("profileKids");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const cancelProfileBtn = document.getElementById("cancelProfileBtn");
const deleteProfileBtn = document.getElementById("deleteProfileBtn");

const avatarPicker = document.getElementById("avatarPicker");
const avatarPickerGrid = document.getElementById("avatarPickerGrid");
const avatarPickerClose = document.getElementById("avatarPickerClose");

// ---------- Render: profile grid ------------------------------------
function renderGrid() {
  const profiles = getProfiles();
  document.body.classList.toggle("profiles--managing", managing);

  gridHeading.textContent = managing ? "Manage Profiles" : "Who's watching?";
  manageToggleBtn.textContent = managing ? "Done" : "Manage Profiles";

  let html = profiles
    .map(
      (p) => `
      <button class="profile-tile" data-id="${p.id}" type="button">
        <span class="profile-tile__avatar" style="background:${AVATAR_COLORS[p.avatarIndex % AVATAR_COLORS.length]}">
          ${p.isKids ? '<span class="profile-tile__kids-badge">KIDS</span>' : ""}
          <span class="profile-tile__pencil">✎</span>
          <span>${escapeHTML(p.name).charAt(0).toUpperCase()}</span>
        </span>
        <span class="profile-tile__name">${escapeHTML(p.name)}</span>
      </button>
    `
    )
    .join("");

  if (profiles.length < MAX_PROFILES) {
    html += `
      <button class="profile-tile profile-tile--add" id="addProfileTile" type="button">
        <span class="profile-tile__avatar">+</span>
        <span class="profile-tile__name">Add Profile</span>
      </button>
    `;
  }

  profilesGrid.innerHTML = html;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Render: avatar picker overlay -----------------------------
function renderAvatarPicker() {
  avatarPickerGrid.innerHTML = AVATAR_COLORS.map(
    (color, i) => `
      <button type="button" class="avatar-picker__swatch ${i === pendingAvatarIndex ? "is-selected" : ""}" data-index="${i}" style="background:${color}">
        ${profileNameInput.value ? profileNameInput.value.charAt(0).toUpperCase() : "?"}
      </button>
    `
  ).join("");
}

// ---------- Switching views -------------------------------------------
function showGridView() {
  editView.hidden = true;
  gridView.hidden = false;
  renderGrid();
}

function showEditView(profile) {
  editingProfileId = profile ? profile.id : null;
  pendingAvatarIndex = profile ? profile.avatarIndex : Math.floor(Math.random() * AVATAR_COLORS.length);

  editHeading.textContent = profile ? "Edit Profile" : "Add Profile";
  profileNameInput.value = profile ? profile.name : "";
  profileKidsInput.checked = profile ? profile.isKids : false;

  const profiles = getProfiles();
  deleteProfileBtn.hidden = !(profile && profiles.length > 1);

  updateAvatarPreview();

  gridView.hidden = true;
  editView.hidden = false;
  profileNameInput.focus();
}

function updateAvatarPreview() {
  editAvatarPreview.style.background = AVATAR_COLORS[pendingAvatarIndex % AVATAR_COLORS.length];
  editAvatarInitial.textContent = profileNameInput.value ? profileNameInput.value.charAt(0).toUpperCase() : "?";
}

// ---------- Event: grid tile clicks -----------------------------------
profilesGrid.addEventListener("click", (e) => {
  const addTile = e.target.closest("#addProfileTile");
  if (addTile) {
    showEditView(null);
    return;
  }

  const tile = e.target.closest(".profile-tile");
  if (!tile) return;
  const id = Number(tile.dataset.id);
  const profile = getProfiles().find((p) => p.id === id);
  if (!profile) return;

  if (managing) {
    showEditView(profile);
  } else {
    localStorage.setItem(LS_ACTIVE_PROFILE, String(profile.id));
    window.location.href = "browse.html";
  }
});

// ---------- Event: manage toggle ---------------------------------------
manageToggleBtn.addEventListener("click", () => {
  managing = !managing;
  renderGrid();
});

// ---------- Event: name input updates avatar initial live --------------
profileNameInput.addEventListener("input", updateAvatarPreview);

// ---------- Event: avatar picker open/close/select ----------------------
editAvatarPreview.addEventListener("click", () => {
  renderAvatarPicker();
  avatarPicker.hidden = false;
});

avatarPickerClose.addEventListener("click", () => {
  avatarPicker.hidden = true;
});

avatarPicker.addEventListener("click", (e) => {
  if (e.target === avatarPicker) avatarPicker.hidden = true; // click outside panel
});

avatarPickerGrid.addEventListener("click", (e) => {
  const swatch = e.target.closest(".avatar-picker__swatch");
  if (!swatch) return;
  pendingAvatarIndex = Number(swatch.dataset.index);
  updateAvatarPreview();
  avatarPicker.hidden = true;
});

// ---------- Event: save / cancel / delete -------------------------------
saveProfileBtn.addEventListener("click", () => {
  const name = profileNameInput.value.trim();
  if (!name) {
    profileNameInput.focus();
    profileNameInput.style.borderColor = "#e87c03";
    return;
  }

  let profiles = getProfiles();

  if (editingProfileId === null) {
    const newId = profiles.length ? Math.max(...profiles.map((p) => p.id)) + 1 : 1;
    profiles.push({ id: newId, name, avatarIndex: pendingAvatarIndex, isKids: profileKidsInput.checked });
  } else {
    profiles = profiles.map((p) =>
      p.id === editingProfileId
        ? { ...p, name, avatarIndex: pendingAvatarIndex, isKids: profileKidsInput.checked }
        : p
    );
  }

  setProfiles(profiles);
  showGridView();
});

cancelProfileBtn.addEventListener("click", () => {
  showGridView();
});

deleteProfileBtn.addEventListener("click", () => {
  let profiles = getProfiles();
  if (profiles.length <= 1) return; // Netflix always requires at least one profile
  profiles = profiles.filter((p) => p.id !== editingProfileId);
  setProfiles(profiles);

  // If the deleted profile was active, clear that so profiles.html is shown again next visit.
  if (localStorage.getItem(LS_ACTIVE_PROFILE) === String(editingProfileId)) {
    localStorage.removeItem(LS_ACTIVE_PROFILE);
  }

  showGridView();
});

profileNameInput.addEventListener("input", () => {
  profileNameInput.style.borderColor = "";
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !avatarPicker.hidden) avatarPicker.hidden = true;
});

// ---------- Init -----------------------------------------------------
seedDefaultProfileIfNeeded();
if (new URLSearchParams(window.location.search).get("manage") === "1") {
  managing = true;
}
renderGrid();
