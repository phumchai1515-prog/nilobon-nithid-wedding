(function () {
  'use strict';

  var BRUSH_RADIUS = 16;
  var REVEAL_THRESHOLD = 0.5;
  var SAMPLE_STEP = 6; // check every Nth pixel when measuring cleared area
  var CHECK_EVERY_MOVES = 8;

  var row = document.getElementById('scratch-row');
  var skipBtn = document.getElementById('scratch-skip');
  if (!row) return;

  var cards = Array.prototype.slice.call(row.querySelectorAll('.scratch'));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function paintCover(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.scale(dpr, dpr);

    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#B99A5B');
    grad.addColorStop(0.45, '#EAD9B6');
    grad.addColorStop(0.55, '#D8BE8A');
    grad.addColorStop(1, '#A8864A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // fine glitter
    for (var i = 0; i < 70; i++) {
      ctx.fillStyle = 'rgba(255,250,235,' + (0.25 + Math.random() * 0.5).toFixed(2) + ')';
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
    }
    ctx.fillStyle = 'rgba(74,14,30,.75)';
    ctx.font = '300 12px Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ขูดตรงนี้', w / 2, h / 2 + 4);
    ctx.globalCompositeOperation = 'destination-out';
    return ctx;
  }

  function clearedRatio(ctx, canvas) {
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var total = 0;
    var clear = 0;
    for (var i = 3; i < data.length; i += 4 * SAMPLE_STEP) {
      total += 1;
      if (data[i] === 0) clear += 1;
    }
    return total ? clear / total : 1;
  }

  function allRevealed() {
    return cards.every(function (c) { return c.classList.contains('is-revealed'); });
  }

  function celebrate() {
    if (skipBtn) skipBtn.hidden = true;
    var rect = row.getBoundingClientRect();
    document.dispatchEvent(new CustomEvent('ecard:burst', {
      detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, count: 18 }
    }));
  }

  function reveal(card) {
    if (card.classList.contains('is-revealed')) return;
    card.classList.add('is-revealed');
    if (allRevealed()) celebrate();
  }

  function setupCard(card) {
    var canvas = card.querySelector('canvas');
    var ctx = canvas && paintCover(canvas);
    if (!ctx) { reveal(card); return; }

    var drawing = false;
    var moves = 0;
    var last = null;

    function point(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function scratchTo(p) {
      ctx.beginPath();
      if (last) {
        ctx.lineWidth = BRUSH_RADIUS * 2;
        ctx.lineCap = 'round';
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      } else {
        ctx.arc(p.x, p.y, BRUSH_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
      last = p;
      moves += 1;
      if (moves % CHECK_EVERY_MOVES === 0 && clearedRatio(ctx, canvas) >= REVEAL_THRESHOLD) reveal(card);
    }

    canvas.addEventListener('pointerdown', function (e) {
      drawing = true;
      last = null;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
      scratchTo(point(e));
    });
    canvas.addEventListener('pointermove', function (e) {
      if (drawing) scratchTo(point(e));
    });
    function stop() {
      if (!drawing) return;
      drawing = false;
      last = null;
      if (clearedRatio(ctx, canvas) >= REVEAL_THRESHOLD) reveal(card);
    }
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
  }

  function init() {
    if (reduceMotion) { cards.forEach(reveal); return; }
    cards.forEach(setupCard);
    if (skipBtn) skipBtn.addEventListener('click', function () { cards.forEach(reveal); });
  }

  // Wait for fonts so the "ขูดตรงนี้" label renders in Prompt
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init, init);
  } else {
    init();
  }
})();
