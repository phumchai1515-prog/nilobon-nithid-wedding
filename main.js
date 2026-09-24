(function () {
  'use strict';

  // 07 Nov 2026, 08:29 Bangkok time (UTC+7)
  var WEDDING_START = new Date('2026-11-07T08:29:00+07:00');
  var MS_PER_DAY = 86400000;

  function countdownText(now) {
    var days = Math.ceil((WEDDING_START - now) / MS_PER_DAY);
    if (days > 1) return 'อีก ' + days + ' วัน · ' + days + ' days to go';
    if (days === 1) return 'พรุ่งนี้แล้ว · Tomorrow';
    if (days === 0) return 'วันนี้ · Today is the day';
    return 'ขอบคุณที่ร่วมเป็นเกียรติ · Thank you';
  }

  function initCountdown() {
    var pill = document.getElementById('countdown');
    if (!pill) return;
    pill.textContent = countdownText(Date.now());
    pill.hidden = false;
  }

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

  function initLightbox() {
    var box = document.getElementById('lightbox');
    var gallery = document.getElementById('gallery');
    if (!box || !gallery) return;
    var boxImg = box.querySelector('img');

    function close() {
      box.classList.remove('is-open');
      boxImg.removeAttribute('src');
    }

    gallery.addEventListener('click', function (e) {
      var img = e.target.closest('.gallery__item') && e.target.closest('.gallery__item').querySelector('img');
      if (!img) return;
      boxImg.src = img.src;
      boxImg.alt = img.alt;
      box.classList.add('is-open');
    });
    box.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  initCountdown();
  initReveal();
  initLightbox();
})();
