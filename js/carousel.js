(function () {
  function buildCarousel(article) {
    const root = article.querySelector('.carousel-root');
    if (!root) return;

    let images;
    try {
      images = JSON.parse(article.dataset.images);
    } catch {
      return;
    }
    if (!images.length) return;

    const total = images.length;
    let current = 0;

    // ── DOM ──────────────────────────────────────────────
    root.style.cssText = 'position:relative;overflow:hidden;max-height:220px;';

    const track = document.createElement('div');
    track.style.cssText = 'display:flex;width:100%;transition:transform 0.38s cubic-bezier(.4,0,.2,1);will-change:transform;';

    images.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.style.cssText = 'min-width:100%;flex-shrink:0;';

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Screenshot ${i + 1}`;
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.style.cssText = 'width:100%;height:220px;object-fit:cover;object-position:top;display:block;';

        img.onerror = () => { img.style.display = 'none'; };

        slide.appendChild(img);
        track.appendChild(slide);
    });

    root.appendChild(track);

    // Only build controls when there's more than one image
    if (total < 2) return;

    // ── Arrows ───────────────────────────────────────────
    function makeArrow(dir) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', dir === -1 ? 'Previous screenshot' : 'Next screenshot');
      btn.style.cssText = [
        'position:absolute;top:50%;transform:translateY(-50%);',
        dir === -1 ? 'left:10px;' : 'right:10px;',
        'z-index:10;',
        'width:32px;height:32px;border-radius:50%;',
        'background:rgba(0,0,0,0.45);border:none;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'color:#fff;opacity:0;transition:opacity 0.2s;',
        'padding:0;',
      ].join('');

      // Chevron SVG (inline, no library dependency)
      btn.innerHTML = dir === -1
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

      btn.addEventListener('click', () => go(current + dir));
      root.appendChild(btn);
      return btn;
    }

    const prevBtn = makeArrow(-1);
    const nextBtn = makeArrow(1);

    // Show/hide arrows on hover
    root.addEventListener('mouseenter', () => {
      prevBtn.style.opacity = current > 0 ? '1' : '0';
      nextBtn.style.opacity = current < total - 1 ? '1' : '0';
    });
    root.addEventListener('mouseleave', () => {
      prevBtn.style.opacity = '0';
      nextBtn.style.opacity = '0';
    });

    // ── Dots ─────────────────────────────────────────────
    const dotsWrap = document.createElement('div');
    dotsWrap.style.cssText =
      'display:flex;justify-content:center;gap:6px;padding:10px 0 2px;';

    const dots = images.map((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', `Go to screenshot ${i + 1}`);
      d.style.cssText =
        'width:6px;height:6px;border-radius:50%;border:none;cursor:pointer;padding:0;transition:all 0.2s;background:var(--color-muted,#94a3b8);opacity:0.35;';
      d.addEventListener('click', () => go(i));
      dotsWrap.appendChild(d);
      return d;
    });

    // Insert dots between carousel root and card body
    root.insertAdjacentElement('afterend', dotsWrap);

    // ── Keyboard ─────────────────────────────────────────
    article.setAttribute('tabindex', '0');
    article.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    });

    // ── Touch swipe ──────────────────────────────────────
    let touchStartX = 0;
    root.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
    });

    // ── Core navigate ────────────────────────────────────
    function go(index) {
      current = Math.max(0, Math.min(total - 1, index));
      track.style.transform = `translateX(-${current * 100}%)`;

      dots.forEach((d, i) => {
        d.style.opacity = i === current ? '1' : '0.35';
        d.style.width = i === current ? '16px' : '6px';
        d.style.borderRadius = i === current ? '3px' : '50%';
      });

      // Update arrow visibility if currently hovered
      if (root.matches(':hover')) {
        prevBtn.style.opacity = current > 0 ? '1' : '0';
        nextBtn.style.opacity = current < total - 1 ? '1' : '0';
      }
    }

    go(0); // initialise dot state
  }

  function initCarousels() {
    document.querySelectorAll('[data-images]').forEach(buildCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
})();