(function () {
  'use strict';

  var SPARKLE_COUNT = 22;
  var PETAL_COUNT = 16;
  var OPEN_DURATION_MS = 1400;
  var PETAL_COLORS_GOLD_RATIO = 0.35;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(min, max) { return min + Math.random() * (max - min); }

  function spawn(container, count, build) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) frag.appendChild(build(i));
    container.appendChild(frag);
  }

  function makeSparkle() {
    var el = document.createElement('span');
    el.className = 'sparkle';
    el.style.left = rand(4, 96) + '%';
    el.style.top = rand(6, 94) + '%';
    el.style.setProperty('--dur', rand(3, 6).toFixed(2) + 's');
    el.style.setProperty('--delay', rand(0, 5).toFixed(2) + 's');
    return el;
  }

  function makePetal() {
    var el = document.createElement('span');
    el.className = Math.random() < PETAL_COLORS_GOLD_RATIO ? 'petal petal--gold' : 'petal';
    el.style.left = rand(0, 100) + '%';
    el.style.setProperty('--size', rand(8, 15).toFixed(1) + 'px');
    el.style.setProperty('--dur', rand(10, 18).toFixed(2) + 's');
    el.style.setProperty('--delay', rand(0, 12).toFixed(2) + 's');
    el.style.setProperty('--drift', rand(-80, 120).toFixed(0) + 'px');
    el.style.setProperty('--spin', rand(240, 720).toFixed(0) + 'deg');
    return el;
  }

  function startPetals() {
    var layer = document.getElementById('petals');
    if (!layer || reduceMotion) return;
    spawn(layer, PETAL_COUNT, makePetal);
  }

  function enterCard() {
    var card = document.querySelector('.card');
    if (card) card.classList.add('is-entered');
    startPetals();
  }

  function initIntro() {
    var intro = document.getElementById('intro');
    var openBtn = document.getElementById('intro-open');
    if (!intro || !openBtn) {
      enterCard();
      return;
    }

    document.body.classList.add('is-locked');
    if (!reduceMotion) spawn(intro, SPARKLE_COUNT, makeSparkle);

    openBtn.addEventListener('click', function () {
      openBtn.disabled = true;
      intro.classList.add('is-opening');
      window.scrollTo(0, 0);
      enterCard();
      setTimeout(function () {
        intro.remove();
        document.body.classList.remove('is-locked');
      }, reduceMotion ? 0 : OPEN_DURATION_MS);
    }, { once: true });
  }

  initIntro();
})();
