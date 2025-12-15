// =====================
// Menü
// =====================
function showMenu() {
  document.getElementById("menuoverlay").style.width = "100%";
}

function closeMenu() {
  document.getElementById("menuoverlay").style.width = "0";
}

// =====================
// Slider
// =====================
let currentImageIndex = 0;
const imagess = document.getElementsByClassName("slider_image");

function startSlider() {
  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % imagess.length;
    updateSlider();
  }, 3000);
}

function updateSlider() {
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
    });
}

// =====================
// Gutscheinformular (Winteraktion)
// =====================
function openWinterOfferForm() {
  document.getElementById("winter-offer-popup").style.display = "flex";
}

function closeWinterOfferForm() {
  document.getElementById("winter-offer-popup").style.display = "none";
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

  images.forEach((src, i) => {
    container.innerHTML += `
      <div class="imgbox">
        <img src="${src}" onclick="openImage(${i})">
      </div>`;
  });
}

function openImage(i) {
  const openImgContainer = document.getElementById("openimg");
  openImgContainer.innerHTML = `
    <div class="openimg">
      <div class="btn-container">
        <img onclick="backImage()" class="nextimage" src="./img/next-button.png">
        <img onclick="closeImg()" class="nextimage" src="./img/close.png">
        <img onclick="nextImage()" class="nextimage" src="./img/back-button.png">
      </div>
      <div><img class="imagesolo" src="${images[i]}"></div>
    </div>`;
  openImgContainer.classList.remove("d-none");
  imageIndex = i;
}

function closeImg() {
  document.getElementById("openimg").classList.add("d-none");
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

  imagesvor.forEach((src, i) => {
    container.innerHTML += `
      <div class="imgbox">
        <img src="${src}" onclick="openImagevor(${i})">
      </div>`;
  });
}

function openImagevor(i) {
  const openImgContainer = document.getElementById("openimg");
  openImgContainer.innerHTML = `
    <div class="openimg">
      <div class="btn-container">
        <img onclick="backImagevor()" class="nextimage" src="./img/next-button.png">
        <img onclick="closeImgvor()" class="nextimage" src="./img/close.png">
        <img onclick="nextImagevor()" class="nextimage" src="./img/back-button.png">
      </div>
      <div><img class="imagesolo" src="${imagesvor[i]}"></div>
    </div>`;
  openImgContainer.classList.remove("d-none");
  imageIndexvor = i;
}

function closeImgvor() {
  document.getElementById("openimg").classList.add("d-none");
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
// Cookies
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const accept = document.getElementById("accept-cookies");
  const decline = document.getElementById("decline-cookies");

  if (document.cookie.includes("cookies_accepted=true")) {
    banner.style.display = "none";
    return;
  }

  banner.style.display = "block";

  accept.onclick = () => {
    document.cookie = "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    banner.style.display = "none";
  };

  decline.onclick = () => {
    banner.style.display = "none";
  };
});

// =====================
// Scroll-Animation Winteraktion
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
