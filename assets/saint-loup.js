/* SAINT LOUP — header state, mobile drawer, product gallery */
(function () {
  var root = document.documentElement;

  /* Header: transparent over the homepage hero, glass once the hero has scrolled away */
  var hero = document.getElementById('sl-hero');
  var hdr = document.getElementById('sl-hdr');
  if (hero && hdr) {
    var ticking = false;
    var update = function () {
      ticking = false;
      root.classList.toggle('sl-solid', hero.getBoundingClientRect().bottom <= hdr.offsetHeight + 32);
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  } else {
    root.classList.add('sl-solid');
  }

  /* Mobile drawer */
  var drawer = document.getElementById('sl-drawer');
  var openBtn = document.getElementById('sl-open-menu');
  var closeBtn = document.getElementById('sl-close-menu');
  if (drawer && openBtn && closeBtn) {
    var openMenu = function () { drawer.hidden = false; openBtn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; closeBtn.focus(); };
    var closeMenu = function () { drawer.hidden = true; openBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; openBtn.focus(); };
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    drawer.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    drawer.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* Product gallery: thumbnails + arrows swap the large image */
  document.querySelectorAll('[data-sl-gallery]').forEach(function (gal) {
    var thumbs = Array.prototype.slice.call(gal.querySelectorAll('.sl-thumbs button'));
    var img = gal.querySelector('.sl-stage > img');
    var count = gal.querySelector('[data-sl-count]');
    if (!img || !thumbs.length) return;
    var idx = 0;
    var show = function (i) {
      idx = (i + thumbs.length) % thumbs.length;
      var b = thumbs[idx];
      img.removeAttribute('srcset');
      img.srcset = b.dataset.srcset;
      img.src = b.dataset.src;
      img.alt = b.dataset.alt || '';
      if (count) count.textContent = (idx + 1) + ' / ' + thumbs.length;
      thumbs.forEach(function (t, j) { t.setAttribute('aria-selected', j === idx ? 'true' : 'false'); });
    };
    thumbs.forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
    var prev = gal.querySelector('[data-sl-prev]');
    var next = gal.querySelector('[data-sl-next]');
    if (prev) prev.addEventListener('click', function () { show(idx - 1); });
    if (next) next.addEventListener('click', function () { show(idx + 1); });
  });

  /* Variant select keeps the price in sync */
  document.querySelectorAll('.sl-variant').forEach(function (sel) {
    sel.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('variant', sel.value);
      window.history.replaceState({}, '', url.toString());
    });
  });
})();
