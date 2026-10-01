(function () {
  'use strict';

  /* ==========================================================
     1. MENU MOBILE
     ========================================================== */
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('main-nav');

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!nav.classList.contains('active'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) setMenu(false);
    });
  }

  /* ==========================================================
     2. SLIDER HERO (hanya berjalan bila ada slide di halaman)
     ========================================================== */
  var slider = document.querySelector('.slider-container');
  var slides = document.querySelectorAll('.slide');
  var dots = document.querySelectorAll('.dot');
  var prevBtn = document.querySelector('.slider-btn.prev');
  var nextBtn = document.querySelector('.slider-btn.next');

  if (slider && slides.length > 1) {
    var current = 0;
    var timer = null;
    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    };

    var stop = function () {
      if (timer) { clearInterval(timer); timer = null; }
    };

    var start = function () {
      stop();
      if (reduceMotion) return;
      timer = setInterval(function () { show(current + 1); }, 5000);
    };

    var go = function (index) { show(index); start(); };

    if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1); });
    if (prevBtn) prevBtn.addEventListener('click', function () { go(current - 1); });

    dots.forEach(function (dot, i) {
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Tampilkan slide ' + (i + 1));
      dot.addEventListener('click', function () { go(i); });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); }
      });
    });

    // Berhenti saat kursor di atas slider / fokus, lanjut saat lepas
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    // Hemat baterai: berhenti saat tab tidak aktif
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    // Geser (swipe) di layar sentuh
    var touchX = null;
    slider.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    show(0);
    start();
  }
})();
