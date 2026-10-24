(function () {
  'use strict';

  /* ---------------------------------------------------------
     ELEMENTS
     --------------------------------------------------------- */
  const overlay        = document.getElementById('overlay');
  const processingView = document.getElementById('processingView');
  const resultView     = document.getElementById('resultView');
  const progressBar    = document.getElementById('progressBar');
  const progressPct    = document.getElementById('progressPct');
  const statusText     = document.getElementById('statusText');
  const generateBtn    = document.getElementById('generateBtn');
  const closeBtn       = document.getElementById('closeBtn');
  const retryBtn       = document.getElementById('retryBtn');

  /* ---------------------------------------------------------
     CONFIG
     --------------------------------------------------------- */
  const DURATION = 15000; // 15 seconds

  const STEPS = [
    'Establishing secure connection…',
    'Verifying your account status…',
    'Checking payment records…',
    'Validating tax & maintenance fees…',
    'Generating encrypted WhatsApp link…',
    'Finalizing secure link…'
  ];

  let rafId = null;
  let timerId = null;
  let busy = false;

  /* ---------------------------------------------------------
     OVERLAY CONTROL
     --------------------------------------------------------- */
  function resetViews() {
    processingView.hidden = false;
    resultView.hidden = true;
    progressBar.style.width = '0%';
    progressPct.textContent = '0%';
    statusText.textContent = STEPS[0];
  }

  function openOverlay() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeOverlay() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    busy = false;
  }

  /* ---------------------------------------------------------
     PROCESSING FLOW
     --------------------------------------------------------- */
  function startProcessing() {
    if (busy) return;
    busy = true;

    resetViews();
    openOverlay();

    const startTime = performance.now();

    function tick(now) {
      const pct = Math.min((now - startTime) / DURATION, 1);

      progressBar.style.width = (pct * 100).toFixed(2) + '%';
      progressPct.textContent = Math.round(pct * 100) + '%';

      const stepIndex = Math.min(
        Math.floor(pct * STEPS.length),
        STEPS.length - 1
      );
      if (statusText.textContent !== STEPS[stepIndex]) {
        statusText.textContent = STEPS[stepIndex];
      }

      if (pct < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    timerId = setTimeout(showResult, DURATION);
  }

  function showResult() {
    // Stop the animation loop cleanly
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    timerId = null;

    progressBar.style.width = '100%';
    progressPct.textContent = '100%';

    processingView.hidden = true;
    resultView.hidden = false;
    busy = false;
  }

  /* ---------------------------------------------------------
     EVENTS
     --------------------------------------------------------- */
  generateBtn.addEventListener('click', startProcessing);

  retryBtn.addEventListener('click', function () {
    // Clean up any previous run, then restart
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (timerId) { clearTimeout(timerId); timerId = null; }
    busy = false;
    startProcessing();
  });

  closeBtn.addEventListener('click', closeOverlay);

  // Click on the dark backdrop (only in the result state) to close
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay && !processingView.hidden === false) {
      // Only allow closing when the result is displayed
      if (!resultView.hidden) closeOverlay();
    }
  });

  // Escape key closes only when the result is visible
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && overlay.classList.contains('active')) {
      if (!resultView.hidden) closeOverlay();
    }
  });

  /* ---------------------------------------------------------
     SCROLL REVEAL
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------------------------------------------------------
     FOOTER YEAR
     --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();