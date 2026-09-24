(function () {
  'use strict';

  var SWIPE_THRESHOLD_PX = 45;
  var SWITCH_FADE_MS = 200;

  var track = document.getElementById('gallery');
  var dotsBox = document.getElementById('gallery-dots');
  var box = document.getElementById('lightbox');
  if (!track || !dotsBox || !box) return;

  var items = Array.prototype.slice.call(track.querySelectorAll('.gallery__item'));
  var images = items.map(function (item) { return item.querySelector('img'); });
  var boxImg = box.querySelector('img');
  var counter = box.querySelector('.lightbox__count');
  var current = 0;

  /* ----- Dots synced with the scroll carousel ----- */
  var dots = items.map(function (item, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery__dot';
    dot.setAttribute('aria-label', 'ภาพที่ ' + (i + 1));
    dot.addEventListener('click', function () {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    dotsBox.appendChild(dot);
    return dot;
  });

  function setActiveDot(index) {
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === index); });
  }

  function nearestIndex() {
    var center = track.scrollLeft + track.clientWidth / 2;
    var best = 0;
    var bestDist = Infinity;
    items.forEach(function (item, i) {
      var dist = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  var scrollFrame = null;
  track.addEventListener('scroll', function () {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(function () {
      scrollFrame = null;
      setActiveDot(nearestIndex());
    });
  }, { passive: true });
  setActiveDot(0);

  /* ----- Lightbox with prev / next / swipe ----- */
  function show(index) {
    current = (index + images.length) % images.length;
    boxImg.classList.add('is-switching');
    setTimeout(function () {
      boxImg.src = images[current].src;
      boxImg.alt = images[current].alt;
      boxImg.classList.remove('is-switching');
    }, box.classList.contains('is-open') ? SWITCH_FADE_MS : 0);
    counter.textContent = (current + 1) + ' / ' + images.length;
  }

  function open(index) {
    show(index);
    box.classList.add('is-open');
    document.body.classList.add('is-locked');
  }

  function close() {
    box.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    boxImg.removeAttribute('src');
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });

  box.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-nav]');
    if (nav) { show(current + Number(nav.dataset.nav)); return; }
    if (e.target === boxImg) return;
    close();
  });

  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  var touchStartX = null;
  box.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    show(current + (dx < 0 ? 1 : -1));
  });
})();
