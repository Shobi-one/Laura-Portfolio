const customCursorMedia = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
const scriptElement = document.currentScript;

if (customCursorMedia.matches) {
  const assetBase = scriptElement ? new URL('./', scriptElement.src) : new URL('./', window.location.href);
  const defaultCursorSrc = new URL('assets/cursor.png', assetBase).href;
  const hoverCursorSrc = new URL('assets/cursor_hover.png', assetBase).href;
  const cursorHotspotX = 8;
  const cursorHotspotY = 58;
  const textFieldSelector = 'input, textarea, [contenteditable="true"]';
  const hoverTargetSelector = 'a[href], button, .tile, .language-toggle, .back-link';

  const customCursor = document.createElement('img');
  customCursor.className = 'custom-cursor';
  customCursor.src = defaultCursorSrc;
  customCursor.alt = '';
  customCursor.setAttribute('aria-hidden', 'true');
  customCursor.decoding = 'async';

  document.documentElement.classList.add('has-custom-cursor');
  document.body.appendChild(customCursor);

  const hoverCursorImage = new Image();
  hoverCursorImage.src = hoverCursorSrc;

  const moveCursor = (event) => {
    customCursor.style.transform = `translate3d(${event.clientX - cursorHotspotX}px, ${event.clientY - cursorHotspotY}px, 0)`;

    const target = event.target instanceof Element ? event.target : null;
    if (target && target.closest(textFieldSelector)) {
      customCursor.classList.remove('is-visible');
      return;
    }

    const isHoverTarget = Boolean(target && target.closest(hoverTargetSelector));
    customCursor.src = isHoverTarget ? hoverCursorSrc : defaultCursorSrc;
    customCursor.classList.add('is-visible');
  };

  document.addEventListener('pointermove', moveCursor);
  document.addEventListener('pointerdown', moveCursor);
  document.addEventListener('pointerleave', () => {
    customCursor.classList.remove('is-visible', 'is-hover');
  });
}

const revealTargets = document.querySelectorAll('.tile');

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('revealed');
      obs.unobserve(entry.target);
    });
  },
  {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08,
  }
);

revealTargets.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index * 28, 480)}ms`;
  observer.observe(target);
});

if (document.querySelector('.category-page') && window.baguetteBox) {
  const galleryImages = document.querySelectorAll('.category-grid .tile img');

  galleryImages.forEach((img) => {
    if (img.closest('a')) {
      return;
    }

    const link = document.createElement('a');
    link.href = img.currentSrc || img.src;
    link.className = 'lightbox-link';
    link.setAttribute('aria-label', `Open image: ${img.alt || 'Artwork'}`);
    img.parentNode.insertBefore(link, img);
    link.appendChild(img);
  });

  baguetteBox.run('.category-page .category-grid', {
    captions: (element) => {
      const image = element.getElementsByTagName('img')[0];
      return image ? image.alt : '';
    },
    animation: 'fadeIn',
    noScrollbars: true,
  });
}
