/* =====================================================================
   skills.js  —  animated "percentage learnt" for the Technical Skills.
   On every entry into the viewport (scrolling down OR back up), each
   skill card counts its number up from 0 to its target and fills its
   bar from 0; on leaving, both reset so the next entry replays.
   Self-contained: does not touch the site's other observers/animations.
   ===================================================================== */
(function () {
  function init() {
    var cards = document.querySelectorAll('.skill-card');
    if (!cards.length) return;

    var reduce = window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };

    function setState(card, target) {
      var fill  = card.querySelector('.skill-fill');
      var label = card.querySelector('.skill-pct');
      if (fill)  fill.style.width = target + '%';
      if (label) label.textContent = target + '%';
    }

    function runUp(card) {
      var pct   = parseInt(card.getAttribute('data-pct'), 10) || 0;
      var fill  = card.querySelector('.skill-fill');
      var label = card.querySelector('.skill-pct');
      if (fill) fill.style.width = pct + '%';        // CSS transition draws the bar

      if (reduce) { if (label) label.textContent = pct + '%'; return; }

      if (card._raf) cancelAnimationFrame(card._raf);
      var duration = 1100, start = null;
      function tick(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / duration, 1);
        if (label) label.textContent = Math.round(easeOutCubic(p) * pct) + '%';
        if (p < 1) card._raf = requestAnimationFrame(tick);
      }
      card._raf = requestAnimationFrame(tick);
    }

    function reset(card) {
      if (card._raf) cancelAnimationFrame(card._raf);
      setState(card, 0);
    }

    // start every card at zero so the first entry animates cleanly
    for (var i = 0; i < cards.length; i++) reset(cards[i]);

    if (!('IntersectionObserver' in window)) {           // graceful fallback
      for (var j = 0; j < cards.length; j++) runUp(cards[j]);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) runUp(entry.target);
        else reset(entry.target);
      });
    }, { threshold: 0.28 });

    cards.forEach(function (card) { io.observe(card); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
