(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js-ready');

  // 1. Dynamic Year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Warm Paper <-> Evening Ink Theme Toggle
  var themeBtn = document.getElementById('theme-toggle');
  var themeLabel = document.getElementById('theme-label');

  function syncThemeLabel() {
    if (!themeLabel) return;
    var current = root.getAttribute('data-theme') === 'ink' ? 'ink' : 'paper';
    themeLabel.textContent = current === 'paper' ? 'Evening Ink' : 'Warm Paper';
  }
  syncThemeLabel();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'ink' ? 'ink' : 'paper';
      var next = current === 'paper' ? 'ink' : 'paper';
      root.setAttribute('data-theme', next);
      syncThemeLabel();
      try {
        localStorage.setItem('sp-editorial-theme', next);
      } catch (e) {}
    });
  }

  // 3. Top Reading Progress Hairline
  var progressBar = document.getElementById('scroll-progress');
  var ticking = false;

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
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

  // 4. Staggered Scroll-Reveal
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -2% 0px', threshold: 0.01 }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  // 5. Fluid Gliding Chapter Nav + Scroll-Spy
  var chapterNav = document.querySelector('.chapter-nav');
  var glider = document.getElementById('chapter-glider');
  var chapterLinks = Array.prototype.slice.call(document.querySelectorAll('.chapter-link'));

  function moveGliderTo(link) {
    if (!glider || !link || !chapterNav) return;
    var y = link.offsetTop;
    var h = link.offsetHeight;
    glider.style.transform = 'translateY(' + (y - 6) + 'px)';
    glider.style.height = h + 'px';
  }

  function getActiveLink() {
    for (var i = 0; i < chapterLinks.length; i++) {
      if (chapterLinks[i].classList.contains('active')) return chapterLinks[i];
    }
    return chapterLinks[0];
  }

  chapterLinks.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      moveGliderTo(link);
    });
  });

  if (chapterNav) {
    chapterNav.addEventListener('mouseleave', function () {
      moveGliderTo(getActiveLink());
    });
  }

  var chapters = chapterLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && chapters.length > 0) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var activeHref = '#' + entry.target.id;
            chapterLinks.forEach(function (link) {
              var match = link.getAttribute('href') === activeHref;
              link.classList.toggle('active', match);
              if (match) moveGliderTo(link);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -62% 0px', threshold: 0.05 }
    );
    chapters.forEach(function (sec) {
      spyObserver.observe(sec);
    });
  }

  window.addEventListener('resize', function () {
    moveGliderTo(getActiveLink());
  });
  moveGliderTo(getActiveLink());

  // 6. Fluid Career Role Drawers + Expand/Collapse All
  var roleEntries = Array.prototype.slice.call(document.querySelectorAll('[data-role]'));
  var toggleAllBtn = document.getElementById('toggle-all-roles');

  function syncToggleAllText() {
    if (!toggleAllBtn) return;
    var allOpen = roleEntries.every(function (el) {
      return el.classList.contains('is-open');
    });
    toggleAllBtn.setAttribute('data-expanded', String(allOpen));
    toggleAllBtn.textContent = allOpen ? 'Compact view' : 'Expand all roles';
  }

  roleEntries.forEach(function (entry) {
    var trigger = entry.querySelector('.role-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function () {
      var nowOpen = entry.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(nowOpen));
      syncToggleAllText();
    });
  });

  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', function () {
      var allOpen = toggleAllBtn.getAttribute('data-expanded') === 'true';
      roleEntries.forEach(function (entry, idx) {
        // Compact view keeps IBM (index 0) open so recent work remains visible
        var shouldOpen = allOpen ? idx === 0 : true;
        entry.classList.toggle('is-open', shouldOpen);
        var trigger = entry.querySelector('.role-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', String(shouldOpen));
      });
      syncToggleAllText();
    });
  }
  syncToggleAllText();

  // 7. Interactive 4-Step AI RCA Pipeline Explorer
  var pipeDetails = [
    'Continuously listens to <strong>IBM Instana</strong> anomaly events and <strong>Slack</strong> operational alert channels across 9 production clusters to trigger zero-touch first-response triage.',
    'Executes <strong>Retrieval-Augmented Generation (RAG)</strong> over internal engineering <strong>wiki runbooks</strong> and historical incident postmortems to ground diagnostic hypotheses.',
    'Invokes live agentic tools to inspect <strong>Apache Kafka</strong> consumer lag, custom delay dashboards, <strong>Kubernetes</strong> pod/deployment health, and <strong>OpenSearch</strong> error logs.',
    'Synthesizes cross-signal evidence into a structured <strong>Root Cause Analysis (RCA)</strong> brief with remediation steps delivered directly to SRE &amp; Operations engineers.'
  ];

  var pipeNodes = Array.prototype.slice.call(document.querySelectorAll('.pipe-node'));
  var pipeDetailEl = document.getElementById('pipeline-detail');

  function activatePipeStep(idx) {
    pipeNodes.forEach(function (node, i) {
      var active = i === idx;
      node.classList.toggle('active', active);
      node.setAttribute('aria-selected', String(active));
    });
    if (pipeDetailEl && pipeDetails[idx]) {
      pipeDetailEl.style.opacity = '0.35';
      setTimeout(function () {
        pipeDetailEl.innerHTML = pipeDetails[idx];
        pipeDetailEl.style.opacity = '1';
      }, 110);
    }
  }

  pipeNodes.forEach(function (node) {
    var step = parseInt(node.getAttribute('data-step') || '0', 10);
    node.addEventListener('click', function () {
      activatePipeStep(step);
    });
    node.addEventListener('mouseenter', function () {
      activatePipeStep(step);
    });
  });

  // 8. Fluid Capability Domain Highlighter
  var domainPills = Array.prototype.slice.call(document.querySelectorAll('.domain-pill'));
  var capRows = Array.prototype.slice.call(document.querySelectorAll('.cap-row'));

  domainPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var domain = pill.getAttribute('data-domain') || 'all';
      domainPills.forEach(function (p) {
        p.classList.toggle('active', p === pill);
      });
      capRows.forEach(function (row) {
        var rowDomain = row.getAttribute('data-cap');
        if (domain === 'all') {
          row.classList.remove('is-dimmed', 'is-highlighted');
        } else if (rowDomain === domain) {
          row.classList.remove('is-dimmed');
          row.classList.add('is-highlighted');
        } else {
          row.classList.add('is-dimmed');
          row.classList.remove('is-highlighted');
        }
      });
    });
  });

  // 9. One-Click Copy Email
  var copyBtn = document.getElementById('copy-email-btn');
  var copyStatus = document.getElementById('copy-status');
  if (copyBtn && copyStatus) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || 'skpatel0211@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          copyStatus.textContent = 'Copied';
          setTimeout(function () {
            copyStatus.textContent = 'Copy';
          }, 2200);
        });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  }
})();
