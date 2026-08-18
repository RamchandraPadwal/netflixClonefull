// ============================================================
// browse.js — the Netflix "app" experience
// ============================================================

// ---------- Auth guard -------------------------------------
// Must be signed in AND have picked a profile (matches real Netflix's flow).
if (localStorage.getItem("netflixLoggedIn") !== "true") {
  window.location.href = "login.html";
}
if (!localStorage.getItem("netflixActiveProfile")) {
  window.location.href = "profiles.html";
}

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

function getActiveProfile() {
  const id = Number(localStorage.getItem("netflixActiveProfile"));
  const profiles = JSON.parse(localStorage.getItem("netflixProfiles") || "[]");
  return profiles.find((p) => p.id === id) || null;
}

// ---------- Content catalog ----------------------------------
const CONTENT = [
  { id: 1, title: "Midnight Signal", type: "movies", year: 2024, genre: "Sci-Fi Thriller", badge: "Top 10", mature: true, match: 97, rating: "16+", duration: "1h 58m", desc: "A radio astronomer intercepts a signal that shouldn't exist — and the closer she gets to decoding it, the more it seems to be decoding her.", img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop" },
  { id: 2, title: "Ashen Coast", type: "movies", year: 2023, genre: "Drama", badge: "Top 10", mature: false, match: 95, rating: "13+", duration: "2h 08m", desc: "When a coastal town's fishing fleet vanishes overnight, one journalist's search for answers uncovers secrets the sea was never meant to give up.", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=500&auto=format&fit=crop" },
  { id: 3, title: "Glass City", type: "tv", year: 2024, genre: "Crime Series", badge: "Top 10", mature: true, match: 92, rating: "16+", duration: "3 Seasons", desc: "A detective who sees crime scenes as architecture must rebuild a case from the ground up before the real killer redesigns their next victim.", img: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=500&auto=format&fit=crop" },
  { id: 4, title: "Northbound", type: "movies", year: 2022, genre: "Adventure", mature: false, match: 88, rating: "7+", duration: "1h 44m", desc: "Two siblings cross a frozen continent on a hand-built sled to reach the father who left them behind, chasing a map that might be a lie.", img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=500&auto=format&fit=crop" },
  { id: 5, title: "Salt & Static", type: "new", year: 2024, genre: "Documentary", mature: false, match: 90, rating: "13+", duration: "1h 32m", desc: "An intimate look at the last analog radio station on the coast, and the eccentric crew fighting to keep it broadcasting.", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop" },
  { id: 6, title: "Paper Moons", type: "movies", year: 2023, genre: "Romance", mature: false, match: 85, rating: "13+", duration: "1h 51m", desc: "Two strangers keep meeting by accident in the same small bookstore, and start to wonder if the universe is trying to tell them something.", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop" },
  { id: 7, title: "Harbor Lights", type: "tv", year: 2024, genre: "Mystery Series", mature: true, match: 94, rating: "16+", duration: "2 Seasons", desc: "A lighthouse keeper's disappearance reopens a decades-old mystery that the whole town agreed to stop asking about.", img: "https://images.unsplash.com/photo-1483736762161-1d107f3c78e1?q=80&w=500&auto=format&fit=crop" },
  { id: 8, title: "Static Bloom", type: "new", year: 2025, genre: "Animated Series", mature: false, match: 96, rating: "All", duration: "1 Season", desc: "In a garden city powered by music, a tone-deaf inventor builds a robot that can finally hear the flowers sing.", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=500&auto=format&fit=crop" },
  { id: 9, title: "Iron Meridian", type: "movies", year: 2021, genre: "Action", mature: true, match: 89, rating: "16+", duration: "2h 15m", desc: "An ex-smuggler is pulled back for one last run across a border that no longer exists on any map she trusts.", img: "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=500&auto=format&fit=crop" },
  { id: 10, title: "The Long Thaw", type: "tv", year: 2023, genre: "Drama Series", mature: false, match: 91, rating: "13+", duration: "4 Seasons", desc: "A family thaws out a decades-old feud one winter at a time in this slow-burning saga set in a remote mountain town.", img: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=500&auto=format&fit=crop" },
  { id: 11, title: "Velvet Static", type: "new", year: 2025, genre: "Musical", badge: "New", mature: false, match: 93, rating: "13+", duration: "1h 47m", desc: "A washed-up producer gets one more shot at a hit record with a singer who refuses to play anything the easy way.", img: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop" },
  { id: 12, title: "Six Degrees North", type: "movies", year: 2020, genre: "Thriller", mature: true, match: 87, rating: "16+", duration: "1h 56m", desc: "A cartographer discovers her latest survey doesn't match any known coastline — and someone is willing to kill to keep it that way.", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop" },
  { id: 13, title: "Coral & Ash", type: "tv", year: 2022, genre: "Fantasy Series", mature: false, match: 90, rating: "13+", duration: "2 Seasons", desc: "Twin kingdoms built from coral and volcanic ash go to war over a treaty neither of them remembers signing.", img: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?q=80&w=500&auto=format&fit=crop" },
  { id: 14, title: "Nightshift Diner", type: "new", year: 2025, genre: "Comedy", badge: "New", mature: false, match: 89, rating: "All", duration: "1 Season", desc: "The regulars at a 24-hour diner form an unlikely family across the strangest graveyard shift in town.", img: "https://images.unsplash.com/photo-1512070679279-8988d32161be?q=80&w=500&auto=format&fit=crop" },
  { id: 15, title: "Quiet Frequencies", type: "tv", year: 2021, genre: "Docuseries", mature: false, match: 86, rating: "13+", duration: "1 Season", desc: "A sound engineer travels the world recording the frequencies humans can't hear but animals can't live without.", img: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=500&auto=format&fit=crop" },
  { id: 16, title: "The Last Ember", type: "movies", year: 2019, genre: "Fantasy", mature: false, match: 84, rating: "7+", duration: "2h 02m", desc: "The last apprentice of a dying order of fire-keepers must relight a flame that hasn't burned in a thousand years.", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=500&auto=format&fit=crop" },
];

// A few titles the person has already "started" — powers the Continue Watching row's progress bars.
const CONTINUE_WATCHING = { 3: 62, 7: 28, 10: 81, 13: 14, 9: 47 };

// ---------- localStorage keys --------------------------------
const LS_MYLIST = "netflixMyList";
const LS_DISMISSED = "netflixDismissedNotifs";

const getMyList = () => JSON.parse(localStorage.getItem(LS_MYLIST) || "[]");
const setMyList = (arr) => localStorage.setItem(LS_MYLIST, JSON.stringify(arr));
const isInMyList = (id) => getMyList().includes(id);

const toggleMyList = (id) => {
  const list = getMyList();
  const idx = list.indexOf(id);
  let added;
  if (idx === -1) {
    list.push(id);
    added = true;
  } else {
    list.splice(idx, 1);
    added = false;
  }
  setMyList(list);
  return added;
};

// ---------- Kids-profile filtering -----------------------------
function visibleContent(list) {
  const profile = getActiveProfile();
  if (profile && profile.isKids) {
    return list.filter((c) => !c.mature);
  }
  return list;
}

// ---------- Card rendering -----------------------------------
function cardHTML(item, opts = {}) {
  const added = isInMyList(item.id);
  const progress = opts.showProgress ? CONTINUE_WATCHING[item.id] : undefined;

  return `
    <article class="card" data-id="${item.id}">
      <div class="card__poster">
        <img src="${item.img}" alt="${item.title} poster" loading="lazy" />
        ${item.badge ? `<span class="card__badge">${item.badge}</span>` : ""}
        <div class="card__overlay">
          <button class="card__icon-btn card__play" title="Play" aria-label="Play ${item.title}">▶</button>
          <button class="card__icon-btn card__add ${added ? "is-added" : ""}" title="${added ? "Remove from My List" : "Add to My List"}" data-id="${item.id}">${added ? "✓" : "+"}</button>
          <button class="card__icon-btn card__info" title="More info" data-id="${item.id}">ⓘ</button>
        </div>
        ${
          progress
            ? `<div class="card__progress"><div class="card__progress-bar" style="width:${progress}%"></div></div>`
            : ""
        }
      </div>
      <h3 class="card__title">${item.title}</h3>
      <p class="card__meta">${item.year} · ${item.genre}</p>
    </article>
  `;
}

function renderTrack(containerId, items, opts) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = visibleContent(items).map((i) => cardHTML(i, opts)).join("");
}

function renderGrid(containerId, items, emptyMsgId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const filtered = visibleContent(items);
  el.innerHTML = filtered.map((i) => cardHTML(i)).join("");
  if (emptyMsgId) {
    const emptyEl = document.getElementById(emptyMsgId);
    if (emptyEl) emptyEl.hidden = filtered.length > 0;
  }
}

function renderAll() {
  renderTrack("row-trending", CONTENT.slice(0, 8));
  renderTrack("row-popular", [...CONTENT].reverse().slice(0, 8));
  renderTrack(
    "row-continue",
    CONTENT.filter((c) => Object.prototype.hasOwnProperty.call(CONTINUE_WATCHING, c.id)),
    { showProgress: true }
  );

  renderGrid("tv-grid", CONTENT.filter((c) => c.type === "tv"));
  renderGrid("movies-grid", CONTENT.filter((c) => c.type === "movies"));
  renderGrid("new-grid", CONTENT.filter((c) => c.type === "new"));

  const myItems = CONTENT.filter((c) => isInMyList(c.id));
  renderGrid("mylist-grid", myItems, "mylistEmptyMsg");
}

// ---------- Toast --------------------------------------------------
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("toast--visible"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => (toast.hidden = true), 250);
  }, 2200);
}

// ---------- Title details modal -------------------------------------
const modal = document.getElementById("titleModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalMatch = document.getElementById("modalMatch");
const modalRating = document.getElementById("modalRating");
const modalDuration = document.getElementById("modalDuration");
const modalDesc = document.getElementById("modalDesc");
const modalGenres = document.getElementById("modalGenres");
const modalAddBtn = document.getElementById("modalAddBtn");

function openModal(item) {
  modalImg.src = item.img.replace("w=500", "w=1000");
  modalImg.alt = `${item.title} artwork`;
  modalMatch.textContent = `${item.match}% Match`;
  modalRating.textContent = item.rating;
  modalDuration.textContent = item.duration;
  modalDesc.textContent = item.desc;
  modalGenres.textContent = `${item.genre} · ${item.type === "tv" ? "TV Series" : "Movie"} · ${item.year}`;

  const added = isInMyList(item.id);
  modalAddBtn.dataset.id = String(item.id);
  modalAddBtn.classList.toggle("is-added", added);
  modalAddBtn.textContent = added ? "✓" : "+";
  modalAddBtn.title = added ? "Remove from My List" : "Add to My List";

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// ---------- Event delegation: card buttons (add / info / play) ----------
document.addEventListener("click", (e) => {
  const infoBtn = e.target.closest(".card__info");
  if (infoBtn) {
    const id = Number(infoBtn.dataset.id);
    const item = CONTENT.find((c) => c.id === id);
    if (item) openModal(item);
    return;
  }

  const addBtn = e.target.closest(".card__add, .btn--addlist, .modal__add");
  if (addBtn) {
    const id = Number(addBtn.dataset.id);
    const item = CONTENT.find((c) => c.id === id);
    const nowAdded = toggleMyList(id);

    document.querySelectorAll(`[data-id="${id}"].card__add`).forEach((btn) => {
      btn.classList.toggle("is-added", nowAdded);
      btn.textContent = nowAdded ? "✓" : "+";
    });
    document.querySelectorAll(`.btn--addlist[data-id="${id}"]`).forEach((btn) => {
      btn.classList.toggle("is-added", nowAdded);
      btn.textContent = nowAdded ? "✓ In My List" : "+ My List";
    });
    if (Number(modalAddBtn.dataset.id) === id) {
      modalAddBtn.classList.toggle("is-added", nowAdded);
      modalAddBtn.textContent = nowAdded ? "✓" : "+";
    }

    if (item) showToast(nowAdded ? `Added "${item.title}" to My List` : `Removed "${item.title}" from My List`);

    const myItems = CONTENT.filter((c) => isInMyList(c.id));
    renderGrid("mylist-grid", myItems, "mylistEmptyMsg");
    return;
  }

  const playBtn = e.target.closest(".card__play");
  if (playBtn) {
    const card = playBtn.closest(".card");
    const item = CONTENT.find((c) => c.id === Number(card.dataset.id));
    if (item) showToast(`▶ Playing "${item.title}" (demo — no video attached)`);
  }
});

// ---------- Page navigation -------------------------------------------
const navLinks = document.querySelectorAll(".navlink");
const pages = document.querySelectorAll(".page");

function showPage(pageKey) {
  pages.forEach((p) => p.classList.remove("page--active"));
  const target = document.getElementById(`${pageKey}-page`);
  if (target) target.classList.add("page--active");

  navLinks.forEach((link) => {
    link.classList.toggle("navlink--active", link.dataset.page === pageKey);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    closeSearch();
    showPage(link.dataset.page);
  });
});

// ---------- Search ---------------------------------------------
const searchWrap = document.getElementById("search");
const searchToggle = document.getElementById("searchToggle");
const searchInput = document.getElementById("searchInput");
const searchResultsHeading = document.getElementById("searchResultsHeading");
const searchEmptyMsg = document.getElementById("searchEmptyMsg");

function openSearch() {
  searchWrap.classList.add("search--open");
  searchToggle.setAttribute("aria-expanded", "true");
  searchInput.focus();
}

function closeSearch() {
  searchWrap.classList.remove("search--open");
  searchToggle.setAttribute("aria-expanded", "false");
  searchInput.value = "";
  document.getElementById("search-page").classList.remove("page--active");
  const activeLink = document.querySelector(".navlink--active");
  if (activeLink) showPage(activeLink.dataset.page);
}

searchToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  if (searchWrap.classList.contains("search--open")) {
    closeSearch();
  } else {
    openSearch();
  }
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    document.getElementById("search-page").classList.remove("page--active");
    const activeLink = document.querySelector(".navlink--active");
    if (activeLink) document.getElementById(`${activeLink.dataset.page}-page`).classList.add("page--active");
    return;
  }

  const matches = visibleContent(CONTENT).filter(
    (c) => c.title.toLowerCase().includes(query) || c.genre.toLowerCase().includes(query)
  );

  pages.forEach((p) => p.classList.remove("page--active"));
  document.getElementById("search-page").classList.add("page--active");
  searchResultsHeading.textContent = `Results for "${searchInput.value}"`;
  document.getElementById("searchResultsGrid").innerHTML = matches.map((i) => cardHTML(i)).join("");
  searchEmptyMsg.hidden = matches.length > 0;
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSearch();
});

// ---------- Notifications ---------------------------------------
const notifToggle = document.getElementById("notifToggle");
const notifDropdown = document.getElementById("notifDropdown");
const notifBadge = document.getElementById("notifBadge");
const notifList = document.getElementById("notifList");
const notifEmpty = document.getElementById("notifEmpty");

function updateNotifBadge() {
  const remaining = notifList.querySelectorAll(".notif__item").length;
  if (remaining === 0) {
    notifBadge.hidden = true;
    notifEmpty.hidden = false;
  } else {
    notifBadge.hidden = false;
    notifBadge.textContent = String(remaining);
    notifEmpty.hidden = true;
  }
}

const dismissed = JSON.parse(localStorage.getItem(LS_DISMISSED) || "[]");
dismissed.forEach((id) => {
  const item = notifList.querySelector(`[data-id="${id}"]`);
  if (item) item.remove();
});
updateNotifBadge();

notifToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = !notifDropdown.hidden;
  closeAllDropdowns();
  notifDropdown.hidden = isOpen;
  notifToggle.setAttribute("aria-expanded", String(!isOpen));
  if (!isOpen) {
    notifBadge.hidden = true;
  } else {
    updateNotifBadge();
  }
});

notifList.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".notif__close");
  if (!closeBtn) return;
  const item = closeBtn.closest(".notif__item");
  const id = item.dataset.id;
  item.remove();

  const stored = JSON.parse(localStorage.getItem(LS_DISMISSED) || "[]");
  if (!stored.includes(id)) {
    stored.push(id);
    localStorage.setItem(LS_DISMISSED, JSON.stringify(stored));
  }
  updateNotifBadge();
});

// ---------- Profile dropdown -------------------------------------
const profileToggle = document.getElementById("profileToggle");
const profileDropdown = document.getElementById("profileDropdown");
const profileCurrent = document.getElementById("profileCurrent");
const signOutBtn = document.getElementById("signOutBtn");
const navAvatar = document.getElementById("navAvatar");
const navAvatarInitial = document.getElementById("navAvatarInitial");
const kidsBanner = document.getElementById("kidsBanner");

function applyActiveProfileUI() {
  const profile = getActiveProfile();
  if (!profile) return;

  const color = AVATAR_COLORS[profile.avatarIndex % AVATAR_COLORS.length];
  navAvatar.style.background = color;
  navAvatarInitial.textContent = profile.name.charAt(0).toUpperCase();

  profileCurrent.innerHTML = `
    <span class="profile__current-avatar" style="background:${color}">${profile.name.charAt(0).toUpperCase()}</span>
    <span class="profile__current-name">${profile.name}${profile.isKids ? " (Kids)" : ""}</span>
  `;

  kidsBanner.hidden = !profile.isKids;
}

profileToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = !profileDropdown.hidden;
  closeAllDropdowns();
  profileDropdown.hidden = isOpen;
  profileToggle.setAttribute("aria-expanded", String(!isOpen));
});

signOutBtn.addEventListener("click", () => {
  localStorage.removeItem("netflixLoggedIn");
  localStorage.removeItem("netflixActiveProfile");
  window.location.href = "index.html";
});

// ---------- Close dropdowns on outside click / escape -------------
function closeAllDropdowns() {
  notifDropdown.hidden = true;
  notifToggle.setAttribute("aria-expanded", "false");
  profileDropdown.hidden = true;
  profileToggle.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".notif")) notifDropdown.hidden = true;
  if (!e.target.closest(".profile")) profileDropdown.hidden = true;
  if (!e.target.closest(".search") && searchWrap.classList.contains("search--open") && !searchInput.value) {
    closeSearch();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllDropdowns();
});

// ---------- Mobile hamburger menu ----------------------------------
const hamburgerToggle = document.getElementById("hamburgerToggle");
const navLinksEl = document.getElementById("navLinks");

hamburgerToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = navLinksEl.classList.toggle("navbar__links--mobile-open");
  hamburgerToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".navbar__left")) {
    navLinksEl.classList.remove("navbar__links--mobile-open");
    hamburgerToggle.setAttribute("aria-expanded", "false");
  }
});

// ---------- Hero "+ My List" initial state -------------------------
function syncHeroAddButton() {
  document.querySelectorAll(".btn--addlist").forEach((btn) => {
    const id = Number(btn.dataset.id);
    const added = isInMyList(id);
    btn.classList.toggle("is-added", added);
    btn.textContent = added ? "✓ In My List" : "+ My List";
  });
}

// ---------- Init ---------------------------------------------------
applyActiveProfileUI();
renderAll();
syncHeroAddButton();
