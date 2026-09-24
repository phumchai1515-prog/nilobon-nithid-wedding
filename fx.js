(function () {
  'use strict';

  var MAX_HEARTS = 40;
  var HEARTS_PER_TAP = 4;
  var HEART_COLORS = ['#A0505E', '#7B1E2B', '#C79AA0', '#B99A5B', '#E3CFAA'];
  var TOAST_MS = 2200;
  var SHARE_TEXT = 'ขอเรียนเชิญร่วมเป็นเกียรติในงานมงคลสมรส นิโลบล & นิธิศ · 7 พฤศจิกายน 2569';
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

  /* ----- Toast ----- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-shown'); }, TOAST_MS);
  }

  /* ----- Share (without the guest's name in the link) ----- */
  function cleanUrl() {
    return window.location.origin + window.location.pathname;
  }

  function share() {
    var url = cleanUrl();
    if (navigator.share) {
      navigator.share({ title: document.title, text: SHARE_TEXT, url: url }).catch(function (err) {
        if (err && err.name !== 'AbortError') toast('แชร์ไม่สำเร็จ ลองใหม่อีกครั้ง');
      });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        toast('คัดลอกลิงก์แล้ว ✓');
      }, function () {
        window.open('https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(url), '_blank', 'noopener');
      });
      return;
    }
    window.open('https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(url), '_blank', 'noopener');
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-share]'), function (btn) {
    btn.addEventListener('click', share);
  });

  /* ----- Dock navigation ----- */
  var dock = document.getElementById('dock');
  var cover = document.querySelector('.cover');
  if (dock) {
    var buttons = Array.prototype.slice.call(dock.querySelectorAll('[data-target]'));
    var sections = buttons.map(function (b) { return document.getElementById(b.dataset.target); });

    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        if (sections[i]) sections[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });

    if ('IntersectionObserver' in window) {
      if (cover) {
        new IntersectionObserver(function (entries) {
          dock.classList.toggle('is-shown', !entries[0].isIntersecting);
        }, { threshold: 0.35 }).observe(cover);
      } else {
        dock.classList.add('is-shown');
      }

      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var idx = sections.indexOf(entry.target);
          buttons.forEach(function (b, j) { b.classList.toggle('is-active', j === idx); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { if (s) sectionObserver.observe(s); });
    } else {
      dock.classList.add('is-shown');
    }
  }

  /* ----- Scroll progress ----- */
  var bar = document.getElementById('progress');
  if (bar) {
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

  /* ----- Gold shimmer: mask the shine to the logo strokes ----- */
  Array.prototype.forEach.call(document.querySelectorAll('.shimmer'), function (wrap) {
    var img = wrap.querySelector('img');
    if (img) wrap.style.setProperty('--mask', 'url("' + img.getAttribute('src') + '")');
  });
})();
