// Menüsteuerung
function showMenu() {
  document.getElementById("menuoverlay").style.width = "100%";
}

function closeMenu() {
  document.getElementById("menuoverlay").style.width = "0";
}

// Slider
let currentImageIndex = 0; // Der Index des aktuellen Bildes
const imagess = document.getElementsByClassName("slider_image");

function startSlider() {
  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % imagess.length; // Zyklisch durch die Bilder blättern
    updateSlider();
  }, 3000); // Alle 3 Sekunden wechseln
}

function updateSlider() {
  Array.from(imagess).forEach((image, index) => {
    image.style.transform = `translateX(${(index - currentImageIndex) * 100}%)`; // Verschiebt die Bilder entsprechend
  });
}

function showImage(index) {
  currentImageIndex = index - 1; // Umwandeln in 0-basierten Index
  updateSlider();
}

// Kontaktformular
function sendMail(event) {
  event.preventDefault();
  const data = new FormData(event.target);

  fetch("https://formspree.io/f/mdknjddr", {
    method: "POST",
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then(() => {
      window.location.href = "./send_mail.html";
    })
    .catch((error) => {
      console.error("Fehler beim Senden der E-Mail:", error);
    });
}

// Galerie
const images = Array.from({ length: 52 }, (_, i) => `galerie/${i + 1}.jpg`);
let imageIndex = 0;

function load() {
  const imagesContainer = document.getElementById("images");
  if (!imagesContainer) return;

  images.forEach((src, i) => {
    imagesContainer.innerHTML += /*html*/ `
      <div class="imgbox"><img src="${src}" onclick="openImage(${i})"></div>
    `;
  });
}

function openImage(i) {
  const openImgContainer = document.getElementById("openimg");
  openImgContainer.innerHTML = /*html*/ `
    <div class="openimg">
      <div class="btn-container">
        <img onclick="backImage()" class="nextimage" src="./img/next-button.png" alt="">
        <img onclick="closeImg()" class="nextimage" src="./img/close.png" alt="close-img">
        <img onclick="nextImage()" class="nextimage" src="./img/back-button.png" alt="">
      </div>
      <div><img class="imagesolo" src="${images[i]}" alt=""></div>
    </div>
  `;
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

// Vor Nach Galerie
const imagesvor = Array.from(
  { length: 21 },
  (_, i) => `vornachfotos/${i + 1}.jpg`
);
let imageIndexvor = 0;

function loadvor() {
  const imagesContainer = document.getElementById("images");
  if (!imagesContainer) return;

  imagesvor.forEach((src, i) => {
    imagesContainer.innerHTML += /*html*/ `
      <div class="imgbox"><img src="${src}" onclick="openImagevor(${i})"></div>
    `;
  });
}

function openImagevor(i) {
  const openImgContainer = document.getElementById("openimg");
  openImgContainer.innerHTML = /*html*/ `
    <div class="openimg">
      <div class="btn-container">
        <img onclick="backImagevor()" class="nextimage" src="./img/next-button.png" alt="">
        <img onclick="closeImgvor()" class="nextimage" src="./img/close.png" alt="close-img">
        <img onclick="nextImagevor()" class="nextimage" src="./img/back-button.png" alt="">
      </div>
      <div><img class="imagesolo" src="${imagesvor[i]}" alt=""></div>
    </div>
  `;
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

// Cookies
document.addEventListener("DOMContentLoaded", function () {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptCookiesBtn = document.getElementById("accept-cookies");
  const declineCookiesBtn = document.getElementById("decline-cookies");

  // Funktion für "Akzeptieren"
  acceptCookiesBtn.addEventListener("click", function () {
    document.cookie =
      "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    cookieBanner.style.display = "none";
  });

  // Funktion für "Ablehnen"
  declineCookiesBtn.addEventListener("click", function () {
    cookieBanner.style.display = "none";
  });

  // Überprüfen, ob der Benutzer bereits Cookies akzeptiert hat
  const cookiesAccepted = document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("cookies_accepted="));

  if (cookiesAccepted) {
    cookieBanner.style.display = "none";
  } else {
    cookieBanner.style.display = "block";
  }
});
// Popup-Formular für Frühlingsangebot
function openSpringOfferForm() {
  document.getElementById('spring-offer-popup').style.display = 'flex';
}

function closeSpringOfferForm() {
  document.getElementById('spring-offer-popup').style.display = 'none';
}
// Funktion, um zu prüfen, ob ein Element im Sichtbereich ist
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

// Animation beim Scrollen auslösen
function handleScrollAnimation() {
  const springOfferSection = document.querySelector('#spring-offer');
  const animatedText = document.querySelector('.animate-text');
  const animatedButton = document.querySelector('.animate-button');

  // Prüfen, ob die Sektion bereits animiert wurde
  if (springOfferSection.classList.contains('animated')) {
    return; // Wenn bereits animiert, abbrechen
  }

  if (isElementInViewport(springOfferSection)) {
    animatedText.style.animationPlayState = 'running';
    animatedButton.style.animationPlayState = 'running';
    animatedButton.style.opacity = '1'; // Sicherstellen, dass der Button sichtbar ist
    springOfferSection.classList.add('animated'); // Markieren, dass die Animation ausgeführt wurde
  }
}

// Event-Listener für Scrollen
window.addEventListener('scroll', handleScrollAnimation);

// Animation beim Laden der Seite auslösen, falls die Sektion bereits sichtbar ist
document.addEventListener('DOMContentLoaded', handleScrollAnimation);
