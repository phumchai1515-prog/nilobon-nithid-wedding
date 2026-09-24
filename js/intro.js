// Opening screen: photo slideshow, letter-by-letter names, sparkles; starts petals after opening
(function () {
  'use strict';

  var SPARKLE_COUNT = 18;
  var PETAL_COUNT = 16;
  var PETAL_GOLD_RATIO = 0.35;
  var OPEN_DURATION_MS = 1300;
  var SLIDE_INTERVAL_MS = 4200;
  var NAMES_START_DELAY_S = 2.4;
  var NAMES_CHAR_STEP_S = 0.06;

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
    el.className = Math.random() < PETAL_GOLD_RATIO ? 'petal petal--gold' : 'petal';
    el.style.left = rand(0, 100) + '%';
    el.style.setProperty('--size', rand(8, 15).toFixed(1) + 'px');
    el.style.setProperty('--dur', rand(10, 18).toFixed(2) + 's');
    el.style.setProperty('--delay', rand(0, 12).toFixed(2) + 's');
    el.style.setProperty('--drift', rand(-80, 120).toFixed(0) + 'px');
    el.style.setProperty('--spin', rand(240, 720).toFixed(0) + 'deg');
    return el;
  }

  // Wrap each character of the names in a span so they fade in one by one
  function splitNames(el) {
    if (!el || reduceMotion) return;
    var index = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      var isEm = node.nodeType === 1;
      var text = node.textContent;
      var frag = document.createDocumentFragment();
      text.split('').forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'ch';
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.animationDelay = (NAMES_START_DELAY_S + index * NAMES_CHAR_STEP_S).toFixed(2) + 's';
        index += 1;
        frag.appendChild(span);
      });
      if (isEm) {
        node.textContent = '';
        node.appendChild(frag);
      } else {
        el.replaceChild(frag, node);
      }
    });
  }

  function startSlideshow(container) {
    if (!container) return null;
    var slides = Array.prototype.slice.call(container.querySelectorAll('img'));
    if (!slides.length) return null;
    var current = 0;
    slides[0].classList.add('is-active');
    if (reduceMotion || slides.length < 2) return null;
    return setInterval(function () {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, SLIDE_INTERVAL_MS);
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
    splitNames(intro.querySelector('.intro__names'));
    var slideTimer = startSlideshow(intro.querySelector('.intro__slides'));
    if (!reduceMotion) spawn(intro, SPARKLE_COUNT, makeSparkle);

    openBtn.addEventListener('click', function () {
      openBtn.disabled = true;
      intro.classList.add('is-opening');
      window.scrollTo(0, 0);
      enterCard();
      setTimeout(function () {
        if (slideTimer) clearInterval(slideTimer);
        intro.remove();
        document.body.classList.remove('is-locked');
      }, reduceMotion ? 0 : OPEN_DURATION_MS);
    }, { once: true });
  }

  initIntro();
})();
