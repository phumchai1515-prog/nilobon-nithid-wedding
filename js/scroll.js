// Scroll-driven effects: fade-up reveals, photo-break parallax, progress bar
(function () {
  'use strict';

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  }

  // Gentle parallax on full-width photo breaks
  var PARALLAX_STRENGTH = 0.12;
  var PARALLAX_OVERHANG = 0.1;

  function initParallax() {
    var breaks = Array.prototype.slice.call(document.querySelectorAll('.photo-break'));
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!breaks.length || reduceMotion) return;
    var ticking = false;

    function update() {
      ticking = false;
      var viewH = window.innerHeight;
      breaks.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewH) return;
        // image overhangs the frame by 12% top and bottom — never shift past that
        var limit = rect.height * PARALLAX_OVERHANG;
        var raw = (rect.top + rect.height / 2 - viewH / 2) * -PARALLAX_STRENGTH;
        var offset = Math.max(-limit, Math.min(limit, raw));
        el.querySelector('img').style.setProperty('--parallax', offset.toFixed(1) + 'px');
      });
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  // Thin gold bar at the top showing how far down the card you are
  function initProgress() {
    var bar = document.getElementById('progress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      });
    }, { passive: true });
  }

  initReveal();
  initParallax();
  initProgress();
})();
