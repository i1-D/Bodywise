(function () {
  'use strict';

  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.header__menu-btn');
  const headerNav = document.getElementById('header-nav');
  const headerOverlay = document.getElementById('header-overlay');
  const clubsSection = document.querySelector('.clubs');
  const clubsPin = document.querySelector('.clubs__pin');
  const clubImgs = document.querySelectorAll('.clubs__cell[data-club-img]');

  var CLUBS_SCROLL_LENGTH = 3;

  function setMenuOpen(open) {
    if (!header || !headerNav) return;
    header.classList.toggle('header--menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    headerNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (menuBtn) menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (headerOverlay) headerOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function initMenu() {
    if (!menuBtn || !headerNav) return;
    menuBtn.addEventListener('click', function () {
      setMenuOpen(!header.classList.contains('header--menu-open'));
    });
    headerNav.querySelectorAll('.header__nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header && header.classList.contains('header--menu-open')) {
        closeMenu();
      }
    });
    if (headerOverlay) {
      headerOverlay.addEventListener('click', closeMenu);
    }
  }

  initMenu();

  var imageData = [];

  function buildStackState(n) {
    var stack = [];
    var offsets = [0, 12, -10, 8, -14, 10, 6, -8, 14, -6, 4, -12, 10, -8, 6];
    for (var i = 0; i < n; i++) {
      stack.push({
        x: offsets[i % offsets.length] * (i % 2 === 0 ? 1 : -1) + (i % 3) * 2,
        y: offsets[(i + 1) % offsets.length] * (i % 2 === 1 ? 1 : -1) + (i % 2) * 3,
        scale: 1.22 - (i % 5) * 0.03,
        rot: (i % 2 === 0 ? -1 : 1) * (4 + (i % 4)),
        z: i + 1
      });
    }
    return stack;
  }

  function initClubsImages() {
    if (!clubsPin || !clubImgs.length) return;
    var n = clubImgs.length;
    var stackState = buildStackState(n);
    var pinRect = clubsPin.getBoundingClientRect();
    var centerX = pinRect.left + pinRect.width / 2;
    var centerY = pinRect.top + pinRect.height / 2;
    clubImgs.forEach(function (el, i) {
      var stack = stackState[i];
      if (!stack) return;
      el.style.zIndex = stack.z;
      var r = el.getBoundingClientRect();
      var cellCenterX = r.left + r.width / 2;
      var cellCenterY = r.top + r.height / 2;
      var startX = cellCenterX - centerX;
      var startY = cellCenterY - centerY;
      imageData[i] = {
        startX: startX,
        startY: startY,
        startScale: 1,
        startRot: 0,
        endX: stack.x,
        endY: stack.y,
        endScale: 2,
        endRot: stack.rot
      };
    });
  }

  function updateClubsProgress() {
    if (!clubsSection || !clubImgs.length || !imageData.length) return;
    var scrollY = window.scrollY || window.pageYOffset;
    var sectionTop = clubsSection.offsetTop;
    var viewHeight = window.innerHeight;
    var start = sectionTop;
    var scrollLength = viewHeight * CLUBS_SCROLL_LENGTH;
    var end = start + scrollLength;
    var progress = (scrollY - start) / (end - start);
    progress = Math.max(0, Math.min(1, progress));
    var e = progress;
    var ease = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
    clubImgs.forEach(function (el, i) {
      var d = imageData[i];
      if (!d) return;
      if (ease <= 0) {
        el.style.transform = 'none';
        return;
      }
      /* Moving to center: translate, scale up to 2, then slant at end */
      var tx = ease * (-d.startX + d.endX);
      var ty = ease * (-d.startY + d.endY);
      var scale = (1 - ease) * d.startScale + ease * d.endScale;
      var rot = (1 - ease) * d.startRot + ease * d.endRot;
      el.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ') rotate(' + rot + 'deg)';
    });
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 80);
    updateClubsProgress();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  function initFollowChars() {
    var followEls = document.querySelectorAll('.tagline-follow');
    var baseDelay = 2;
    var delayStep = 0.06;
    followEls.forEach(function (followEl) {
      if (!followEl || followEl.querySelector('.tagline-follow-char')) return;
      var text = followEl.textContent;
      followEl.textContent = '';
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'tagline-follow-char' + (text[i] === ' ' ? ' tagline-follow-char--space' : '');
        span.setAttribute('aria-hidden', 'true');
        span.textContent = text[i];
        span.style.animationDelay = (baseDelay + i * delayStep) + 's';
        followEl.appendChild(span);
      }
    });
  }

  function initTaglineLine() {
    document.querySelectorAll('.footer .tagline-line, .activate .tagline-line').forEach(function (path) {
      var section = path.closest('.footer') || path.closest('.activate');
      if (section) section.style.setProperty('--tagline-line-length', String(path.getTotalLength()));
    });
  }

  function initTaglineInView() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var wrap = entry.target;
          wrap.classList.add('tagline-wrap--in-view');
          var section = wrap.closest('.footer') || wrap.closest('.activate');
          if (section) section.classList.add(section.classList.contains('footer') ? 'footer--in-view' : 'activate--in-view');
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
    );
    document.querySelectorAll('.tagline-wrap').forEach(function (el) { observer.observe(el); });
  }

  /* Run tagline/follow inits as soon as script runs (footer is already injected by includes.js).
     On inner pages, window "load" can fire before this script runs, so we must not rely on it. */
  initFollowChars();
  initTaglineLine();
  initTaglineInView();

  window.addEventListener('load', function () {
    onScroll();
    requestAnimationFrame(function () {
      initClubsImages();
      updateClubsProgress();
    });
  });
  window.addEventListener('resize', function () {
    imageData = [];
    initClubsImages();
    updateClubsProgress();
  });

  onScroll();
})();
