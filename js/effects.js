// Decorative effects: tap hearts (+ 'ecard:burst' event from scratch.js), gold shimmer
(function () {
  'use strict';

  var MAX_HEARTS = 40;
  var HEARTS_PER_TAP = 4;
  var HEART_COLORS = ['#A0505E', '#7B1E2B', '#C79AA0', '#B99A5B', '#E3CFAA'];
  // Taps on these elements should do their own job, not spawn hearts
  var NO_HEART_SELECTOR = 'a, button, canvas, input, .lightbox, .dock, .intro';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var liveHearts = 0;

  function rand(min, max) { return min + Math.random() * (max - min); }

  /* ----- Hearts ----- */
  function spawnHeart(x, y, spread) {
    if (liveHearts >= MAX_HEARTS) return;
    var el = document.createElement('span');
    el.className = 'heart';
    el.textContent = '♥';
    el.setAttribute('aria-hidden', 'true');
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--size', rand(12, 22).toFixed(0) + 'px');
    el.style.setProperty('--color', HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]);
    el.style.setProperty('--dx', rand(-spread, spread).toFixed(0) + 'px');
    el.style.setProperty('--dy', rand(60, 140).toFixed(0) + 'px');
    el.style.setProperty('--rot', rand(-25, 25).toFixed(0) + 'deg');
    el.style.setProperty('--dur', rand(0.9, 1.5).toFixed(2) + 's');
    liveHearts += 1;
    el.addEventListener('animationend', function () {
      el.remove();
      liveHearts -= 1;
    });
    document.body.appendChild(el);
  }

  function burst(x, y, count, spread) {
    if (reduceMotion) return;
    for (var i = 0; i < count; i++) spawnHeart(x, y, spread);
  }

  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest(NO_HEART_SELECTOR)) return;
    burst(e.clientX, e.clientY, HEARTS_PER_TAP, 40);
  });
  document.addEventListener('ecard:burst', function (e) {
    burst(e.detail.x, e.detail.y, e.detail.count || 12, 110);
  });

  /* ----- Gold shimmer: mask the shine to the logo strokes ----- */
  Array.prototype.forEach.call(document.querySelectorAll('.shimmer'), function (wrap) {
    var img = wrap.querySelector('img');
    // img.src is absolute, so the url() resolves the same from any stylesheet folder
    if (img) wrap.style.setProperty('--mask', 'url("' + img.src + '")');
  });
})();
