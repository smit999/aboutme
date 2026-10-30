(function () {
  'use strict';

  var root = document.documentElement;

  // 1. Dynamic Year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Theme Toggle (Light / Dark)
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('sp-grid-theme', next);
      } catch (e) {}
    });
  }

  // 3. Top Reading Progress Line
  var progressLine = document.getElementById('progress-line');
  var ticking = false;

  function updateProgress() {
    if (!progressLine) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var pct = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;
    progressLine.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateProgress();

  // 4. Cursor-Tracking Radial Spotlight Sheen
  var spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });

  // 5. Scroll-Spy Navigation Highlighting
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-links .nav-item'));
  var sections = navItems
    .map(function (link) {
      var href = link.getAttribute('href');
      return href && href.charAt(0) === '#' ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = '#' + entry.target.id;
            navItems.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === id);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0.05 }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  // 6. Interactive Skill Chip & "/" Live Search Highlighter
  var searchInput = document.getElementById('skill-filter-input');
  var clearKbd = document.getElementById('clear-filter-kbd');
  var skillChips = Array.prototype.slice.call(document.querySelectorAll('.skill-chip'));
  var searchableBlocks = Array.prototype.slice.call(document.querySelectorAll('.searchable-block'));
  var activeChipKw = '';

  function applyHighlight(rawQuery) {
    var q = (rawQuery || '').trim().toLowerCase();
    if (clearKbd) {
      clearKbd.textContent = q ? '×' : '/';
      clearKbd.title = q ? 'Clear filter' : 'Press / to focus';
    }

    skillChips.forEach(function (chip) {
      if (!q) {
        chip.classList.remove('is-active', 'is-faded');
        return;
      }
      var text = (chip.textContent + ' ' + (chip.getAttribute('data-kw') || '')).toLowerCase();
      var match = text.indexOf(q) !== -1;
      chip.classList.toggle('is-active', match);
      chip.classList.toggle('is-faded', !match);
    });

    searchableBlocks.forEach(function (block) {
      if (!q) {
        block.classList.remove('is-matched', 'is-unmatched');
        return;
      }
      var content = (block.textContent || '').toLowerCase();
      var hit = content.indexOf(q) !== -1;
      block.classList.toggle('is-matched', hit);
      block.classList.toggle('is-unmatched', !hit);
    });
  }

  skillChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var kw = chip.getAttribute('data-kw') || chip.textContent || '';
      if (activeChipKw.toLowerCase() === kw.toLowerCase()) {
        activeChipKw = '';
        if (searchInput) searchInput.value = '';
        applyHighlight('');
      } else {
        activeChipKw = kw;
        if (searchInput) searchInput.value = kw;
        applyHighlight(kw);
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      activeChipKw = searchInput.value;
      applyHighlight(searchInput.value);
    });
  }

  if (clearKbd && searchInput) {
    clearKbd.addEventListener('click', function () {
      if (searchInput.value) {
        activeChipKw = '';
        searchInput.value = '';
        applyHighlight('');
      } else {
        searchInput.focus();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== searchInput) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      }
    } else if (e.key === 'Escape' && searchInput && (document.activeElement === searchInput || searchInput.value)) {
      activeChipKw = '';
      searchInput.value = '';
      applyHighlight('');
      searchInput.blur();
    }
  });

  // 7. One-Click Copy Email
  var copyBtn = document.getElementById('copy-email-btn');
  var copyTag = document.getElementById('copy-tag');
  if (copyBtn && copyTag) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || 'skpatel0211@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          copyTag.textContent = 'Copied!';
          setTimeout(function () {
            copyTag.textContent = 'Copy';
          }, 2200);
        });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  }
})();
