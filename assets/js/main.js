(function () {
  'use strict';

  // 1. Dynamic Year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Theme Toggle (Dark / Light)
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('sp-theme', next);
      } catch (e) {}
    });
  }

  // 3. Mobile Navigation Drawer
  var menuBtn = document.getElementById('mobile-menu-btn');
  var siteNav = document.getElementById('site-nav');
  if (menuBtn && siteNav) {
    menuBtn.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Scroll-Spy Active Navigation Link
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav .nav-link'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var activeId = '#' + entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === activeId);
            });
          }
        });
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0.05 }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  // 5. Technical Skills Category Filter
  var filterTabs = document.querySelectorAll('.filter-tab');
  var skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var selected = tab.getAttribute('data-filter') || 'all';

      filterTabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });

      skillCards.forEach(function (card) {
        var cat = card.getAttribute('data-category');
        var show = selected === 'all' || cat === selected;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  // 6. One-Click Copy Email
  var copyBtn = document.getElementById('copy-email-btn');
  var copyBadge = document.getElementById('copy-badge');
  if (copyBtn && copyBadge) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || 'skpatel0211@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          copyBadge.textContent = 'Copied!';
          setTimeout(function () {
            copyBadge.textContent = 'Copy';
          }, 2200);
        });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  }
})();
