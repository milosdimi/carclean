function showMenu() {
  document.getElementById("menuoverlay").style.width = "100%";
}

function closeMenu() {
  document.getElementById("menuoverlay").style.width = "0";
}

function startSlider() {
  setTimeout(function () {
    document.getElementById("img-1").style = "transform: translateX(-100%)";
    document.getElementById("img-2").style = "transform: translateX(0)";
    document.getElementById("img-3").style = "transform: translateX(100%)";
  }, 3000);
  setTimeout(function () {
    document.getElementById("img-1").style = "transform: translateX(-200%)";
    document.getElementById("img-2").style = "transform: translateX(-100%)";
    document.getElementById("img-3").style = "transform: translateX(0)";
  }, 6000);
  setTimeout(function () {
    document.getElementById("img-1").style = "transform: translateX(0)";
    document.getElementById("img-2").style = "transform: translateX(100%)";
    document.getElementById("img-3").style = "transform: translateX(200%)";

    startSlider();
  }, 9000);
}
function showImage(index) {
  var images = document.getElementsByClassName("slider_image");
  for (var i = 0; i < images.length; i++) {
    images[i].style.transform = "translateX(" + (i - index + 1) * 100 + "%)";
  }
}

// Contakt
function sendMail(event) {
  event.preventDefault();
  const data = new FormData(event.target);

  fetch("https://formspree.io/f/moqgerva", {
    method: "POST",
    body: new FormData(event.target),
    headers: {
      Accept: "application/json",
    },
  })
    .then(() => {
      window.location.href = "./send_mail.html";
    })
    .catch((error) => {
      console.log(error);
    });
}
// Galerie
let images = Array.from({ length: 52 }, (_, i) => `galerie/${i + 1}.jpg`);
let imageIndex = 0;

function load() {
  let imagesContainer = document.getElementById("images");
  if (!imagesContainer) return;
  for (let i = 0; i < images.length; i++) {
    imagesContainer.innerHTML += /*html*/ `
        <div class="imgbox"><img src="${images[i]}" onclick="openImage(${i})"></div>    
        `;
  }
}

function openImage(i) {
  document.getElementById("openimg").innerHTML = /*html*/ `
        <div class="openimg">
            <div class="btn-container">
                <img onclick="backImage()" class="nextimage" src="./img/next-button.png" alt="">
                <img onclick="closeImg()" class="nextimage" src="./img/close.png" alt="close-img">
                <img onclick="nextImage()" class="nextimage" src="./img/back-button.png" alt="">
            </div>
            <div><img class="imagesolo" src="${images[i]}" alt=""></div>
        </div>  
    `;
  document.getElementById("openimg").classList.remove("d-none");
  imageIndex = i;
}

function closeImg() {
  document.getElementById("openimg").classList.add("d-none");
}

function backImage() {
  imageIndex--;
  if (imageIndex < 0) {
    imageIndex = images.length - 1;
  }
  openImage(imageIndex);
}

function nextImage() {
  imageIndex++;
  if (imageIndex >= images.length) {
    imageIndex = 0;
  }
  openImage(imageIndex);
}
// Vor Nach Galerie
let imagesvor = Array.from(
  { length: 21 },
  (_, i) => `vornachfotos/${i + 1}.jpg`
);
let imageIndexvor = 0;

function loadvor() {
  let imagesContainer = document.getElementById("images");
  if (!imagesContainer) return;
  for (let i = 0; i < imagesvor.length; i++) {
    imagesContainer.innerHTML += /*html*/ `
        <div class="imgbox"><img src="${imagesvor[i]}" onclick="openImagevor(${i})"></div>    
        `;
  }
}

function openImagevor(i) {
  document.getElementById("openimg").innerHTML = /*html*/ `
        <div class="openimg">
            <div class="btn-container">
                <img onclick="backImagevor()" class="nextimage" src="./img/next-button.png" alt="">
                <img onclick="closeImgvor()" class="nextimage" src="./img/close.png" alt="close-img">
                <img onclick="nextImagevor()" class="nextimage" src="./img/back-button.png" alt="">
            </div>
            <div><img class="imagesolo" src="${imagesvor[i]}" alt=""></div>
        </div>  
    `;
  document.getElementById("openimg").classList.remove("d-none");
  imageIndexvor = i;
}

function closeImgvor() {
  document.getElementById("openimg").classList.add("d-none");
}

function backImagevor() {
  imageIndexvor--;
  if (imageIndexvor < 0) {
    imageIndexvor = imagesvor.length - 1;
  }
  openImagevor(imageIndexvor);
}

function nextImagevor() {
  imageIndexvor++;
  if (imageIndexvor >= imagesvor.length) {
    imageIndexvor = 0;
  }
  openImagevor(imageIndexvor);
}
//cookies
// JavaScript-Code hier einfügen
document.addEventListener("DOMContentLoaded", function () {
  var cookieBanner = document.getElementById("cookie-banner");
  var acceptCookiesBtn = document.getElementById("accept-cookies");

  acceptCookiesBtn.addEventListener("click", function () {
    // Set a cookie to indicate that the user has accepted cookies
    document.cookie =
      "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    // Hide the cookie banner
    cookieBanner.style.display = "none";
  });

  // Check if the user has already accepted cookies
  var cookiesAccepted = document.cookie.split(";").some(function (cookie) {
    return cookie.trim().startsWith("cookies_accepted=");
  });

  // If cookies are already accepted, hide the cookie banner
  if (cookiesAccepted) {
    cookieBanner.style.display = "none";
  } else {
    cookieBanner.style.display = "block";
  }
});
