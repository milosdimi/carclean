// =====================
// Menü
// =====================
function showMenu() {
  const menu = document.getElementById("menuoverlay");
  const toggle = document.getElementById("menu-toggle");
  if (menu) menu.style.width = "100%";
  if (toggle) toggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  const menu = document.getElementById("menuoverlay");
  const toggle = document.getElementById("menu-toggle");
  if (menu) menu.style.width = "0";
  if (toggle) toggle.setAttribute("aria-expanded", "false");
}

// =====================
// Hero Text Carousel
// =====================
let heroIndex = 0;
let heroTimer = null;

function startHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  slides[0].classList.add('active');
  document.querySelector('.hero-dot')?.classList.add('active');

  heroTimer = setInterval(() => goToHeroSlide((heroIndex + 1) % slides.length), 4500);
}

function goToHeroSlide(next) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');

  slides[heroIndex].classList.remove('active');
  dots[heroIndex]?.classList.remove('active');
  heroIndex = next;
  slides[heroIndex].classList.add('active');
  dots[heroIndex]?.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  startHeroCarousel();

  document.querySelectorAll('.hero-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(heroTimer);
      goToHeroSlide(parseInt(dot.dataset.index));
      heroTimer = setInterval(() => {
        goToHeroSlide((heroIndex + 1) % document.querySelectorAll('.hero-slide').length);
      }, 4500);
    });
  });

  // Galerie / Vorher-Nachher (nur auf diesen Seiten vorhanden)
  initGallery();

  // Menü-Buttons
  document.getElementById("menu-toggle")?.addEventListener("click", showMenu);
  document.getElementById("menu-close")?.addEventListener("click", closeMenu);

  // Scroll Reveal: about-text und service-list einzeln beobachten
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: "0px 0px -60px 0px" // 60px vor dem unteren Rand triggern
  });

  document.querySelectorAll(
    ".about-text, .service-list, .offer-content, .wrapper, .connect-text, .connect-buttons, .connect-map, .gallery-block, .contact-form, .contact-info"
  ).forEach(el => revealObserver.observe(el));

  // Kontaktformular
  document.getElementById("contact-form")?.addEventListener("submit", sendMail);

  // Saison-Aktion
  initOffer();

  // 2-Klick-Karte (Google Maps erst nach Zustimmung)
  initMapConsent();

  // "Jetzt geöffnet" / "Geschlossen"
  showOpenStatus();
});


// =====================
// Öffnungszeiten: "Jetzt geöffnet" / "Geschlossen"
// Zeiten hier zentral ändern. Tage: 1 = Montag … 6 = Samstag, 0 = Sonntag.
// Hinweis: Feiertage werden nicht berücksichtigt.
// =====================
const OPENING_HOURS = { days: [1, 2, 3, 4, 5, 6], open: "08:00", close: "20:00" };
const DAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

function showOpenStatus() {
  const badges = document.querySelectorAll("[data-open-status]");
  if (!badges.length) return;

  const { day, minutes } = nowInKufstein();
  const openMin = toMinutes(OPENING_HOURS.open);
  const closeMin = toMinutes(OPENING_HOURS.close);
  const isOpenDay = OPENING_HOURS.days.includes(day);
  const isOpen = isOpenDay && minutes >= openMin && minutes < closeMin;

  let text;
  if (isOpen) {
    text = `Jetzt geöffnet · bis ${OPENING_HOURS.close} Uhr`;
  } else if (isOpenDay && minutes < openMin) {
    text = `Geschlossen · öffnet heute um ${OPENING_HOURS.open} Uhr`;
  } else {
    // nächsten Öffnungstag suchen (morgen, übermorgen, …)
    let next = day, step = 0;
    do { next = (next + 1) % 7; step++; } while (!OPENING_HOURS.days.includes(next));
    const when = step === 1 ? "morgen" : DAY_NAMES[next];
    text = `Geschlossen · öffnet ${when} um ${OPENING_HOURS.open} Uhr`;
  }

  badges.forEach(badge => {
    badge.textContent = text;
    badge.classList.toggle("is-open", isOpen);
    badge.classList.toggle("is-closed", !isOpen);
  });
}

// Aktuelle Zeit in Kufstein – auch wenn der Besucher z.B. im Urlaub in einer anderen Zeitzone ist
function nowInKufstein() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Vienna",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type) => parts.find(p => p.type === type).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}


// =====================
// 2-Klick-Karte (DSGVO)
// Google Maps wird erst geladen, wenn der Besucher auf "Karte laden" klickt.
// Mit Häkchen "Karten immer laden" merken wir uns die Wahl im localStorage.
// =====================
const MAP_CONSENT_KEY = "maps_consent";

function initMapConsent() {
  const placeholders = document.querySelectorAll(".map-consent");
  if (!placeholders.length) return;

  // Wurde die Zustimmung schon früher gespeichert? -> direkt laden
  if (readMapConsent()) {
    placeholders.forEach(loadMap);
    return;
  }

  placeholders.forEach(placeholder => {
    placeholder.querySelector(".map-consent-btn").addEventListener("click", () => {
      if (placeholder.querySelector(".map-consent-check").checked) saveMapConsent();
      loadMap(placeholder);
    });
  });
}

function loadMap(placeholder) {
  const iframe = document.createElement("iframe");
  iframe.src = placeholder.dataset.mapSrc;
  iframe.title = "CarClean Kufstein Standort";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.allowFullscreen = true;
  placeholder.replaceWith(iframe); // Platzhalter raus, Karte rein
}

// localStorage kann im privaten Modus oder bei blockierten Website-Daten einen Fehler werfen -> try/catch
function readMapConsent() {
  try { return localStorage.getItem(MAP_CONSENT_KEY) === "true"; }
  catch { return false; }
}

function saveMapConsent() {
  try { localStorage.setItem(MAP_CONSENT_KEY, "true"); }
  catch { /* nicht speichern können ist kein Problem, Karte lädt trotzdem */ }
}


// =====================
// Kontaktformular (Formspree)
// =====================
function sendMail(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;

  const data = new FormData(form);

  fetch("https://formspree.io/f/mdknjddr", {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      // fetch wirft bei HTTP-Fehlern (z.B. 400, 500) KEINEN Fehler – das müssen wir selbst prüfen
      if (!response.ok) throw new Error("Formspree Status " + response.status);
      window.location.href = "./send_mail.html";
    })
    .catch((error) => {
      console.error("Fehler beim Senden:", error);
      alert("Fehler beim Senden. Bitte versuch es später nochmal.");
    });
}

// =====================
// Saison-Aktion (Weihnachts-Gutschein)
// =====================
function initOffer() {
  const popup = document.getElementById("offer-popup");
  if (!popup) return; // Section gibt es nur auf der Startseite

  const select = document.getElementById("offer-select");

  // Haupt-Button: Popup ohne Vorauswahl öffnen
  document.getElementById("offer-open").addEventListener("click", () => openOffer());

  // Betrag-Buttons: Popup öffnen + Betrag im Select vorauswählen
  document.querySelectorAll(".offer-amount").forEach(btn => {
    btn.addEventListener("click", () => openOffer(btn.dataset.amount));
  });

  // Wunschbetrag-Feld nur zeigen, wenn "Wunschbetrag" gewählt ist
  select.addEventListener("change", toggleCustomAmount);

  // Schließen: X-Button, Klick auf den dunklen Hintergrund, Escape-Taste
  document.getElementById("offer-close").addEventListener("click", closeOffer);
  document.getElementById("offer-success-close").addEventListener("click", closeOffer);
  popup.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeOffer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("is-open")) closeOffer();
  });

  document.getElementById("offer-form").addEventListener("submit", sendOfferMail);

  startChristmasCountdown();
}

function openOffer(amount) {
  const popup = document.getElementById("offer-popup");
  const select = document.getElementById("offer-select");

  if (amount) select.value = amount;
  toggleCustomAmount();

  popup.classList.add("is-open");
  document.body.style.overflow = "hidden";
  popup.querySelector("input[name='name']").focus();
}

function closeOffer() {
  const popup = document.getElementById("offer-popup");
  popup.classList.remove("is-open");
  document.body.style.overflow = "";

  // Nach dem Schließen wieder das Formular statt der Danke-Meldung zeigen
  document.getElementById("offer-form").hidden = false;
  document.getElementById("offer-success").hidden = true;
}

function toggleCustomAmount() {
  const isCustom = document.getElementById("offer-select").value === "Wunschbetrag";
  const wrap = document.getElementById("offer-custom-wrap");
  const input = document.getElementById("offer-custom");

  wrap.hidden = !isCustom;
  input.required = isCustom; // Pflichtfeld nur, wenn sichtbar
  if (!isCustom) input.value = "";
}

function sendOfferMail(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;

  const button = form.querySelector("button[type='submit']");
  button.disabled = true; // verhindert Doppelklick = doppelte Bestellung
  button.textContent = "Wird gesendet…";

  fetch("https://formspree.io/f/mdknjddr", {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Formspree Status " + response.status);
      form.reset();
      toggleCustomAmount();
      form.hidden = true;
      document.getElementById("offer-success").hidden = false;
    })
    .catch((error) => {
      console.error("Fehler beim Senden:", error);
      alert("Fehler beim Senden. Bitte versuchen Sie es später nochmal oder rufen Sie uns an.");
    })
    .finally(() => {
      button.disabled = false;
      button.textContent = "Bestellung absenden";
    });
}

// Zeigt "Noch X Tage bis Weihnachten" – ab dem 25.12. verschwindet die Anzeige
function startChristmasCountdown() {
  const el = document.getElementById("offer-countdown");
  if (!el) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const christmas = new Date(today.getFullYear(), 11, 24); // Monat 11 = Dezember (zählt ab 0!)
  const days = Math.round((christmas - today) / (1000 * 60 * 60 * 24));

  if (days > 1) el.textContent = `🎄 Noch ${days} Tage bis Weihnachten`;
  else if (days === 1) el.textContent = "🎄 Morgen ist Heiligabend!";
  else if (days === 0) el.textContent = "🎄 Frohe Weihnachten!";
  // days < 0 → bleibt leer, CSS blendet es aus (:not(:empty))
}

// =====================
// Galerie + Vorher/Nachher (ein gemeinsames Modul für beide Seiten)
// Welche Galerie geladen wird, steht im HTML: <div id="images" data-gallery="galerie">
// =====================
const GALLERIES = {
  galerie: { folder: "galerie",      count: 52, alt: "CarClean Galerie – Autoaufbereitung Kufstein" },
  vornach: { folder: "vornachfotos", count: 21, alt: "Vorher-Nachher Autoaufbereitung Kufstein – CarClean" },
};

let galleryImages = [];   // Liste der großen Bilder (1600px)
let galleryAlt = "";
let lightboxIndex = 0;
let lastFocusedTile = null; // um nach dem Schließen den Fokus zurückzugeben

function initGallery() {
  const grid = document.getElementById("images");
  const config = GALLERIES[grid?.dataset.gallery];
  if (!config) return;

  galleryImages = Array.from({ length: config.count }, (_, i) => `${config.folder}/${i + 1}.jpg`);
  galleryAlt = config.alt;

  // Raster aus Vorschaubildern bauen. <button> statt <div>, damit es auch per Tastatur bedienbar ist.
  grid.innerHTML = galleryImages.map((src, i) => `
    <button type="button" class="gallery-tile" data-index="${i}" aria-label="Bild ${i + 1} groß anzeigen">
      <img src="${thumbOf(src)}" alt="${galleryAlt} – Bild ${i + 1}" loading="lazy" decoding="async">
    </button>`).join("");

  // sanft einblenden, sobald das Vorschaubild geladen ist
  grid.querySelectorAll(".gallery-tile img").forEach(img => {
    if (img.complete) img.classList.add("is-loaded");
    else img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
  });

  // ein Klick-Listener für alle Kacheln ("Event Delegation")
  grid.addEventListener("click", (e) => {
    const tile = e.target.closest(".gallery-tile");
    if (tile) openLightbox(Number(tile.dataset.index), tile);
  });

  initLightbox();
}

// Vorschaubild (800px) für das Raster: "galerie/5.jpg" -> "galerie/thumbs/5.jpg"
// Das große Bild (1600px) wird erst in der Lightbox geladen.
function thumbOf(src) {
  return src.replace(/\/([^/]+)$/, "/thumbs/$1");
}

// ---------- Lightbox ----------
function initLightbox() {
  const box = document.getElementById("lightbox");
  if (!box) return;

  box.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  box.querySelector(".lightbox-prev").addEventListener("click", () => stepLightbox(-1));
  box.querySelector(".lightbox-next").addEventListener("click", () => stepLightbox(1));

  // Klick auf den dunklen Hintergrund schließt
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lightbox-stage")) closeLightbox();
  });

  // Tastatur: Escape, Pfeil links/rechts
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  // Wischen am Handy: Startpunkt merken, beim Loslassen Richtung auswerten
  let touchStartX = 0, touchStartY = 0;
  box.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  box.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) stepLightbox(dx < 0 ? 1 : -1);
  });
}

function openLightbox(index, tile) {
  const box = document.getElementById("lightbox");
  lastFocusedTile = tile || null;
  box.hidden = false;
  document.body.style.overflow = "hidden";
  showLightboxImage(index);
  box.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  const box = document.getElementById("lightbox");
  box.hidden = true;
  document.body.style.overflow = "";
  lastFocusedTile?.focus(); // Tastatur-Nutzer landen wieder bei der Kachel
}

function stepLightbox(direction) {
  // Modulo = Endlos-Schleife: nach dem letzten Bild kommt wieder das erste
  showLightboxImage((lightboxIndex + direction + galleryImages.length) % galleryImages.length);
}

function showLightboxImage(index) {
  const box = document.getElementById("lightbox");
  const img = box.querySelector(".lightbox-img");
  lightboxIndex = index;

  img.classList.remove("is-loaded");
  img.onload = () => img.classList.add("is-loaded");
  img.src = galleryImages[index];
  img.alt = `${galleryAlt} – Bild ${index + 1}`;
  box.querySelector(".lightbox-counter").textContent = `${index + 1} / ${galleryImages.length}`;

  // Nachbarbilder schon vorladen -> Blättern fühlt sich sofort an
  [index - 1, index + 1].forEach(n => {
    const pre = new Image();
    pre.src = galleryImages[(n + galleryImages.length) % galleryImages.length];
  });
}

