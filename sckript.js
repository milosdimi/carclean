// =====================
// Menü
// =====================
function showMenu() {
  const menu = document.getElementById("menuoverlay");
  if (menu) menu.style.width = "100%";
}

function closeMenu() {
  const menu = document.getElementById("menuoverlay");
  if (menu) menu.style.width = "0";
}

// =====================
// Slider (nur wenn vorhanden)
// =====================
let currentImageIndex = 0;
let sliderIntervalId = null;

function startSlider() {
  const imagess = document.getElementsByClassName("slider_image");
  if (!imagess || imagess.length === 0) return;

  // prevent double intervals
  if (sliderIntervalId) clearInterval(sliderIntervalId);

  sliderIntervalId = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % imagess.length;
    updateSlider();
  }, 3000);

  updateSlider();
}

function updateSlider() {
  const imagess = document.getElementsByClassName("slider_image");
  if (!imagess || imagess.length === 0) return;

  Array.from(imagess).forEach((image, index) => {
    image.style.transform = `translateX(${(index - currentImageIndex) * 100}%)`;
  });
}

function showImage(index) {
  currentImageIndex = index - 1;
  updateSlider();
}

// =====================
// Kontaktformular (Formspree)
// =====================
function sendMail(event) {
  event.preventDefault();
  const data = new FormData(event.target);

  fetch("https://formspree.io/f/mdknjddr", {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  })
    .then(() => {
      window.location.href = "./send_mail.html";
    })
    .catch((error) => {
      console.error("Fehler beim Senden:", error);
      alert("Fehler beim Senden. Bitte versuch es später nochmal.");
    });
}

// =====================
// Gutscheinformular (Winteraktion) - EINMAL
// =====================
function openWinterOfferForm() {
  const popup = document.getElementById("winter-offer-popup");
  if (!popup) return;
  popup.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeWinterOfferForm() {
  const popup = document.getElementById("winter-offer-popup");
  if (!popup) return;
  popup.style.display = "none";
  document.body.style.overflow = "";
}

function sendVoucherMail(event) {
  event.preventDefault();
  const data = new FormData(event.target);

  fetch("https://formspree.io/f/mdknjddr", {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  })
    .then(() => {
      alert("Danke! Wir melden uns mit Zahlungsinfos & Gutschein per E-Mail 🎄");
      closeWinterOfferForm();
      event.target.reset();
    })
    .catch((error) => {
      console.error("Fehler beim Gutscheinversand:", error);
      alert("Fehler beim Senden. Bitte versuch es später nochmal.");
    });
}

// =====================
// Galerie
// =====================
const images = Array.from({ length: 52 }, (_, i) => `galerie/${i + 1}.jpg`);
let imageIndex = 0;

function load() {
  const container = document.getElementById("images");
  if (!container) return;

  let html = "";
  images.forEach((src, i) => {
    html += `
      <div class="imgbox">
        <img src="${src}"
             alt="CarClean Galerie – Autoaufbereitung Kufstein Bild ${i + 1}"
             loading="lazy"
             onclick="openImage(${i})">
      </div>`;
  });

  container.innerHTML = html;
}

function openImage(i) {
  const openImgContainer = document.getElementById("openimg");
  if (!openImgContainer) return;

  openImgContainer.innerHTML = `
    <div class="openimg">
      <div class="btn-container">
        <img onclick="backImage()" class="nextimage" src="./img/next-button.png" alt="Zurück">
        <img onclick="closeImg()" class="nextimage" src="./img/close.png" alt="Schließen">
        <img onclick="nextImage()" class="nextimage" src="./img/back-button.png" alt="Weiter">
      </div>
      <div><img class="imagesolo" src="${images[i]}" alt="CarClean Galerie – Bild ${i + 1}"></div>
    </div>`;

  openImgContainer.classList.remove("d-none");
  imageIndex = i;
}

function closeImg() {
  const openImgContainer = document.getElementById("openimg");
  if (!openImgContainer) return;
  openImgContainer.classList.add("d-none");
}

function backImage() {
  imageIndex = (imageIndex - 1 + images.length) % images.length;
  openImage(imageIndex);
}

function nextImage() {
  imageIndex = (imageIndex + 1) % images.length;
  openImage(imageIndex);
}

// =====================
// Vorher / Nachher Galerie
// =====================
const imagesvor = Array.from({ length: 21 }, (_, i) => `vornachfotos/${i + 1}.jpg`);
let imageIndexvor = 0;

function loadvor() {
  const container = document.getElementById("images");
  if (!container) return;

  let html = "";
  imagesvor.forEach((src, i) => {
    html += `
      <div class="imgbox">
        <img src="${src}"
             alt="Vorher–Nachher Autoaufbereitung Kufstein – CarClean Bild ${i + 1}"
             loading="lazy"
             onclick="openImagevor(${i})">
      </div>`;
  });

  container.innerHTML = html;
}

function openImagevor(i) {
  const openImgContainer = document.getElementById("openimg");
  if (!openImgContainer) return;

  openImgContainer.innerHTML = `
    <div class="openimg">
      <div class="btn-container">
        <img onclick="backImagevor()" class="nextimage" src="./img/next-button.png" alt="Zurück">
        <img onclick="closeImgvor()" class="nextimage" src="./img/close.png" alt="Schließen">
        <img onclick="nextImagevor()" class="nextimage" src="./img/back-button.png" alt="Weiter">
      </div>
      <div><img class="imagesolo" src="${imagesvor[i]}" alt="Vorher–Nachher CarClean – Bild ${i + 1}"></div>
    </div>`;

  openImgContainer.classList.remove("d-none");
  imageIndexvor = i;
}

function closeImgvor() {
  const openImgContainer = document.getElementById("openimg");
  if (!openImgContainer) return;
  openImgContainer.classList.add("d-none");
}

function backImagevor() {
  imageIndexvor = (imageIndexvor - 1 + imagesvor.length) % imagesvor.length;
  openImagevor(imageIndexvor);
}

function nextImagevor() {
  imageIndexvor = (imageIndexvor + 1) % imagesvor.length;
  openImagevor(imageIndexvor);
}

// =====================
// Cookies (nur wenn vorhanden)
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const accept = document.getElementById("accept-cookies");
  const decline = document.getElementById("decline-cookies");

  if (!banner || !accept || !decline) return;

  if (document.cookie.includes("cookies_accepted=true")) {
    banner.style.display = "none";
    return;
  }

  banner.style.display = "block";

  accept.onclick = () => {
    document.cookie =
      "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    banner.style.display = "none";
  };

  decline.onclick = () => {
    banner.style.display = "none";
  };
});

// =====================
// Scroll-Animation Winteraktion (nur wenn vorhanden)
// =====================
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

function handleScrollAnimation() {
  const section = document.querySelector("#winter-offer");
  if (!section || section.classList.contains("animated")) return;

  if (isElementInViewport(section)) {
    section.classList.add("animated");
    section.querySelector(".animate-text")?.style.setProperty("animation-play-state", "running");
    section.querySelector(".animate-button")?.style.setProperty("animation-play-state", "running");
  }
}

window.addEventListener("scroll", handleScrollAnimation);
document.addEventListener("DOMContentLoaded", handleScrollAnimation);
