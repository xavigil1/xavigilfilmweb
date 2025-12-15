/**
 * Simple autoplay rotator inspired by Bootstrap "Autoplaying carousels without controls".
 * - Uses `data-images` (comma-separated) on .image-rotator
 * - `data-interval` (ms) default 5000
 * - `data-pause` = "hover" (default) or "false"
 * - exposes `.pause()` and `.cycle()` methods on the rotator element
 */

document.addEventListener('DOMContentLoaded', () => {
  const rotators = document.querySelectorAll('.image-rotator');
  console.log('rotator.js: found rotators', rotators.length);

  rotators.forEach(rotator => {
    try {
    // Read images from data-images
    const imagesAttr = rotator.getAttribute('data-images') || '';
    const rawList = imagesAttr.split(',').map(s => s.trim()).filter(Boolean);

    // If no data-images but there's an inline .rotator-image-container with background-image, use it
    if (!rawList.length) {
      const existing = rotator.querySelector('.rotator-image-container');
      if (existing) {
        const bg = existing.style.backgroundImage || '';
        const m = bg.match(/url\(["']?(.*?)["']?\)/);
        if (m && m[1]) rawList.push(m[1]);
      }
    }

    if (!rawList.length) return; // nothing to do
    console.log('rotator.js: images for rotator', imagesAttr, rawList);

    // Resolve simple names to ./images/ if they look like filenames
    const resolvePath = p => (/^(https?:|\.|\/)/.test(p) ? p : `./images/${p}`);
    const images = rawList.map(resolvePath);

    // Build inner container and items
    const inner = document.createElement('div');
    inner.className = 'rotator-inner';
    inner.style.position = 'relative';
    inner.style.width = '100%';
    inner.style.height = '100%';
    inner.style.overflow = 'hidden';

    // Remove original inline container if exists (we'll recreate items)
    const existingContainer = rotator.querySelector('.rotator-image-container');
    if (existingContainer) existingContainer.remove();

    const items = [];
    images.forEach((src, i) => {
      const item = document.createElement('div');
      item.className = 'rotator-item';
      // Inline styles for positioning and transition
      item.style.position = 'absolute';
      item.style.top = '0';
      item.style.left = '0';
      item.style.width = '100%';
      item.style.height = '100%';
      item.style.backgroundImage = `url('${src}')`;
      item.style.backgroundSize = 'cover';
      item.style.backgroundPosition = 'center center';
      item.style.backgroundRepeat = 'no-repeat';
      item.style.transition = 'opacity 0.6s ease';
      item.style.opacity = i === 0 ? '1' : '0';
      item.style.zIndex = i === 0 ? '2' : '1';
      item.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
      inner.appendChild(item);
      items.push(item);
      // Preload image
      const img = new Image(); img.src = src;
    });

    // Append inner to rotator
    rotator.appendChild(inner);
    console.log('rotator.js: appended inner, items=', items.length);

    // Interval and controls
    const intervalMs = parseInt(rotator.getAttribute('data-interval')) || 5000;
    const pauseOption = rotator.getAttribute('data-pause') || 'hover';

    let current = 0;
    let timer = null;

    const showIndex = (ni) => {
      if (ni === current) return;
      const prev = current;
      const next = ni % items.length;
      // fade out prev, fade in next
      items[prev].style.opacity = '0';
      items[prev].style.zIndex = '1';
      items[prev].setAttribute('aria-hidden', 'true');

      items[next].style.opacity = '1';
      items[next].style.zIndex = '2';
      items[next].setAttribute('aria-hidden', 'false');

      current = next;
    };

    const next = () => showIndex((current + 1) % items.length);

    const start = () => {
      if (timer) return;
      timer = setInterval(next, intervalMs);
      rotator._isCycling = true;
    };

    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
      rotator._isCycling = false;
    };

    // Pause/resume events
    if (pauseOption !== 'false') {
      // hover pause
      rotator.addEventListener('mouseenter', () => { stop(); });
      rotator.addEventListener('mouseleave', () => { start(); });

      // touch: pause for two intervals after touchend
      rotator.addEventListener('touchend', () => {
        stop();
        setTimeout(() => { start(); }, intervalMs * 2);
      });
    }

    // Page Visibility API
    const onVisibility = () => {
      if (document.hidden) stop(); else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Expose API
    rotator.cycle = start;
    rotator.pause = stop;

    // Auto-start (autoplay) similar to data-bs-ride="carousel"
    start();
    } catch (err) {
      console.error('rotator.js: error initializing rotator', err);
    }
  });
});
