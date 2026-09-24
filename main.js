(function () {
  'use strict';

  // 07 Nov 2026, 08:29 Bangkok time (UTC+7)
  var WEDDING_START = new Date('2026-11-07T08:29:00+07:00');
  // Reception ends around 22:00 — after that we switch to a thank-you message
  var WEDDING_END = new Date('2026-11-07T22:00:00+07:00');
  var MS_PER_SECOND = 1000;
  var MS_PER_MINUTE = 60 * MS_PER_SECOND;
  var MS_PER_HOUR = 60 * MS_PER_MINUTE;
  var MS_PER_DAY = 24 * MS_PER_HOUR;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function remainingParts(ms) {
    return {
      days: String(Math.floor(ms / MS_PER_DAY)),
      hours: pad(Math.floor((ms % MS_PER_DAY) / MS_PER_HOUR)),
      minutes: pad(Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE)),
      seconds: pad(Math.floor((ms % MS_PER_MINUTE) / MS_PER_SECOND))
    };
  }

  function statusMessage(now) {
    if (now >= WEDDING_END) return 'ขอบคุณที่ร่วมเป็นเกียรติ · Thank you';
    return 'วันนี้ · Today is the day';
  }

  function renderParts(nums, parts) {
    nums.forEach(function (el) {
      var next = parts[el.dataset.unit];
      if (el.textContent === next) return;
      el.textContent = next;
      el.classList.remove('is-tick');
      void el.offsetWidth; // restart the tick animation
      el.classList.add('is-tick');
    });
  }

  function initCountdown() {
    var box = document.getElementById('countdown');
    var message = document.getElementById('countdown-message');
    if (!box || !message) return;
    var nums = Array.prototype.slice.call(box.querySelectorAll('[data-unit]'));
    var timer = null;

    function update() {
      var now = Date.now();
      var remaining = WEDDING_START - now;
      if (remaining > 0) {
        box.hidden = false;
        message.hidden = true;
        renderParts(nums, remainingParts(remaining));
        return;
      }
      box.hidden = true;
      message.textContent = statusMessage(now);
      message.hidden = false;
      if (timer) clearInterval(timer);
    }

    update();
    timer = setInterval(update, MS_PER_SECOND);
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

  initCountdown();
  initReveal();
})();
