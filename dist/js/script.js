"use strict";

document.getElementById('burger').addEventListener('click', function () {
  document.getElementById('menu').classList.toggle('menu_active');
});
var windowHeight = window.innerHeight;
window.addEventListener('resize', function () {
  windowHeight = window.innerHeight;
});

function getUp() {
  var upBtn = document.getElementById('up');
  window.addEventListener('scroll', function () {
    if (windowHeight < window.scrollY) {
      upBtn.classList.add('up-active');
    } else {
      upBtn.classList.remove('up-active');
    }
  });
  upBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

getUp();